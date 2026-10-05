import type { LeadStore } from "./lead-ledger";
import type { IntakeFieldErrors } from "./intake";
import { validateIntakeSubmission } from "./intake";
import { verifyIntakeToken } from "./intake-token";

export type IntakeSubmissionResult =
  | { status: "success"; duplicate: boolean; leadId: string | null }
  | { status: "invalid"; errors: IntakeFieldErrors }
  | { status: "invalid-token" }
  | { status: "unavailable" };

export interface ProcessIntakeSubmissionInput {
  fields: unknown;
  secret: string;
  store: LeadStore;
  now?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function processIntakeSubmission({
  fields,
  secret,
  store,
  now = Date.now(),
}: ProcessIntakeSubmissionInput): Promise<IntakeSubmissionResult> {
  if (!isRecord(fields)) return { status: "invalid-token" };

  const tokenResult = verifyIntakeToken(fields.intakeToken, secret, now);
  if (!tokenResult.valid) return { status: "invalid-token" };

  const honeypot = fields.companyFax;
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { status: "success", duplicate: false, leadId: null };
  }

  const validation = validateIntakeSubmission(fields);
  if (!validation.ok) return { status: "invalid", errors: validation.errors };

  try {
    const persisted = await store.createOrGetLead({
      intakeId: tokenResult.claims.intakeId,
      submission: validation.data,
      now,
    });
    return {
      status: "success",
      duplicate: persisted.duplicate,
      leadId: persisted.lead.id,
    };
  } catch {
    return { status: "unavailable" };
  }
}
