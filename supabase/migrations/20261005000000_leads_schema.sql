-- Hotel Growth OS: Production Leads Ledger Schema
-- Designed for Supabase PostgreSQL (Project: https://gvjxjsjwuweecilcqqhb.supabase.co)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Leads table: immutable intake records
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intake_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  property_name TEXT NOT NULL,
  role TEXT,
  hotel_website TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  contact_permission_granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Lead Events table: audit trail for created / duplicate replay events
CREATE TABLE IF NOT EXISTS public.lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('lead.created', 'lead.duplicate')),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  intake_id TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for efficient querying and deduplication
CREATE INDEX IF NOT EXISTS idx_leads_intake_id ON public.leads(intake_id);
CREATE INDEX IF NOT EXISTS idx_leads_received_at ON public.leads(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_events_intake_id ON public.lead_events(intake_id);
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON public.lead_events(lead_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;

-- Deny public/anon access by default; allow service_role full access
CREATE POLICY "Service role full access on leads"
  ON public.leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on lead_events"
  ON public.lead_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Revoke all direct permissions from anon and authenticated roles
REVOKE ALL ON TABLE public.leads FROM anon, authenticated;
REVOKE ALL ON TABLE public.lead_events FROM anon, authenticated;
