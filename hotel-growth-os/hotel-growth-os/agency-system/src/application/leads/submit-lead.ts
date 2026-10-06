import {
  parseLeadSubmission,
  type LeadSubmissionError,
} from "../../domain/leads/parse-lead-submission";
import type {
  AgencyLeadCrmPort,
  LeadUpsertDisposition,
} from "./agency-lead-crm-port";

export type SubmitLeadResult =
  | { status: "invalid"; errors: LeadSubmissionError[] }
  | { status: "accepted"; disposition: LeadUpsertDisposition }
  | { status: "delivery_failed" };

/**
 * Validates an inquiry and delegates it to an explicitly injected Agency CRM
 * port. This function does not choose a provider, persist data, retry, or log
 * contact details. Provider failure is deliberately returned without exposing
 * vendor error content to callers.
 */
export async function submitLead(
  input: unknown,
  crm: AgencyLeadCrmPort,
): Promise<SubmitLeadResult> {
  const parsed = parseLeadSubmission(input);
  if (!parsed.ok) return { status: "invalid", errors: parsed.errors };

  try {
    const acknowledgement = await crm.upsertLead(parsed.value);
    return { status: "accepted", disposition: acknowledgement.disposition };
  } catch {
    return { status: "delivery_failed" };
  }
}
