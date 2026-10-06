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

Do **not** set `NODE_ENV` or `NPM_CONFIG_PRODUCTION` / `NPM_CONFIG_OMIT` as project environment variables. `NODE_ENV=production` makes `npm install` skip `devDependencies` (Tailwind, TypeScript, ESLint), and any non-`production` `NODE_ENV` breaks the React production build. Vercel and Next.js both set the correct value themselves.

## Running Locally

Node.js **22.x** is the supported runtime (pinned in `package.json` under `engines.node` and in `.nvmrc`).

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

1. **Framework & Output (pinned in `vercel.json`):** This repo ships a `vercel.json` that forces the **Next.js** framework preset, runs `npm run build`, pins `installCommand` to `npm install --include=dev`, and uses `.next` as the output directory. These file settings take precedence over Project Settings, which fixes the `No Output Directory named "public" found` failure that occurs when a project is detected as a static ("Other") site.
2. **Dashboard checklist (Settings > General > Build and Development Settings):** Framework Preset should be **Next.js**, Root Directory should be `./` (repo root), and Build Command / Output Directory / Install Command should be left at their defaults (or match `vercel.json`). If `public` was ever typed into Output Directory manually, clear it back to the default.
3. **Node.js Version:** `engines.node` is pinned to `22.x`. Set **Settings > General > Node.js Version** to **22.x** as well so the dashboard and the manifest agree, and so a future Node.js major cannot silently change the build runtime. The previous open-ended `">=20.9.0"` range produced the `Detected "engines": { "node": ">=20.9.0" } ... that will automatically upgrade when a new major Node.js Version is released` warning on every build.
4. **Install-script approvals:** Newer npm releases block dependency lifecycle scripts unless they are listed in `package.json` under `allowScripts`, which produces the `1 package has install scripts not yet covered by allowScripts` warning. `unrs-resolver@1.11.1` (used by ESLint's TypeScript import resolver) is approved in this repo. Review the current state with `npm install-scripts ls` and approve deliberately with `npm install-scripts approve <pkg>` — never `--all`.
5. **Environment Variables:** In the Vercel Dashboard under **Settings > Environment Variables**, ensure `HGO_APP_SECRET` and `OPS_PASSWORD` are configured.
6. **Database Migration:** If using Supabase (`https://gvjxjsjwuweecilcqqhb.supabase.co`), run `supabase/migrations/20261005000000_leads_schema.sql` in the Supabase SQL editor and supply `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel.
7. **Deployment Protection:** Protected deployments return a Vercel login page instead of the site. If `/` is meant to be publicly reachable, confirm **Settings > Deployment Protection** only applies to Preview (`Standard Protection`), not to Production.
8. **Vercel CLI Inspection:** To link or inspect remote deployment logs locally:
   ```bash
   npx vercel link
   npx vercel inspect <deployment-id-or-url> --logs
   ```

## Troubleshooting a Failed Deployment

Vercel reports a failed deployment on the project's **Deployments** page. The warnings shown in the summary (Node.js engine notice, `allowScripts` notice) are **not** the cause of a failure — the actual error is further down.

1. Open the failed deployment, expand the **Building** accordion, and scroll to the red `Error` line. Use the command Vercel prints in the GitHub commit status:
   ```bash
   npx vercel inspect <deployment-id> --logs
   ```
2. Reproduce the same failure locally first — the CI job runs exactly the same sequence:
   ```bash
   npm ci --include=dev
   npm run verify
   ```
3. If the build passes locally and in CI, the failure is configuration rather than code. In order of likelihood:
   - **Stale build cache:** Deployments > select the last good deployment > **Redeploy** and *uncheck* "Use existing Build Cache".
   - **Project Settings drift:** Framework Preset not **Next.js**, an Output Directory such as `public`, or a build command that does not match `vercel.json`.
   - **Install skipped dev dependencies:** see the `NODE_ENV` / `NPM_CONFIG_PRODUCTION` note above.
   - **Environment variables:** `HGO_APP_SECRET` must be at least 32 bytes and `OPS_PASSWORD` at least 16 characters, otherwise the operator routes refuse to start (`/ops` shows the configuration notice instead of the sign-in form).
4. If a build fails with **no build logs at all**, Vercel prevented the build from starting — an invalid `vercel.json`, an ignored build step, or a commit author without access to the project's Git connection.
5. If the commit status says **`Checks for Deployment have failed`** while the build itself was green, the build was *staged* and never released to production. Vercel holds every production deployment until all required **Deployment Checks** pass before assigning it to the production domains, so this status means a check — not the build — is the blocker. Open **Settings > Build and Deployment > Deployment Checks** (or the failed deployment's **Checks** panel) and inspect each entry:
   - **Lint / Typecheck** — native script checks. They run the matching `package.json` scripts (both exist in this repo), so they should pass whenever CI passes. Their logs stream from the deployment detail view.
   - **Microfrontends Config Present** (`mfe-config-present`) — verifies that `microfrontends.json` is present in the build outputs. It is blocking by default **only for a project that is the *default application* of a Vercel Microfrontends group**, and it applies to production deployments only. This repository is a single Next.js app with no `microfrontends.json` and no need for one, so if that check appears against this project it has been enrolled in a Microfrontends group by mistake. Fix it in **Settings > Microfrontends**: use **Remove from Group**, or delete the group:
     ```bash
     npx vercel microfrontends inspect-group   # confirm whether the project is in a group
     npx vercel microfrontends delete-group    # only if the group is unintended (irreversible)
     ```
     A project that is the group's *default application* cannot be removed with `remove-from-group` — use the dashboard. Once removed, the tab reads "This project is not a microfrontend" and the change takes effect on the next deployment.
   - Each check's target environments are configurable in the checks list (production only, or production and preview). A check that must not gate releases should be removed or rescoped there, not worked around in application code.

   Note: the sentence *"The mfe-config-present check only applies to production deployments of a microfrontends default app"* is an applicability note attached to that check, not a build error. Look for the red `Error` line under the **Building** accordion for an actual build failure.
6. If the commit status says **`GitHub couldn't verify an account for the commit`** (or the deployment is marked *Blocked* with no build logs), Vercel could not associate the commit's author/committer with a GitHub user. This repository is **private on a personal account**, and Vercel does not support collaboration on private repositories without Pro, so every commit covered by a deployment must be authored with an email linked to the GitHub account that owns the project. The repository-local identity is already configured correctly:
   ```bash
   git config user.name "Shanwazmojaloy"
   git config user.email "251733208+Shanwazmojaloy@users.noreply.github.com"
   ```
   Agent/bot identities such as `agent@arena.ai` are not linked to a GitHub user and will block the deployment (commit `9b9cc41c` on `main` is an example). If the identity is right and the block persists, reconnect GitHub under [Vercel Account Settings → Authentication](https://vercel.com/account/settings/authentication), which repairs a stale GitHub↔Vercel account mapping.

## Checks & Verification

```bash
npm run lint       # ESLint check
npm run typecheck  # Strict TypeScript check
npm run test       # Vitest suite (48 tests covering domain, tokens, replay, file & Supabase stores)
npm run build      # Next.js production build (Turbopack)
npm run verify     # All of the above, in order (used by CI)
npm audit --omit=dev # Production dependency audit (0 vulnerabilities)
```

`.github/workflows/ci.yml` runs `npm ci --include=dev`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` on Node 22.x for every push and pull request, so a clean-environment build is verified before Vercel builds it again.

## Stack

- **Framework:** Next.js 16.3.8 (App Router, Turbopack)
- **UI:** React 19.2.4
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4 with system font stack (no Google Fonts egress)
- **Testing:** Vitest 5.0.3
- **Runtime:** Node.js 22.x
