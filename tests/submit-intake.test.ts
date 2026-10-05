import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createIntakeToken } from "../lib/domain/intake-token";
import { processIntakeSubmission } from "../lib/domain/submit-intake";
import { FileLeadStore } from "../lib/server/file-lead-store";

const SECRET = "test-intake-secret-that-is-at-least-32-bytes";
const NOW = Date.UTC(2026, 9, 5, 12, 0, 0);
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

async function createStore() {
  const directory = await mkdtemp(join(tmpdir(), "hgo-submit-test-"));
  temporaryDirectories.push(directory);
  return new FileLeadStore({ filePath: join(directory, "leads.json") });
}

function validForm(intakeToken: string, overrides: Record<string, unknown> = {}) {
  return {
    intakeToken,
    fullName: "Alex Morgan",
    email: "alex@example.com",
    propertyName: "Northstar Hotel",
    role: "General manager",
    hotelWebsite: "https://northstar.example",
    message: "I would like to understand the concept.",
    contactPermission: "yes",
    companyFax: "",
    ...overrides,
  };
}

describe("processIntakeSubmission", () => {
  it("accepts one valid request and stores only the normalized record", async () => {
    const store = await createStore();
    const token = createIntakeToken(SECRET, { now: NOW });
    const result = await processIntakeSubmission({
      fields: validForm(token),
      secret: SECRET,
      store,
      now: NOW + 1,
    });

    expect(result.status).toBe("success");
    if (result.status !== "success") return;
    expect(result.duplicate).toBe(false);
    expect(result.leadId).toBeTruthy();
    expect(await store.listLeads()).toHaveLength(1);
    expect((await store.listLeads())[0].email).toBe("alex@example.com");
  });

  it("is idempotent when the same signed form is replayed", async () => {
    const store = await createStore();
    const token = createIntakeToken(SECRET, { now: NOW });
    const first = await processIntakeSubmission({
      fields: validForm(token),
      secret: SECRET,
      store,
      now: NOW + 1,
    });
    const replay = await processIntakeSubmission({
      fields: validForm(token, { fullName: "Different name", email: "other@example.com" }),
      secret: SECRET,
      store,
      now: NOW + 2,
    });

    expect(first.status).toBe("success");
    expect(replay.status).toBe("success");
    if (first.status === "success" && replay.status === "success") {
      expect(replay.duplicate).toBe(true);
      expect(replay.leadId).toBe(first.leadId);
    }
    expect(await store.listLeads()).toHaveLength(1);
    expect((await store.listEvents()).map((event) => event.type)).toEqual([
      "lead.created",
      "lead.duplicate",
    ]);
  });

  it("rejects missing, forged, and expired tokens before writing", async () => {
    const store = await createStore();
    const validToken = createIntakeToken(SECRET, { now: NOW });
    const expiredToken = createIntakeToken(SECRET, { now: NOW - 3 * 60 * 60_000 });

    for (const intakeToken of ["", `${validToken}x`, expiredToken]) {
      const result = await processIntakeSubmission({
        fields: validForm(intakeToken),
        secret: SECRET,
        store,
        now: NOW,
      });
      expect(result.status).toBe("invalid-token");
    }
    expect(await store.listLeads()).toHaveLength(0);
  });

  it("requires reply permission and does not persist invalid data", async () => {
    const store = await createStore();
    const token = createIntakeToken(SECRET, { now: NOW });
    const result = await processIntakeSubmission({
      fields: validForm(token, { contactPermission: "no" }),
      secret: SECRET,
      store,
      now: NOW,
    });

    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(result.errors.contactPermission).toBeDefined();
    }
    expect(await store.listLeads()).toHaveLength(0);
  });

  it("silently discards a completed honeypot submission", async () => {
    const store = await createStore();
    const token = createIntakeToken(SECRET, { now: NOW });
    const result = await processIntakeSubmission({
      fields: validForm(token, { companyFax: "bot-filled-this" }),
      secret: SECRET,
      store,
      now: NOW,
    });

    expect(result).toEqual({ status: "success", duplicate: false, leadId: null });
    expect(await store.listLeads()).toHaveLength(0);
  });

  it("returns a safe unavailable state if the local ledger cannot be written", async () => {
    const token = createIntakeToken(SECRET, { now: NOW });
    const failingStore = {
      createOrGetLead: vi.fn().mockRejectedValue(new Error("private file path")),
    } as unknown as FileLeadStore;

    const result = await processIntakeSubmission({
      fields: validForm(token),
      secret: SECRET,
      store: failingStore,
      now: NOW,
    });

    expect(result).toEqual({ status: "unavailable" });
  });
});
