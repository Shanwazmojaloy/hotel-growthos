import type { ParsedLeadSubmission } from "../../domain/leads/parse-lead-submission";

export type LeadUpsertDisposition = "created" | "updated";

export interface AgencyLeadCrmPort {
  /**
   * Provider boundary for an approved Agency CRM. No production adapter is
   * configured; provider-specific identity, deduplication and retry rules remain
   * undecided. Contract tests use an in-process fake only.
   */
  upsertLead(
    lead: ParsedLeadSubmission,
  ): Promise<{ disposition: LeadUpsertDisposition }>;
}
