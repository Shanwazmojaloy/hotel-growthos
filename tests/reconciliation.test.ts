import { describe, expect, it } from "vitest";
import type { IntakeSubmission } from "../lib/domain/intake";
import { FileLeadStore } from "../lib/server/file-lead-store";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const NOW = Date.UTC(2026, 9, 7, 12, 0, 0);
const submission: IntakeSubmission = {
  fullName: "Alex Morgan",
  email: "alex@example.com",
  propertyName: "Northstar Hotel",
  role: "General manager",
  hotelWebsite: "https://northstar.example/",
  message: "I would like to explore Hotel Growth OS.",
  contactPermission: true,
};

async function createStore(): Promise<{ store: FileLeadStore; dir: string }> {
  const dir = await mkdtemp(join(tmpdir(), "hgo-reconcile-test-"));
  const store = new FileLeadStore({ filePath: join(dir, "ledger.json") });
  return { store, dir };
}

describe("FileLeadStore reconciliation", () => {
  it("reconciles a lead and updates its status", async () => {
    const { store, dir } = await createStore();
    try {
      const created = await store.createOrGetLead({
        intakeId: "intake-recon-1",
        submission,
        now: NOW,
      });

      expect(created.lead.status).toBe("new");
      expect(created.lead.reconciledAt).toBeNull();

      const reconciled = await store.reconcileLead!({
        leadId: created.lead.id,
        operatorId: "operator-1",
        note: "Reviewed and confirmed",
        now: NOW + 60_000,
      });

      expect(reconciled.status).toBe("reconciled");
      expect(reconciled.reconciledAt).toBeTruthy();
      expect(reconciled.reconciledBy).toBe("operator-1");
      expect(reconciled.reconciliationNote).toBe("Reviewed and confirmed");

      const leads = await store.listLeads();
      expect(leads[0].status).toBe("reconciled");
      expect(leads[0].reconciledBy).toBe("operator-1");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("throws when reconciling a non-existent lead", async () => {
    const { store, dir } = await createStore();
    try {
      await expect(
        store.reconcileLead!({
          leadId: "non-existent-id",
          operatorId: "operator-1",
        }),
      ).rejects.toThrow(/not found/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("persists audit log entries to the ledger file", async () => {
    const { store, dir } = await createStore();
    try {
      await store.logAuditEvent!("leads.viewed", {
        operatorId: "operator-1",
        now: NOW,
      });

      await store.logAuditEvent!("lead.reconciled", {
        operatorId: "operator-1",
        leadId: "lead-abc",
        detail: { note: "Reviewed" },
        now: NOW + 1000,
      });

      const raw = await readFile(join(dir, "ledger.json"), "utf8");
      const parsed = JSON.parse(raw);
      expect(parsed.auditLog).toHaveLength(2);
      expect(parsed.auditLog[0].action).toBe("leads.viewed");
      expect(parsed.auditLog[1].action).toBe("lead.reconciled");
      expect(parsed.auditLog[1].detail).toEqual({ note: "Reviewed" });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("migrates old ledger format without auditLog gracefully", async () => {
    const { store, dir } = await createStore();
    try {
      await store.createOrGetLead({
        intakeId: "intake-migrate",
        submission,
        now: NOW,
      });

      const raw = await readFile(join(dir, "ledger.json"), "utf8");
      const parsed = JSON.parse(raw);
      delete parsed.auditLog;
      const { writeFile } = await import("node:fs/promises");
      await writeFile(join(dir, "ledger.json"), JSON.stringify(parsed, null, 2));

      const leads = await store.listLeads();
      expect(leads).toHaveLength(1);
      expect(leads[0].fullName).toBe("Alex Morgan");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("includes reconciliation fields in newly created leads", async () => {
    const { store, dir } = await createStore();
    try {
      const result = await store.createOrGetLead({
        intakeId: "intake-fields",
        submission,
        now: NOW,
      });

      expect(result.lead.reconciledAt).toBeNull();
      expect(result.lead.reconciledBy).toBeNull();
      expect(result.lead.reconciliationNote).toBeNull();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});