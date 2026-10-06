-- Hotel Growth OS: Operator Audit & Lead Reconciliation Schema
-- Extension of the production leads ledger for operator activity tracking
-- and lead reconciliation workflows.

-- 1. Add reconciliation columns to leads table
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS reconciled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reconciled_by TEXT,
  ADD COLUMN IF NOT EXISTS reconciliation_note TEXT;

-- 2. Operator audit log: records operator actions for accountability
CREATE TABLE IF NOT EXISTS public.operator_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL CHECK (action IN (
    'leads.viewed',
    'lead.reconciled',
    'lead.status_changed',
    'operator.signed_in',
    'operator.signed_out'
  )),
  operator_id TEXT,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  detail JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Indexes for efficient audit querying
CREATE INDEX IF NOT EXISTS idx_operator_audit_log_occurred_at
  ON public.operator_audit_log(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_operator_audit_log_action
  ON public.operator_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_operator_audit_log_lead_id
  ON public.operator_audit_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_reconciled_at
  ON public.leads(reconciled_at DESC) WHERE reconciled_at IS NOT NULL;

-- 4. Enable Row Level Security on the new table
ALTER TABLE public.operator_audit_log ENABLE ROW LEVEL SECURITY;

-- 5. Service role full access; deny public access
CREATE POLICY "Service role full access on operator_audit_log"
  ON public.operator_audit_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

REVOKE ALL ON TABLE public.operator_audit_log FROM anon, authenticated;