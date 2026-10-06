import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = join(import.meta.dirname, "..");

async function readJson(relativePath: string): Promise<Record<string, unknown>> {
  const contents = await readFile(join(repositoryRoot, relativePath), "utf8");
  return JSON.parse(contents) as Record<string, unknown>;
}

// The Vercel deployment contract is build configuration, not application code, so a
// malformed or half-applied file fails the deployment instead of a test run. These
// assertions pin the values documented in the README's deployment section.
describe("Vercel deployment configuration", () => {
  it("pins the Next.js preset, build command, and `.next` output directory", async () => {
    const vercel = await readJson("vercel.json");

    expect(vercel.framework).toBe("nextjs");
    expect(vercel.buildCommand).toBe("npm run build");
    expect(vercel.outputDirectory).toBe(".next");
  });

  it("installs devDependencies so Tailwind, TypeScript, and ESLint are available at build time", async () => {
    const vercel = await readJson("vercel.json");

    // Without `--include=dev`, a production NODE_ENV makes `npm install` skip
    // devDependencies and `next build` fails on the missing Tailwind/TS toolchain.
    expect(vercel.installCommand).toBe("npm install --include=dev");
  });

  it("keeps `$schema` a plain URL so editors can resolve it", async () => {
    const vercel = await readJson("vercel.json");

    // Copying the file out of a rendered markdown page yields
    // "[https://...](https://...)", which Vercel ignores but editors cannot resolve.
    expect(vercel.$schema).toBe("https://openapi.vercel.sh/vercel.json");
  });

  it("declares the project as the microfrontends default application", async () => {
    const microfrontends = await readJson("microfrontends.json");
    const packageJson = await readJson("package.json");

    const applications = microfrontends.applications as Record<
      string,
      { development?: { fallback?: string } }
    >;
    const appName = packageJson.name as string;

    expect(Object.keys(applications)).toEqual([appName]);
    expect(applications[appName]?.development?.fallback).toMatch(/^https:\/\//);
  });

  it("keeps the dashboard and manifest Node.js versions on the same major", async () => {
    const packageJson = await readJson("package.json");
    const nvmrc = (await readFile(join(repositoryRoot, ".nvmrc"), "utf8")).trim();
    const engines = packageJson.engines as { node?: string };

    expect(engines.node).toBe(`${nvmrc}.x`);
    expect(nvmrc).toBe("22");
  });

  it("keeps the CI workflow's install and verify steps aligned with the Vercel build", async () => {
    const workflow = await readFile(
      join(repositoryRoot, ".github/workflows/ci.yml"),
      "utf8",
    );
    const vercel = await readJson("vercel.json");
    const installCommand = vercel.installCommand as string;

    // CI uses `npm ci` and Vercel uses `npm install`, but both must install
    // devDependencies for the toolchain in package.json to exist at build time.
    expect(installCommand).toMatch(/^npm (ci|install)\b/);
    expect(installCommand).toContain("--include=dev");
    expect(workflow).toContain("--include=dev");
    for (const step of ["npm run lint", "npm run typecheck", "npm test", "npm run build"]) {
      expect(workflow).toContain(step);
    }
  });
});
