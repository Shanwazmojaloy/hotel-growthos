import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, rm, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type {
  CreateOrGetLeadInput,
  CreateOrGetLeadResult,
  LeadEvent,
  LeadRecord,
  LeadStore,
} from "../domain/lead-ledger";

const LEDGER_VERSION = 1;
const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

interface StoredLead extends LeadRecord {
  intakeId: string;
}

interface LedgerDocument {
  version: typeof LEDGER_VERSION;
  leads: StoredLead[];
  events: LeadEvent[];
}

const lockTails = new Map<string, Promise<void>>();

async function withFileLock<T>(filePath: string, operation: () => Promise<T>): Promise<T> {
  const previous = lockTails.get(filePath) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolveGate) => {
    release = resolveGate;
  });
  const tail = previous.then(() => gate);
  lockTails.set(filePath, tail);

  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (lockTails.get(filePath) === tail) lockTails.delete(filePath);
  }
}

function emptyLedger(): LedgerDocument {
  return { version: LEDGER_VERSION, leads: [], events: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isIsoDate(value: unknown): value is string {
  return isString(value) && Number.isFinite(Date.parse(value));
}

function isStoredLead(value: unknown): value is StoredLead {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    value.id.length > 0 &&
    isString(value.intakeId) &&
    value.intakeId.length > 0 &&
    isString(value.fullName) &&
    isString(value.email) &&
    isString(value.propertyName) &&
    isNullableString(value.role) &&
    isNullableString(value.hotelWebsite) &&
    isString(value.message) &&
    value.status === "new" &&
    isIsoDate(value.receivedAt) &&
    isIsoDate(value.contactPermissionGrantedAt)
  );
}

function isLeadEvent(value: unknown): value is LeadEvent {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    (value.type === "lead.created" || value.type === "lead.duplicate") &&
    isString(value.leadId) &&
    isString(value.intakeId) &&
    isIsoDate(value.occurredAt)
  );
}

function parseLedger(value: unknown): LedgerDocument {
  if (
    !isRecord(value) ||
    value.version !== LEDGER_VERSION ||
    !Array.isArray(value.leads) ||
    !Array.isArray(value.events) ||
    !value.leads.every(isStoredLead) ||
    !value.events.every(isLeadEvent)
  ) {
    throw new Error("The local lead ledger is invalid; refusing to overwrite it.");
  }
  return value as unknown as LedgerDocument;
}

function publicLead(lead: StoredLead): LeadRecord {
  return {
    id: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    propertyName: lead.propertyName,
    role: lead.role,
    hotelWebsite: lead.hotelWebsite,
    message: lead.message,
    status: lead.status,
    receivedAt: lead.receivedAt,
    contactPermissionGrantedAt: lead.contactPermissionGrantedAt,
  };
}

function toIsoDate(now: number | undefined): string {
  const timestamp = now ?? Date.now();
  if (!Number.isSafeInteger(timestamp) || timestamp < 0) {
    throw new Error("Invalid lead timestamp.");
  }
  try {
    return new Date(timestamp).toISOString();
  } catch {
    throw new Error("Invalid lead timestamp.");
  }
}

export class FileLeadStore implements LeadStore {
  private readonly filePath: string;
  private readonly maxBytes: number;

  constructor(options: { filePath: string; maxBytes?: number }) {
    if (!options.filePath) throw new Error("A ledger file path is required.");
    this.filePath = resolve(options.filePath);
    this.maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
    if (!Number.isSafeInteger(this.maxBytes) || this.maxBytes < 1_024) {
      throw new Error("The lead ledger size limit must be at least 1 KB.");
    }
  }

  private async readLedger(): Promise<LedgerDocument> {
    try {
      const metadata = await stat(this.filePath);
      if (metadata.size > this.maxBytes) {
        throw new Error("The local lead ledger exceeds its configured size limit.");
      }
      const serialized = await readFile(this.filePath, "utf8");
      let parsed: unknown;
      try {
        parsed = JSON.parse(serialized);
      } catch {
        throw new Error("The local lead ledger cannot be parsed; refusing to overwrite it.");
      }
      return parseLedger(parsed);
    } catch (error) {
      if (isRecord(error) && error.code === "ENOENT") return emptyLedger();
      throw error;
    }
  }

  private async writeLedger(ledger: LedgerDocument): Promise<void> {
    const serialized = `${JSON.stringify(ledger, null, 2)}\n`;
    if (Buffer.byteLength(serialized, "utf8") > this.maxBytes) {
      throw new Error("The local lead ledger has reached its configured size limit.");
    }

    await mkdir(dirname(this.filePath), { recursive: true, mode: 0o700 });
    const temporaryPath = `${this.filePath}.${process.pid}.${randomUUID()}.tmp`;
    const handle = await open(temporaryPath, "wx", 0o600);
    try {
      await handle.writeFile(serialized, "utf8");
      await handle.sync();
    } catch (error) {
      await handle.close();
      await rm(temporaryPath, { force: true });
      throw error;
    }
    await handle.close();

    try {
      await rename(temporaryPath, this.filePath);
    } catch (error) {
      await rm(temporaryPath, { force: true });
      throw error;
    }
  }

  async createOrGetLead(input: CreateOrGetLeadInput): Promise<CreateOrGetLeadResult> {
    if (!input.intakeId || input.submission.contactPermission !== true) {
      throw new Error("A valid signed intake and contact permission are required.");
    }
    const occurredAt = toIsoDate(input.now);

    return withFileLock(this.filePath, async () => {
      const ledger = await this.readLedger();
      const existing = ledger.leads.find((lead) => lead.intakeId === input.intakeId);
      if (existing) {
        const duplicateWasAudited = ledger.events.some(
          (event) => event.type === "lead.duplicate" && event.intakeId === input.intakeId,
        );
        if (!duplicateWasAudited) {
          ledger.events.push({
            id: randomUUID(),
            type: "lead.duplicate",
            leadId: existing.id,
            intakeId: input.intakeId,
            occurredAt,
          });
          await this.writeLedger(ledger);
        }
        return { lead: publicLead(existing), duplicate: true };
      }

      const lead: StoredLead = {
        id: randomUUID(),
        intakeId: input.intakeId,
        fullName: input.submission.fullName,
        email: input.submission.email,
        propertyName: input.submission.propertyName,
        role: input.submission.role,
        hotelWebsite: input.submission.hotelWebsite,
        message: input.submission.message,
        status: "new",
        receivedAt: occurredAt,
        contactPermissionGrantedAt: occurredAt,
      };
      ledger.leads.push(lead);
      ledger.events.push({
        id: randomUUID(),
        type: "lead.created",
        leadId: lead.id,
        intakeId: input.intakeId,
        occurredAt,
      });
      await this.writeLedger(ledger);
      return { lead: publicLead(lead), duplicate: false };
    });
  }

  async listLeads(): Promise<LeadRecord[]> {
    const ledger = await this.readLedger();
    return ledger.leads
      .map(publicLead)
      .sort((first, second) => second.receivedAt.localeCompare(first.receivedAt));
  }

  async listEvents(): Promise<LeadEvent[]> {
    const ledger = await this.readLedger();
    return ledger.events.map((event) => ({ ...event }));
  }
}
