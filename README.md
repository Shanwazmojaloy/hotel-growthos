# Hotel Growth OS — concept preview

A small, evidence-conscious vertical slice for the Hotel Growth OS concept. It replaces the stock Next.js starter page with a public product preview, a consented product-discovery form, and a password-protected operator inbox.

**This is a local prototype, not a production hotel product.** Page copy is explicitly placeholder. No CRM, PMS, hotel account, guest data, email provider, analytics service, or external system is connected. The prototype sends no automatic replies or marketing messages.

## Included slice

- `/` — concept page with synthetic-only interface art and no performance claims or customer proof.
- `/contact` — server-validated intake form with an expiring HMAC-signed form token, a required permission-to-reply checkbox, field limits, and a basic honeypot.
- `/ops` — single-operator sign-in using a server-configured password and signed session cookie.
- `/ops/leads` — authenticated, read-only request inbox. Every view checks the session on the server.
- `.local/lead-ledger.json` — default local ledger, written atomically with restrictive file permissions. Intake replays using the same signed form token resolve to the original lead; at most one minimal duplicate event is recorded per token.

The ledger is an intake record store, **not a CRM**: it has no pipeline, scoring, enrichment, export, messaging, or third-party sync.

## Run locally

```bash
npm ci
npm run dev
```

The public form works in development with an ephemeral process-local signing key when `HGO_APP_SECRET` is not set. Operator access is disabled until configured. For a complete local smoke test, configure server-only values before starting Next.js:

```bash
export HGO_APP_SECRET="$(openssl rand -hex 32)"
export OPS_PASSWORD="$(openssl rand -hex 24)"
# Optional; defaults to .local/lead-ledger.json
export HGO_LEDGER_PATH="$PWD/.local/lead-ledger.json"
npm run dev
```

Keep those values out of source control and client-side environment variables. `HGO_APP_SECRET` must contain at least 32 UTF-8 bytes; `OPS_PASSWORD` must contain at least 16 characters. The same `HGO_APP_SECRET` signs public intake tokens and operator sessions. Production does not fall back to a development secret; missing or weak configuration disables intake/operator access.

`HGO_LEDGER_PATH` may point to another server-side path. The default `.local/` directory is ignored by Git. Do not put real customer information in this prototype.

## Checks

```bash
npm run test       # Vitest domain, token, persistence, and replay tests
npm run typecheck  # strict TypeScript check
npm run lint       # ESLint
npm run build      # Next.js production build (Turbopack)
npm audit          # dependency advisory report
```

Fonts are system-local; the build does not fetch Google Fonts or require general internet egress.

## Prototype limitations and release gates

- The file ledger is single-process local storage. Its lock does not coordinate multiple Node processes/instances. It has no backup, retention, deletion, access audit UI, or customer data export. Do not deploy it as a multi-instance or production data store.
- The operator login is a single shared password, not an identity provider. Sessions are stateless, signed, and expire after eight hours; logout clears the current browser cookie but cannot revoke a copied token early. There are no per-user roles, password rotation flow, lockout, MFA, or account recovery. Use a long unique value only in an isolated preview.
- The signed form token and honeypot are basic friction, **not production spam or rate-limit controls**. A production release still needs an approved storage, privacy/retention, abuse prevention, monitoring, backup/restore, and support design.
- The contact/privacy copy is a placeholder and needs an owner/privacy review before collecting real enquiries. The form requests permission to reply to that specific request; it is not general marketing consent.
- No guest-level import, booking/rate/inventory/payment write, guest messaging, cross-property access, external CRM sync, or live Hotel Fountain integration is present or implied.
- The current package audit has no critical finding and no advisory naming `next` after the framework upgrade. npm still reports high advisories in the transitive ESLint/Next lint-config dependency chain; see the PR verification notes. No `--force` dependency downgrade was applied.

## Stack

Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS v4, npm, and Vitest. `AGENTS.md` requires reading the installed Next.js documentation before implementation; the relevant bundled guides for Server Actions, cookies/authentication, dynamic rendering, and Server Action body limits were reviewed for this slice.
