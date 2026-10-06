# Agency System — greenfield foundation

**Status:** Setup started; not yet an operational product.  
**Product boundary:** Separate Agency System. Do not modify or reuse the Hotel Growth OS application/CRM as the Agency CRM.  
**First slice:** minimum truthful agency site/intake → human-led CRM workflow → explicit Won event → project workspace → one approved client preview.

## Confirmed decisions

- Build this as a separate project, not inside the `hotel-growth-os` repository.
- The existing `hotelfountainbd-crm.vercel.app` is HGO-only. The user selected a test/mock CRM boundary first; the production Agency CRM provider remains unselected.
- Greenfield stack: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4 and Bun.
- Unit/component/integration tests use Vitest. TDD is required for application code; docs/config are exempt from red-first but still need applicable validation.
- Working content defaults selected: Dhaka-based agency, B2B SMBs and B2C/micro-business customers, with web/brand/SEO-content/care service direction. Exact brand, offers and publishable proof remain open. See [first-slice working brief](docs/first-slice-brief.md).
- No real CRM credentials, contact data, payments, outreach or production deployment are configured.

## Current setup boundary

The app now has a test-first lead parser (`src/domain/leads/parse-lead-submission.ts`), an application submit use case (`src/application/leads/submit-lead.ts`) and an injected CRM port (`src/application/leads/agency-lead-crm-port.ts`). Ten Vitest tests validate input normalization, consent separation, allowlisting, CRM handoff and generic failure handling. The test fake is not a live adapter. There is still no public page, API route, persistent lead storage, production CRM adapter, authentication, database, project workspace or deployment configuration. Do not submit real lead data to it.

The CRM port intentionally has no vendor-specific deduplication or retry policy yet. Approve the Agency CRM provider, data ownership, field mapping, consent, scopes and retention before building a production adapter.

## Tooling gates

- Bun 1.4.2 is the declared package-manager version. It was invoked through `npm exec` in this workspace because Bun is not installed globally. Install/use Bun directly in the target environment and commit the generated `bun.lock` after dependency resolution.
- TDD was followed for both the parser and submission use case: missing-module RED runs, then **10 Vitest tests passed**; `tsc --noEmit` and ESLint passed. `next build` was not run because App Router pages are intentionally not implemented yet.
- The user confirmed the Front-End Checklist MCP can be enabled, but its tools are not exposed in this session yet. The `skill.md` makes it a hard gate for front-end implementation/review; no UI audit is implied by this scaffold. Graphify remains unavailable and will be needed for supported repo-wide architecture analysis once applicable.
- Target-host skill registration and slash-command mapping are not performed here.

## Local setup (after Bun is installed)

```bash
bun install
bun run test
bun run lint
bun run typecheck
```

Once the Next.js app routes are implemented, also run:

```bash
bun run dev
bun run build
```

The dev command must be checked against the installed Next.js CLI to confirm the supported Turbopack path. Do not add an unverified `--turbo` flag.

## Next build gates

1. Enable the Front-End Checklist MCP in this build environment and verify its actual review/audit tools; the user says it can be enabled, but it is not connected here yet.
2. Finalize agency name, exact service scope, domain and CTA. The selected audience/service direction is recorded in `docs/first-slice-brief.md`; omit proof/pricing/testimonials unless approved evidence is supplied.
3. Build the App Router site and intake UI/API under TDD, using only a local/test fake CRM boundary. Do not launch or accept real contact data.
4. Later, select a separate Agency CRM and approve consent copy, field ownership, deduplication/idempotency, API scopes, retention/deletion, monitoring and human-response ownership before adding its production adapter.
5. Continue the approved lead-to-delivery slice: human-led sales → authorized Won event → project workspace → one approved client preview/handoff.

## Architecture references

- [Final Master Agency System Build Plan v2](../Final_Master_Agency_System_Build_Plan_Architecture_v2.md)
- [Agency master skill v4.1](../skill.md)
- [Skill authoring ticket plan](../agency-master-skill-v4.1-ticket-plan.md)
