import type { IntakeSubmission } from "./intake";

export type LeadStatus = "new" | "reconciled";
export type LeadEventType = "lead.created" | "lead.duplicate";

export interface LeadRecord extends Omit<IntakeSubmission, "contactPermission"> {
  id: string;
  status: LeadStatus;
  receivedAt: string;
  contactPermissionGrantedAt: string;
  reconciledAt: string | null;
  reconciledBy: string | null;
  reconciliationNote: string | null;
}

export interface LeadEvent {
  id: string;
  type: LeadEventType;
  leadId: string;
  intakeId: string;
  occurredAt: string;
}

export type OperatorAuditAction =
  | "leads.viewed"
  | "lead.reconciled"
  | "lead.status_changed"
  | "operator.signed_in"
  | "operator.signed_out";

export interface OperatorAuditEntry {
  id: string;
  action: OperatorAuditAction;
  operatorId: string | null;
  leadId: string | null;
  detail: Record<string, unknown> | null;
  occurredAt: string;
}

export interface CreateOrGetLeadInput {
  intakeId: string;
  submission: IntakeSubmission;
  now?: number;
}

export interface ReconcileLeadInput {
  leadId: string;
  operatorId: string;
  note?: string;
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
  reconcileLead?(input: ReconcileLeadInput): Promise<LeadRecord>;
  logAuditEvent?(
    action: OperatorAuditAction,
    context: { operatorId?: string; leadId?: string; detail?: Record<string, unknown>; now?: number },
  ): Promise<void>;
}