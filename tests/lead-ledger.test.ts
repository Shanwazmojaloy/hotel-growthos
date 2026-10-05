import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { IntakeSubmission } from "../lib/domain/intake";
import { FileLeadStore } from "../lib/server/file-lead-store";

const NOW = Date.UTC(2026, 9, 5, 12, 0, 0);
const submission: IntakeSubmission = {
  fullName: "Alex Morgan",
  email: "alex@example.com",
  propertyName: "Northstar Hotel",
  role: "General manager",
  hotelWebsite: "https://northstar.example/",
  message: "I would like to understand the concept.",
  contactPermission: true,
};

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

async function createStore() {
  const directory = await mkdtemp(join(tmpdir(), "hgo-ledger-test-"));
  temporaryDirectories.push(directory);
  return {
    directory,
    store: new FileLeadStore({ filePath: join(directory, "private", "leads.json") }),
  };
}

describe("FileLeadStore", () => {
  it("creates a lead and records a minimal creation event", async () => {
    const { store, directory } = await createStore();
    const result = await store.createOrGetLead({
      intakeId: "intake-one",
      submission,
      now: NOW,
    });

    expect(result.duplicate).toBe(false);
    expect(result.lead).toMatchObject({
      fullName: "Alex Morgan",
      email: "alex@example.com",
      propertyName: "Northstar Hotel",
      status: "new",
      receivedAt: new Date(NOW).toISOString(),
      contactPermissionGrantedAt: new Date(NOW).toISOString(),
    });
    expect(result.lead.id).toMatch(/^[0-9a-f-]{36}$/i);

    const events = await store.listEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      type: "lead.created",
      leadId: result.lead.id,
      intakeId: "intake-one",
      occurredAt: new Date(NOW).toISOString(),
    });
    expect(events[0]).not.toHaveProperty("email");
    expect((await stat(join(directory, "private", "leads.json"))).mode & 0o077).toBe(0);
  });

  it("returns the original lead for a replay and audits the duplicate", async () => {
    const { store } = await createStore();
    const first = await store.createOrGetLead({ intakeId: "same-request", submission, now: NOW });
    const replay = await store.createOrGetLead({
      intakeId: "same-request",
      submission: { ...submission, fullName: "A changed replay" },
      now: NOW + 1_000,
    });
    const secondReplay = await store.createOrGetLead({
      intakeId: "same-request",
      submission,
      now: NOW + 2_000,
    });

    expect(replay.duplicate).toBe(true);
    expect(secondReplay.duplicate).toBe(true);
    expect(replay.lead.id).toBe(first.lead.id);
    expect((await store.listLeads()).map((lead) => lead.id)).toEqual([first.lead.id]);
    expect(await store.listEvents()).toMatchObject([
      { type: "lead.created", leadId: first.lead.id },
      { type: "lead.duplicate", leadId: first.lead.id },
    ]);
  });

  it("allows different signed intake ids to create separate requests", async () => {
    const { store } = await createStore();
    const first = await store.createOrGetLead({ intakeId: "request-a", submission, now: NOW });
    const second = await store.createOrGetLead({ intakeId: "request-b", submission, now: NOW + 1 });

    expect(second.lead.id).not.toBe(first.lead.id);
    expect(await store.listLeads()).toHaveLength(2);
  });

  it("serializes concurrent replays so only one lead is created", async () => {
    const { store, directory } = await createStore();
    const anotherStoreInstance = new FileLeadStore({
      filePath: join(directory, "private", "leads.json"),
    });
    const results = await Promise.all(
      Array.from({ length: 8 }, (_, index) =>
        (index % 2 === 0 ? store : anotherStoreInstance).createOrGetLead({
          intakeId: "concurrent-request",
          submission,
          now: NOW + index,
        }),
      ),
    );

    expect(new Set(results.map((result) => result.lead.id)).size).toBe(1);
    expect(results.filter((result) => !result.duplicate)).toHaveLength(1);
    expect(await store.listLeads()).toHaveLength(1);
    expect(await store.listEvents()).toHaveLength(2);
  });

  it("persists across repository instances and lists newest first", async () => {
    const { store, directory } = await createStore();
    const older = await store.createOrGetLead({ intakeId: "older", submission, now: NOW });
    const newer = await store.createOrGetLead({ intakeId: "newer", submission, now: NOW + 1_000 });
    const reloaded = new FileLeadStore({ filePath: join(directory, "private", "leads.json") });

    expect((await reloaded.listLeads()).map((lead) => lead.id)).toEqual([
      newer.lead.id,
      older.lead.id,
    ]);
  });

  it("stores no action token or secret in the ledger", async () => {
    const { store, directory } = await createStore();
    await store.createOrGetLead({ intakeId: "opaque-intake-id", submission, now: NOW });
    const serialized = await readFile(join(directory, "private", "leads.json"), "utf8");

    expect(serialized).not.toContain("intakeToken");
    expect(serialized).not.toContain("session");
    expect(serialized).not.toContain("signing-secret");
  });

  it("fails closed on a corrupt ledger without overwriting it", async () => {
    const { store, directory } = await createStore();
    const filePath = join(directory, "private", "leads.json");
    await store.createOrGetLead({ intakeId: "valid", submission, now: NOW });
    await (await import("node:fs/promises")).writeFile(filePath, "not-json");

    await expect(store.listLeads()).rejects.toThrow();
    await expect(
      store.createOrGetLead({ intakeId: "new", submission, now: NOW + 1 }),
    ).rejects.toThrow();
    expect(await readFile(filePath, "utf8")).toBe("not-json");
  });
});
