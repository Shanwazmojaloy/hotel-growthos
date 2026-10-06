import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = join(import.meta.dirname, "..");

async function readJson(relativePath: string): Promise<Record<string, unknown>> {
  const contents = await readFile(join(repositoryRoot, relativePath), "utf8");
  return JSON.parse(contents) as Record<string, unknown>;
}

/**
 * Returns the body of a Markdown section, from its heading to the next heading of the
 * same level. Returns "" when the heading is absent, so a renamed section fails loudly.
 */
function sliceSection(markdown: string, heading: string): string {
  const lines = markdown.split("\n");
  const start = lines.indexOf(heading);
  if (start === -1) return "";
  const end = lines.findIndex(
    (line, index) => index > start && line.startsWith(`${heading.slice(0, heading.indexOf(" "))} `),
  );
  return lines.slice(start, end === -1 ? undefined : end).join("\n");
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

  it("contains no key outside the set this repo intends to use", async () => {
    const vercel = await readJson("vercel.json");

    // The published schema (https://openapi.vercel.sh/vercel.json) sets
    // `additionalProperties: false` at the top level, so a stray key is rejected at
    // deploy time with an opaque "invalid vercel.json" instead of a line number.
    // Asserting the exact key set turns that into a test failure that names the key.
    expect(Object.keys(vercel).sort()).toEqual([
      "$schema",
      "buildCommand",
      "framework",
      "installCommand",
      "outputDirectory",
    ]);
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
    expect(nvmrc).toBe("24");
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

  it("resolves the CI Node.js version from `.nvmrc` instead of hardcoding a major", async () => {
    const workflow = await readFile(
      join(repositoryRoot, ".github/workflows/ci.yml"),
      "utf8",
    );

    // A hardcoded `node-version:` major in CI drifts from `.nvmrc`/`engines.node`
    // when only one of them is bumped. Reading the file keeps all three on one source.
    expect(workflow).toContain("node-version-file: .nvmrc");
  });

  it("wires `microfrontends.json` into the Next.js build", async () => {
    const nextConfig = await readFile(join(repositoryRoot, "next.config.ts"), "utf8");

    // The blocking `mfe-config-present` deployment check passes only when the
    // manifest reaches the build output, which happens through withMicrofrontends.
    expect(nextConfig).toContain('from "@vercel/microfrontends/next/config"');
    expect(nextConfig).toMatch(/withMicrofrontends\(\s*nextConfig\s*\)/);
  });

  it("keeps the microfrontends manifest `$schema` a plain URL too", async () => {
    const microfrontends = await readJson("microfrontends.json");

    expect(microfrontends.$schema).toBe("https://openapi.vercel.sh/microfrontends.json");
  });

  it("documents the same build command, install command, and output directory as `vercel.json`", async () => {
    const readme = await readFile(join(repositoryRoot, "README.md"), "utf8");
    const vercel = await readJson("vercel.json");

    // The deployment section is the runbook a human follows when the dashboard and
    // vercel.json disagree. Scope the assertion to that section: the same command
    // strings also appear under "Checks & Verification", so a whole-file search
    // would still pass after the runbook itself drifted.
    const section = sliceSection(readme, "## Production Deployment on Vercel");
    expect(section).not.toBe("");

    for (const value of [
      vercel.buildCommand as string,
      vercel.installCommand as string,
      `\`${vercel.outputDirectory}\``,
    ]) {
      expect(section).toContain(value);
    }
    expect(section).toContain("**Next.js** framework preset");
  });
});
