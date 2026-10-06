# Hotel Growth OS — Direct Channel & Hospitality Architecture

An evidence-conscious vertical slice for the Hotel Growth OS concept. It delivers a public product overview, a secure, privacy-compliant consultation request form at `/contact`, and a password-protected operator inbox at `/ops/leads`.

The architecture enforces strict data boundaries: aggregate-first property analytics with zero guest personal data (PII) exposure. No live PMS, CRM, or booking write APIs are connected without explicit operator authorization.

## Included Slice

- `/` — public product overview outlining direct-channel growth, net revenue clarity, and human-guided operations.
- `/contact` — server-validated consultation intake form with an expiring HMAC-signed form token, explicit permission-to-reply consent, field boundaries/normalization, and an anti-spam honeypot.
- `/ops` — single-operator sign-in using server-configured password authentication and signed session cookies (`HttpOnly`, `SameSite=Lax`, `Secure` in production).
- `/ops/leads` — authenticated, read-only consultation inbox. Every request is verified server-side.
- **Production Storage Adapters:**
  - **Supabase PostgreSQL Ledger** (`SupabaseLeadStore`): Activated when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided. Supports multi-instance serverless deployments, idempotent deduplication, and PostgreSQL Row-Level Security (RLS). Schema is located in `supabase/migrations/20261005000000_leads_schema.sql`.
  - **Local File Ledger** (`FileLeadStore`): Fallback for local development or preview environments (`.local/lead-ledger.json` or `/tmp/lead-ledger.json` in serverless environments). Written atomically with restrictive permissions.

The ledger is an immutable intake store, **not an external CRM**: it has no marketing automation, third-party trackers, or unauthorized external syncs.

## Environment Configuration

Copy `.env.example` to `.env.local` for local execution or configure these in your deployment platform (e.g., Vercel Project Settings):

```bash
# Core Application Secret (Required in production)
# Must be at least 32 bytes (generate with `openssl rand -hex 32`)
HGO_APP_SECRET=

# Operator Password (Required for /ops access)
# Must be at least 16 characters (generate with `openssl rand -hex 24`)
OPS_PASSWORD=

# Supabase Production Database (Recommended for production)
# Project: https://gvjxjsjwuweecilcqqhb.supabase.co
SUPABASE_URL=https://gvjxjsjwuweecilcqqhb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=

# Local Ledger Path (Optional; defaults to .local/lead-ledger.json or /tmp/ on Vercel)
# HGO_LEDGER_PATH=/path/to/custom-lead-ledger.json
```

## Running Locally

```bash
npm ci
npm run dev
```

For a complete local test with operator access:

```bash
export HGO_APP_SECRET="$(openssl rand -hex 32)"
export OPS_PASSWORD="$(openssl rand -hex 24)"
npm run dev
```

## Production Deployment on Vercel

1. **Node.js Engine:** The project targets Next.js 16.3.8 and requires Node.js >= 20.9.0. This is declared in `package.json` under `engines.node`.
2. **Environment Variables:** In the Vercel Dashboard under **Settings > Environment Variables**, ensure `HGO_APP_SECRET` and `OPS_PASSWORD` are configured.
3. **Database Migration:** If using Supabase (`https://gvjxjsjwuweecilcqqhb.supabase.co`), run `supabase/migrations/20261005000000_leads_schema.sql` in the Supabase SQL editor and supply `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel.
4. **Vercel CLI Inspection:** To link or inspect remote deployment logs locally:
   ```bash
   npx vercel link
   npx vercel inspect <deployment-id> --logs
   ```

## Checks & Verification

```bash
npm run test       # Vitest suite (48 tests covering domain, tokens, replay, file & Supabase stores)
npm run typecheck  # Strict TypeScript check
npm run lint       # ESLint check
npm run build      # Next.js production build (Turbopack)
npm audit --omit=dev # Production dependency audit (0 vulnerabilities)
```

## Stack

- **Framework:** Next.js 16.3.8 (App Router, Turbopack)
- **UI:** React 19.2.4
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4 with system font stack (no Google Fonts egress)
- **Testing:** Vitest 5.0.3
