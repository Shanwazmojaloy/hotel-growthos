import { randomUUID } from "node:crypto";
import type {
  CreateOrGetLeadInput,
  CreateOrGetLeadResult,
  LeadEvent,
  LeadRecord,
  LeadStore,
} from "../domain/lead-ledger";

interface SupabaseLeadRow {
  id: string;
  intake_id: string;
  full_name: string;
  email: string;
  property_name: string;
  role: string | null;
  hotel_website: string | null;
  message: string;
  status: string;
  received_at: string;
  contact_permission_granted_at: string;
}

interface SupabaseEventRow {
  id: string;
  type: string;
  lead_id: string;
  intake_id: string;
  occurred_at: string;
}

export interface SupabaseLeadStoreOptions {
  url: string;
  apiKey: string;
  fetchFn?: typeof fetch;
}

function toIsoDate(now: number | undefined): string {
  const timestamp = now ?? Date.now();
  if (!Number.isSafeInteger(timestamp) || timestamp < 0) {
    throw new Error("Invalid lead timestamp.");
  }
  return new Date(timestamp).toISOString();
}

function rowToLeadRecord(row: SupabaseLeadRow): LeadRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    propertyName: row.property_name,
    role: row.role ?? null,
    hotelWebsite: row.hotel_website ?? null,
    message: row.message,
    status: "new",
    receivedAt: row.received_at,
    contactPermissionGrantedAt: row.contact_permission_granted_at,
  };
}

export class SupabaseLeadStore implements LeadStore {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly fetcher: typeof fetch;

  constructor(options: SupabaseLeadStoreOptions) {
    if (!options.url || !options.apiKey) {
      throw new Error("Supabase URL and API key are required.");
    }
    this.baseUrl = options.url.replace(/\/+$/, "");
    this.apiKey = options.apiKey;
    this.fetcher = options.fetchFn ?? globalThis.fetch.bind(globalThis);
  }

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    return {
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      ...extra,
    };
  }

  async createOrGetLead(input: CreateOrGetLeadInput): Promise<CreateOrGetLeadResult> {
    if (!input.intakeId || input.submission.contactPermission !== true) {
      throw new Error("A valid signed intake and contact permission are required.");
    }
    const occurredAt = toIsoDate(input.now);

    const findUrl = `${this.baseUrl}/rest/v1/leads?intake_id=eq.${encodeURIComponent(input.intakeId)}&select=*`;
    const findRes = await this.fetcher(findUrl, {
      method: "GET",
      headers: this.headers(),
    });

    if (!findRes.ok) {
      throw new Error(`Failed to query Supabase leads: ${findRes.status} ${findRes.statusText}`);
    }

    const existingRows = (await findRes.json()) as SupabaseLeadRow[];
    if (existingRows.length > 0) {
      const existing = existingRows[0];

      const eventQueryUrl = `${this.baseUrl}/rest/v1/lead_events?type=eq.lead.duplicate&intake_id=eq.${encodeURIComponent(input.intakeId)}&select=id`;
      const eventRes = await this.fetcher(eventQueryUrl, {
        method: "GET",
        headers: this.headers(),
      });

      if (eventRes.ok) {
        const events = (await eventRes.json()) as SupabaseEventRow[];
        if (events.length === 0) {
          await this.fetcher(`${this.baseUrl}/rest/v1/lead_events`, {
            method: "POST",
            headers: this.headers({ Prefer: "return=minimal" }),
            body: JSON.stringify({
              id: randomUUID(),
              type: "lead.duplicate",
              lead_id: existing.id,
              intake_id: input.intakeId,
              occurred_at: occurredAt,
            }),
          });
        }
      }

      return { lead: rowToLeadRecord(existing), duplicate: true };
    }

    const newId = randomUUID();
    const leadPayload = {
      id: newId,
      intake_id: input.intakeId,
      full_name: input.submission.fullName,
      email: input.submission.email,
      property_name: input.submission.propertyName,
      role: input.submission.role,
      hotel_website: input.submission.hotelWebsite,
      message: input.submission.message,
      status: "new",
      received_at: occurredAt,
      contact_permission_granted_at: occurredAt,
    };

    const insertLeadRes = await this.fetcher(`${this.baseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: this.headers({ Prefer: "return=representation" }),
      body: JSON.stringify(leadPayload),
    });

    if (!insertLeadRes.ok) {
      throw new Error(
        `Failed to insert lead into Supabase: ${insertLeadRes.status} ${insertLeadRes.statusText}`,
      );
    }

    const insertedRows = (await insertLeadRes.json()) as SupabaseLeadRow[];
    const createdLead = insertedRows[0] ?? leadPayload;

    await this.fetcher(`${this.baseUrl}/rest/v1/lead_events`, {
      method: "POST",
      headers: this.headers({ Prefer: "return=minimal" }),
      body: JSON.stringify({
        id: randomUUID(),
        type: "lead.created",
        lead_id: newId,
        intake_id: input.intakeId,
        occurred_at: occurredAt,
      }),
    });

    return { lead: rowToLeadRecord(createdLead as SupabaseLeadRow), duplicate: false };
  }

  async listLeads(): Promise<LeadRecord[]> {
    const url = `${this.baseUrl}/rest/v1/leads?select=*&order=received_at.desc`;
    const res = await this.fetcher(url, {
      method: "GET",
      headers: this.headers(),
    });

    if (!res.ok) {
      throw new Error(`Failed to list leads from Supabase: ${res.status} ${res.statusText}`);
    }

    const rows = (await res.json()) as SupabaseLeadRow[];
    return rows.map(rowToLeadRecord);
  }

  async listEvents(): Promise<LeadEvent[]> {
    const url = `${this.baseUrl}/rest/v1/lead_events?select=*&order=occurred_at.asc`;
    const res = await this.fetcher(url, {
      method: "GET",
      headers: this.headers(),
    });

    if (!res.ok) {
      throw new Error(`Failed to list lead events from Supabase: ${res.status} ${res.statusText}`);
    }

    const rows = (await res.json()) as SupabaseEventRow[];
    return rows.map((row) => ({
      id: row.id,
      type: row.type as "lead.created" | "lead.duplicate",
      leadId: row.lead_id,
      intakeId: row.intake_id,
      occurredAt: row.occurred_at,
    }));
  }
}
