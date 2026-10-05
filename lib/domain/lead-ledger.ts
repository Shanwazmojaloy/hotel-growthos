import type { IntakeSubmission } from "./intake";

export type LeadStatus = "new";
export type LeadEventType = "lead.created" | "lead.duplicate";

export interface LeadRecord extends Omit<IntakeSubmission, "contactPermission"> {
  id: string;
  status: LeadStatus;
  receivedAt: string;
  contactPermissionGrantedAt: string;
}

export interface LeadEvent {
  id: string;
  type: LeadEventType;
  leadId: string;
  intakeId: string;
  occurredAt: string;
}

export interface CreateOrGetLeadInput {
  intakeId: string;
  submission: IntakeSubmission;
  now?: number;
}

export interface CreateOrGetLeadResult {
  lead: LeadRecord;
  duplicate: boolean;
}

export interface LeadStore {
  createOrGetLead(input: CreateOrGetLeadInput): Promise<CreateOrGetLeadResult>;
  listLeads(): Promise<LeadRecord[]>;
  listEvents(): Promise<LeadEvent[]>;
}
