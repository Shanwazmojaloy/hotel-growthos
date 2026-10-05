# Final Master Agency System Build Plan & Architecture

**Version:** 2.0  
**Prepared:** 2026-10-03 (Asia/Dhaka)  
**Status:** Final integrated architecture and gated build plan; supersedes v1 after review of the full conversation and two additional source summaries; not a production approval, customer authorization, security certification, vendor approval, or implementation claim.  
**Review basis:** 51 unique uploaded files, the full conversation history, and the conversation-generated `skill.md` plus ticket plan. The two newest files are whole-chat summaries: one for the digital-services agency operating system and one for the broader Hotel Growth OS vision.  
**Important boundary:** The uploaded bundle does not include the application source trees described by the README/HANDOVER. The product/test status below is therefore described as *documented in the supplied files* unless independently present in the uploaded artifacts.

> **Purpose:** Reconcile every supplied file and consequential conversation decision into one portfolio architecture and build sequence. This is a plan deliverable; no application code, live integration, Hotel Fountain data access, customer contact, MCP registration or deployment was performed in preparing it. The `skill.md` is an execution policy, not a running platform.

---

## Executive decision

The files do **not** describe one coherent application. They describe three related but distinct systems:

1. **Agency System / Agency OS** — the agency’s full operating lifecycle: public website and demand capture → CRM and sales → project delivery → support, retainers and referrals. It includes an internal multi-agent delivery workflow, but is not limited to that workflow.
2. **Hotel Growth OS (HGO)** — a separate hotel-facing product line with a broad historic PMS/CRM/booking/growth vision and a documented local synthetic aggregate-reporting proof. HGO is not the agency’s CRM and is not a live Hotel Fountain integration.
3. **Production Readiness Console / ABOS telemetry** — internal release, security-evidence, agent-telemetry and operations tooling described by `HANDOVER.md` and `abos_executive_dashboard.json`; its implementation is not verified from the uploaded source set.

### Strongest architecture decision

Build a **federated product system with a small shared control plane and isolated domain applications**, not one giant “agency + hotel PMS + readiness console” monolith.

```text
                         SHARED CONTROL PLANE
       Identity · policy · workflow/task contracts · approvals · audit
         agent/model registry · budgets · evaluation · telemetry
                |                    |                    |
        ┌───────┴───────┐    ┌───────┴────────┐   ┌───────┴─────────┐
        │ AGENCY SYSTEM │    │ HOTEL GROWTH OS│   │ READINESS / ABOS│
        │ agency-owned  │    │ customer product│   │ internal control│
        │ site + CRM +  │    │ hotels, property│   │ releases, ADRs,  │
        │ sales + work  │    │ reporting, later│   │ evidence, agent  │
        │ delivery      │    │ hotel workflows │   │ telemetry        │
        └───────┬───────┘    └───────┬────────┘   └───────┬─────────┘
                └──────── separate domain APIs, data, storage and permissions ────────┘
```

- **The Agency System is the primary architecture:** operate one auditable agency lifecycle from a truthful marketing site and consented lead capture, through the authoritative CRM and human-owned sales decisions, into a client project workflow, delivery, support and retention. Do not reduce the agency system to a website compiler or a list of agents.
- **HGO is separate:** reuse generic task, audit, approval, security and evaluation patterns only where justified. Do not merge HGO hotel/guest/reservation/financial/inventory records, credentials, prompts or memory with agency lead/client/project data.
- **Readiness Console and ABOS are internal-only sidecars:** they may support engineering governance after a code review, but they are not a Hotel Growth customer product, not a proof of HGO readiness, and not an authority for customer hotel data.
- **One thin revenue-to-delivery slice first:** a minimal agency site/intake path → approved CRM upsert → human-controlled lead response/qualification → explicit Won event → project workspace → one client website project through approved preview. Keep payments, outbound sequences, broad marketing automation and HGO live data out until separately justified and authorized.
- **The generated `skill.md` is an execution contract, not a runtime:** its Next.js 16/React 19/TypeScript strict/Tailwind v4/Bun defaults apply to greenfield agency work; its MCP dependencies must be configured in the host before relevant codebase/front-end verification.

### Current operating truth from the files

- Hotel Fountain is described as **discovery outreach sent — awaiting reply**; the send date, recipient and channel are not recorded. It is **not pilot-qualified**.
- The public-site observations (including the website’s listed 28 rooms, displayed rates and rating inconsistency) are dated observations, not operating inventory, source-of-truth, consent, revenue or baseline evidence.
- HGO’s local synthetic MVP is **documented** as a Python/SQLite, one-property prototype with 26 passing integration tests. The app source and test files are not in this upload, so that result cannot be reproduced from the current bundle.
- The displayed synthetic fixture totals 672 occupied / 960 sellable room nights = 70.0% occupancy. Its revenue basis is `unknown`, and channel attribution is partial with 17 unattributed room nights. ADR/RevPAR are correctly withheld in the fixture preflight, but the HTML dashboard still shows illustrative numeric ADR/RevPAR; that mismatch must be fixed before customer use.
- No source bundle verifies a production deployment, real hotel integration, Hotel Fountain authorization, production RLS, external monitoring, backups/restore, secure customer-data deletion, or an approved pilot price.
- The newly supplied HGO whole-chat summary claims an existing Hotel Fountain website/CRM and Supabase/Vercel/Hostinger/n8n environment. The candidate-specific files still do not verify ownership, source access, current operation or authorization; treat this as a historical/project-reported claim until checked.
- The newly supplied agency whole-chat summary describes a starting-from-zero agency, a proposed website/CRM stack, lead funnel and numeric KPI targets. These are planning inputs—not current company performance, active vendor accounts, customer evidence, or contractual SLAs.

---

## 1. Evidence labels and source authority

### 1.1 Evidence labels for every plan, screen and claim

Use the following labels consistently in the system and customer materials:

- **Implemented / tested:** code or artifact exists and the named test was actually run; identify environment and test scope.
- **Documented / reported:** a supplied document says it exists or passed; source code or test evidence is not available here.
- **Synthetic only:** fictional fixture or prototype; never a hotel result.
- **Observed publicly:** public page observation with URL and review date; not a verified operating fact.
- **Hotel-reported:** statement from an authorized hotel contact; not technically verified until checked against the source owner/report.
- **Verified evidence:** reviewed against the responsible authoritative source and scoped to a specific period/property.
- **Proposed / assumption:** product, technical, commercial, timeline or financial hypothesis that still needs an owner decision or evidence.
- **Blocked / approval required:** must not be enabled, quoted, connected, transferred, published or treated as passed until approval and test evidence exist.

A plan, mockup, screenshot, validator `PASS`, public login page, or signed internal checklist is **not** by itself proof of production capability, source accuracy, customer authorization, legal basis or security readiness.

### 1.2 Authority hierarchy

| Area | Controlling source for this plan | Supporting / superseded sources |
|---|---|---|
| Agency business lifecycle | This v2 plan; use the current approved owner decisions and repository as authority. | `Master_Design_Build_from_Whole_Chat_Summary 2.md` (2026-09-24) proposes the agency website→CRM→sales→delivery→retention system, B2B/B2C journeys, tool stack and numeric targets. These are plans/assumptions, not proof of live accounts or actual performance. |
| Agency design principles | `AGENCY-OS-UNIFIED-MASTER-ARCHITECTURE.md` plus `master-design(1).md` as the design constitution. | `AGENCY-OS-MASTER-ARCHITECTURE.md` is the fuller detailed source; simplify its large agent roster into capability contracts and gates. |
| Agency execution contract | Conversation-generated `/home/user/skill.md` (`agency-master-skill-v4.1`) for task orchestration, TDD, MCP gates, review and handoff. | The skill is policy text, not a connected runtime; register its custom frontmatter and configure MCP servers in the target host. |
| Hotel Growth OS | `Hotel_Growth_OS_Master_Architecture_v3.md` as the most recent evidence-led architecture. | `Hotel_Growth_OS_Comprehensive_Architecture_Blueprint_v2.md`, `Hotel_Growth_OS_Master_Design_Build_Intelligence_v2.md`, `Hotel_Growth_OS_Master_Architecture_Build_Brief_v1.md`, the MVP build plan, and audit/revision log provide reconciled detail. |
| Historical HGO design | Treat `Hotel_Growth_OS_Comprehensive_Architecture_Blueprint-1.pdf`, `master-design-build-intelligence.md` and `Master_Design_Build_from_Whole_Chat_Summary.md` as broad historical inputs, not implementation authorities. | The audit/revision log and v2/v3 docs supersede older MVP breadth, price tables, timelines, autonomy examples and financial labels where they conflict. |
| Hotel Fountain current status | `Hotel_Growth_OS_Project_Index_and_Next_Gates_v23.md` plus `Hotel_Fountain_Remaining_Actions_in_Order_v18.md`. | Discovery/demo/outreach docs are preparation drafts; new HGO summary claims about existing systems are unverified; no hotel approval or pilot is implied. |
| HGO implementation status | `README.md`, the MVP acceptance plan and Project Index v23 describe a local synthetic prototype. | Source code, tests, reset script and static assets are missing; status is documented, not independently rerun. |
| Readiness Console | `HANDOVER.md` describes a separate internal console. | Uploaded package/config files are insufficient to verify its claims; `src/`, schema and tests are absent. |

### 1.3 Scope rule

Any conflict between a broad target-state document and a later, narrower implementation or safety gate resolves in favor of the **narrower, evidence-backed release boundary**. This makes the build plan usable without pretending the full target state already exists.

---

## 2. Plan self-review: draft approach and stronger final approach

Before freezing the architecture, the first tempting approach was to combine every file into one “master app”: all 14 website-design agents, all hotel/PMS/CRM/booking features, the readiness console, the Grafana dashboard, one database, all connectors, and a 20-week implementation timeline. That plan was reviewed and rejected as weaker.

| Weak draft assumption | Why it fails under review | Stronger final decision |
|---|---|---|
| Treat Agency OS, HGO and the Readiness Console as the same product. | They have different users, data, business rules, release gates and evidence maturity. Hotel reservation/guest/finance data is not Agency project/artifact data. | Separate product/domain applications with explicit trust boundaries; share only generic control-plane capabilities. |
| Build every listed agent and integrate all providers up front. | Agent count is not a moat; added orchestration, API, cost, permission and QA complexity comes before proof of customer value. | Begin with a small number of **capabilities** inside one runtime; split into separate agents only when independence, tools, risk or evaluation justify it. Add one integration only when a real use case requires it. |
| Start HGO with a full PMS, guest CRM, direct booking and marketing automation. | The actual documented local build is only aggregate owner reporting; no PMS/channel-manager, sponsor, source or customer authorization is verified. | Keep HGO Phase 1 to an authorized, minimized aggregate reporting workflow. Guest-level CRM, messages, booking writes and PMS replacement are later, separately approved releases. |
| Include guest messaging in the first HGO pilot because an earlier pilot brief mentions it. | The MVP plan and HGO v3 make aggregate reporting the first customer slice; the message workflow needs separate consent, provider, suppression, copy, approval and send-path tests. | Exclude messaging from first customer release by default. Allow draft-only or a separately gated later workflow only after authorization and fail-closed tests. |
| Let n8n be the system brain, event store and transactional executor. | A failed/replayed workflow could lose or duplicate consequential hotel actions; domain rules and approvals would be scattered. | Application-owned state machine/domain API + transactional outbox + durable worker. n8n is optional secondary orchestration for schedules, notifications and low-risk integrations. |
| Choose a production stack from filenames alone. | The bundle contains a Python/SQLite local HGO description, a Next.js/Drizzle/Auth0 console handover and Next.js config, but not their source trees or a build-vs-reuse review. | Gate stack selection on authorized repository/deployment inventory and an Architecture Decision Record (ADR). Do not silently port, combine or replace systems. |
| Use the public Hotel Fountain website or synthetic dashboard numbers as hotel baseline. | Public room listings/rates are not sellable capacity or realized ADR; prototype values are fictional; the source system and metric definitions are unknown. | Require hotel-authorized source, approved fields/date range, source-owner reconciliation and explicit metric definitions. Keep unknown/withheld states visible. |
| Treat earlier plan prices, churn, unit costs, API-access durations and break-even claims as facts. | The original workbook and market/vendor evidence are absent; financial inputs are explicitly assumptions and older calculations had labeling errors. | Use corrected arithmetic only as scenario analysis. Replace assumptions with invoices, signed orders, time logs, provider bills and customer cohorts. No calendar promise before capacity and dependencies are known. |
| Let AI write directly to production, shared memory or general SQL. | Prompt injection, cross-tenant data exposure, irreversible changes and unvalidated learning become uncontrolled. | Typed, scoped tools; output validation; action risk separate from autonomy; approvals bound to an exact payload; memory promotion curated and tenant-scoped. |

**Result of first review:** the final design was smaller to launch, safer to operate and more faithful to the evidence. A second pre-build review was performed after the full conversation, the two newly attached whole-chat summaries and the generated `skill.md` became available. That review found a material omission in v1.

### 2.1 Second pre-build review — v1 correction before build

| V1 weakness or new conflict | Why the first plan was incomplete or unsafe | Stronger v2 decision before implementation |
|---|---|---|
| Agency OS was described mainly as client website-project delivery. | The new agency summary defines an agency revenue and service lifecycle: public website → lead capture → CRM/pipeline → sales → project delivery → review/retainer/referral. V1 omitted the agency’s own customer-acquisition/CRM operating loop and distinct B2B/B2C paths. | Expand Agency System scope to the complete agency lifecycle; prioritize one lead-to-delivery slice rather than a design-only project workflow. |
| CRM was a generic internal domain model. | The agency source proposes a CRM as the record of contacts, deals, consent, activities and funnel stages; building a parallel CRM risks split ownership and duplicate data. | Select one authoritative CRM provider via ADR (HubSpot Starter is the source-summary candidate, not a verified account); use a narrow adapter and project-system references instead of duplicating CRM truth. |
| The new HGO summary claims Hotel Fountain website/CRM/Supabase/Vercel/Hostinger/n8n are an existing production foundation. | Candidate-specific materials still say outreach pending and do not provide credentials, source code or verified ownership/authorization. The HGO stack and scope also conflict with the local Python/SQLite description and separate Next.js console fragments. | Treat the whole-chat statement as a dated project claim; verify each repo/account/system owner before reuse. Keep HGO separate and aggregate-first until approved. |
| V1 left the Agency OS stack unresolved. | The latest user-confirmed skill defaults specify Next.js 16, React 19, strict TypeScript, Tailwind v4 and Bun for greenfield Agency work, while older agency text says Next.js 15 and vendor choices. | Adopt the user-confirmed stack as the **greenfield Agency default**; preserve an existing repo’s stack and require an ADR for migration. Do not infer that the uploaded generic package manifest is the Agency OS source tree. |
| The draft skill could be interpreted as a deployed 24/7 operator or connected MCP environment. | Slash-command/frontmatter support and MCP server availability depend on a target host; this workspace did not connect those servers. | Treat `/home/user/skill.md` as an execution contract only. Host registration, real-agent availability and MCP connectivity are explicit preflight gates; unavailable required tools block affected verification. |
| The proposed one-project vertical slice did not prove the agency’s own revenue loop. | A design-to-preview flow is useful but does not test lead capture, CRM dedupe/consent, human response, sales ownership or conversion into delivery. | First slice: truthful minimum agency site/intake → approved CRM upsert → human-controlled follow-up/qualification → explicit Won event → project workspace → one approved client preview. Build the minimum surface required; defer broad automation. |
| Whole-chat KPI targets, pricing, CAC/LTV, API timing and autonomy ambitions could be mistaken for commitments. | Both summaries contain forecasts, proposed prices and external-provider timing/capability claims without current source evidence. | Keep targets as hypotheses; measure actuals, avoid public promises, and estimate delivery dates only after repository/provider/owner dependencies are verified. |

**Final result after self-review:** one Agency System with two primary business bounded contexts—**agency growth/CRM** and **agency project delivery**—plus two separately governed product contexts: **Hotel Growth OS** and the **internal Readiness/ABOS sidecar**. The first build proves the agency’s revenue-to-delivery loop; the HGO customer path remains independently gated. This v2 supersedes v1 wherever it expands or narrows the Agency System scope.

---

## 3. Product definition and boundaries

### 3.1 Agency System / Agency OS — the agency’s full operating lifecycle

**Purpose:** Operate the agency’s own demand and service loop—truthful website and lead capture → CRM and sales → project creation → repeatable web/brand/growth delivery → support, retainers, reviews and referrals—while making AI-assisted work inspectable and safe.

**Primary users:** Agency owner/producer, sales lead, project lead, creative director, researcher, designer, engineer, customer-success/support owner, independent reviewer and client approver. A client sees only their own approved project status, artifacts and previews.

**Agency-owned contexts:**
1. **Acquisition and CRM:** marketing site, service catalog, inbound capture, consent/source attribution, contacts/companies/deals, B2B and B2C pipelines, sales activities and approved communications.
2. **Delivery and customer success:** projects, scope, artifacts, tasks, approvals, preview/release, support, renewals, retainer decisions, review/referral outcomes.
3. **Shared agency control plane:** identities, roles, approvals, task/agent runtime, cost/evaluation, audit and integrations—only where justified and product-scoped.

**Client value:** clear offer and evidence, dependable response, bounded scope, reviewable project progress, controlled changes, approved previews and accountable handoff. Clients do not need to learn the internal agent roster.

**Non-goals for the first build:** replacing the chosen CRM; a public multi-tenant website-builder SaaS; a drag-and-drop visual editor; autonomous public deployment or external outreach; full payments/fintech; all eight proposed agent roles as separate always-on instances; universal CMS; unlimited custom agency work; or automatic cross-client “learning.”

### 3.2 Hotel Growth OS — separately bounded hospitality product

**Purpose:** Connect hotel operations, guest relationships, booking/distribution, reporting and eventually governed growth workflows to measurable operating outcomes.

**Current proven scope in the supplied documents:** a local synthetic aggregate reporting proof, not a production HGO service. The product thesis can remain broad, while the first real release stays narrow.

**First customer release recommendation:** after the production and customer gates pass, one property, one authorized aggregate daily export (or later one verified read-only connector), a source-labeled owner report and controlled export. No guest-level records, messages, booking writes, rate/inventory changes, payments, refunds, autonomous pricing or PMS replacement by default.

### 3.3 Production Readiness Console / ABOS — internal-only operations sidecar

Use for internal release evidence, ADRs, security/quality scans, incidents, runbooks and agent cost/latency if its source code and security model are verified. Keep it behind staff identity and internal authorization. Do not expose its reports, crawler, agents or compliance-export features to hotel customers by inference.

### 3.4 Shared versus isolated

| Capability | May be shared after review | Must remain domain-scoped |
|---|---|---|
| Identity sign-in / session broker | A common identity provider can issue application-specific audiences/claims. | Product roles, customer memberships, permissions and data grants. No one role automatically grants access to all products. |
| Agent execution | Model routing, prompt version registry, budgets, evaluation harness and safe tool-call framework. | Client/project context, hotel/guest context, retrieval index, tool permissions and agent memory. No cross-product prompt retrieval by default. |
| Workflow / approval | Generic task status, approval record format, audit metadata, retry/timeout/trace patterns. | Agency design stage gates versus hotel data/operational approvals; each domain owns its state and authority. |
| Storage / artifacts | A storage service may be shared only with separate buckets/prefixes, keys, policies, encryption and lifecycle rules. | Website assets/source code; hotel aggregate/guest data; release evidence and audit exports. Separate credentials and retention schedules. |
| Analytics | Common telemetry shape for latency, failures and cost. | Agency quality/delivery outcomes, internal agent telemetry and hotel operating/business metrics. Never merge or show one product’s metrics as another’s. |

---

## 4. Target architecture

### 4.1 Logical planes

```text
PRODUCT SURFACES
  Agency Marketing Site · Lead/CRM Workspace · Project Command Center
  Client Project Portal · Website Preview/Runtime
  Hotel Owner/Staff Portal (only when HGO production release is approved)
  Internal Readiness Console / ABOS (staff-only)
                         │
CONTROL PLANE
  Identity + authorization · Product/tenant context · Workflow state/task graph
  Approval routing · Risk policy · Budgets · Audit trail · Feature/release flags
                         │
AGENT / WORKER PLANE
  Agent runtime · model router · versioned skills/prompts · typed tools
  durable jobs · bounded retries · isolated code execution / browser tools
                         │
DOMAIN PLANE (separate bounded contexts)
  Agency acquisition/CRM adapter + project delivery    HGO reporting/operations
  Readiness releases/evidence/incident records          Internal telemetry
                         │
DATA / INTEGRATION PLANE
  Product-scoped PostgreSQL · object storage · transactional outbox/queue
  replaceable provider adapters · versioned API/schema contracts
                         │
OPERATIONS / LEARNING PLANE
  metrics/logs/traces · alerting · backups/restore · retention/deletion
  benchmark/evaluation datasets · reviewed and scoped pattern promotion
```

**Architecture rule:** agents reason and propose; deterministic services validate, authorize, store, render, test, export and deploy. An LLM response alone is never a transaction, customer approval, data authorization or production release.

### 4.2 Recommended starting shape

- Use a **single repository or monorepo only if it reduces coordination cost**, with clearly separated surfaces/modules for the public Agency Marketing Site, authenticated Agency Operations/Project Console, and shared design/contracts. They may share code packages; they must not expose CRM or client-project data through public routes.
- Keep agency acquisition/CRM and delivery/project data as distinct bounded contexts. The selected CRM is authoritative for contact, company, deal, consent, communication and sales-activity records; the Agency Operations app owns project artifacts, tasks, approvals, build previews and delivery history. Store CRM IDs and minimal projections, not a competing CRM ledger.
- Use a narrow server-side CRM adapter and transactional outbox for lead capture and approved synchronization. The public browser never calls a CRM directly. CRM webhooks are signature-checked, persisted, deduplicated and reconciled.
- Use deterministic application state for approvals, project gates, access checks and consequential actions, plus a separate worker for long-running research, agent, build and test tasks.
- Keep HGO in a distinct app/domain and data boundary. Its present Python/SQLite prototype is a proof artifact only; do not use its local runtime/database for customer data.
- Keep the Readiness Console separate until its actual code and tenant/access model are reviewed.
- Consumers are at-least-once and idempotent; do not assume exactly-once delivery. n8n may route notifications and secondary integrations, but it is not the CRM/domain source of truth or a privileged transaction engine.
- Use vector retrieval only when its permissions, rights, quality and evaluation are proven; it is not canonical memory or a source of truth.

### 4.3 Stack decision and ADR boundaries

The latest explicit user-confirmed **greenfield Agency default** is Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS v4 and Bun. Apply it to new Agency System code unless a later owner decision changes it. Preserve an existing project’s stack and lockfile; do not migrate an existing HGO, Hotel Fountain, readiness-console or client repo merely because this default exists.

**Confirmed defaults for new Agency System code:**

- Next.js 16 App Router + React 19 + strict TypeScript.
- Tailwind CSS v4; default to one component system (shadcn/ui when compatible/approved; do not stack shadcn, Ant Design and DaisyUI together).
- Bun runtime/package manager/script runner. Verify Bun and the exact Next CLI/options from the repository; use the supported Turbopack path and verify startup logs instead of blindly appending an obsolete flag.
- Vitest for unit/component/integration tests; Vite is test tooling, not a replacement for the Next.js app bundler. Storybook is required for reusable component-system work when the project uses or installs it. Use a separate browser E2E layer if required by the release scope.

**Provider and service selections remain ADRs, not confirmed defaults:** HubSpot Starter is the agency-summary CRM candidate; Payload 3 is a CMS candidate; Vercel, managed Postgres, n8n, Cal.com, Chatwoot, Plausible/PostHog, Stripe and SSLCommerz are proposed options. Before adoption, verify current account ownership, pricing, API rights/scopes, region, support, data export/deletion, security, contract and fit. Prefer integrating one CRM rather than building a duplicate; do not assume the candidate account is live.

The uploaded Next.js/Drizzle/PostgreSQL package/config fragments align with some framework defaults but have no application `src/` tree and do not prove they belong to Agency OS. `HANDOVER.md` may describe a separate internal console. The `drizzle.config.json` localhost credentials are development placeholders and must never be used in production. Use reviewed/versioned migrations—not an unreviewed production schema push.

**ADR-01 must still choose:** repository/product to extend; CRM provider and system-of-record fields; CMS; identity provider; database/migration path; hosting/region; worker/queue; object storage; secret store; analytics/consent mode; monitoring/backups; and reuse of existing assets. The ADR records alternatives, security/cost/operational trade-offs, migration risks and owner approval.

---

## 5. Agency OS functional architecture

### 5.0 Agency revenue-to-delivery system (added after full-chat review)

The Agency System has two coupled but separate workflows: **growth/CRM** creates and qualifies work; **project delivery** fulfills a human-approved scope. A lead is not a project, an email thread is not the CRM, and an agent draft is not an offer or contract.

#### A. Public website and inbound capture

- Launch the smallest truthful set of pages that proves the offer and enables a qualified next step: home, one prioritized service page, proof/case-study page(s) with permission and source evidence, and contact/booking. Add pricing/self-serve checkout only when scope, terms and prices are approved. The source summary’s full six-page/three-case-study launch is a candidate content plan, not a requirement if evidence/assets are not ready.
- Each page has one primary conversion goal, clear audience/offer, approved proof, responsive states and measured analytics. No fabricated project counts, star ratings, client logos, ROI, testimonials or “before/after” claims.
- Use the minimum form fields needed to route and respond. The source proposal’s max-six-required-field idea is a UX hypothesis; collect only fields with a stated purpose. Record channel-specific contact permission and timestamp. Separate service inquiry consent from marketing nurture consent. If permission is absent/unclear, allow the inbound conversation but do not add the person to outbound marketing.
- Validate server-side; protect against spam/replay; record source/UTM only under the approved privacy/consent design. The browser does not call a CRM or payment API with privileged credentials.
- Treat first response `<5 minutes` as an internal target only when the actual system, coverage hours, fallback owner and measurement are operating. It is not a public promise or guaranteed SLA by default.

#### B. CRM and sales lifecycle

**System-of-record rule:** select one CRM provider by ADR. HubSpot Starter is the preferred candidate in the attached agency summary, but its account, contract, configuration and API rights are not verified. When a CRM is selected, it owns contacts, companies, deals, consent/DND, communications and sales activities. Agency OS owns project execution artifacts and stores only CRM identifiers plus the minimal approved projection needed for the workflow. Do not build a second full CRM ledger.

Keep B2B and B2C funnels distinct. The source summary’s proposed stages are starting templates to validate:

| B2B stage | Gate / next step |
|---|---|
| New lead → Contacted → Qualified → Proposal → Negotiation → Won or Lost | Qualification fields are evidence-linked; discovery and proposals are human-owned; prices, discounts, scope, timelines and contract terms come only from the approved catalog/decision record and require authorized approval. |

| B2C stage | Gate / next step |
|---|---|
| New → Fixed-scope quote/offer → Payment pending → Paid → Onboarding → In progress → Delivered → Review/referral/renewal or closed | Use only approved productized offers; if the requested scope exceeds the package, stop and route to human/change-order or a separately qualified B2B deal. Never imply payment is complete until the payment provider verifies it. |

Use explainable deterministic lead scoring if it is approved and useful; store point breakdown/source fields. The model may summarize or recommend but may not secretly change a lead’s score, qualification, consent, owner or pipeline stage. Stage and readiness are different concepts: sales progress does not authorize data access or delivery.

#### C. End-to-end agency loop and handoff

```text
Public page / referral / consented message
  → validated intake with source and permission
  → idempotent CRM upsert + activity + owner routing
  → human-led response/discovery; agent may draft a response or research brief
  → approved scope and proposal → authorized Won/payment/contract event
  → project workspace linked by CRM deal ID
  → A0–A12 project-delivery workflow below
  → verified delivery/handoff → support/retainer decision → permitted review/referral
```

- Every handoff includes a versioned packet: summary, source evidence, unresolved questions, owner, next action and deadline. Keep transcripts only where authorized and necessary; avoid PII in free-text notes.
- First month: manual sends and human qualification. Then draft + approve (semi-auto). Enable a narrow auto-send only after consent/DND checks, stop-on-reply/takeover, rate/quiet-hour limits, monitoring, sample review, kill switch and owner approval all pass.
- Outbound outreach, nurturing, WhatsApp/email/SMS, proposals, pricing and public content are external actions. Draft-only is the default. An agent must stop immediately on opt-out, complaint, dispute, manual takeover or uncertain consent.
- The CRM is not the system for source code, design artifacts, hotel data, payment card data or secrets. Payment provider is the source of truth for payment status; CRM mirrors only a verified status/reference.

#### D. Public website information architecture and conversion

The attached agency summary proposes web design/build, brand/identity, SEO/content growth and care/growth retainers as service lines, with B2B SMBs and B2C solo/micro-businesses as distinct segments. Confirm the agency’s actual offer, audience and proof before publishing. A lean route plan can grow toward:

```text
/                         Home
/services/                service index or direct service routes
/services/web-design/     /brand-identity/ /seo-content/ /care-plan/
/case-studies/            case index + permissioned case details
/pricing/                 only approved, bounded offers/price bands
/about/                   team/mission only with approved facts
/blog/                    index + evidence-backed article pages
/contact/                 consented form + booking/contact options
/thank-you/               submission state and truthful next steps
/resources/faq/           approved answers
/legal/privacy/ /legal/terms/  reviewed by qualified owner/counsel
/404                       helpful recovery path
```

Do not build every route before the offer/proof exists. Template guidance from the source is a usable design hypothesis: Home (promise → proof → services → process → case → FAQ → CTA); Service (outcome/audience → included deliverables → process → approved price band → relevant proof → FAQ/CTA); Case study (challenge → approach → evidenced result → permissioned quote/assets); Pricing (fixed bounded tiers only when commercial owner approves); Blog (answer the actual question, useful evidence and relevant internal links); Contact (what happens next, booking/form, privacy note). All pages require responsive, keyboard, focus, empty/error and reduced-motion states. Avoid personalization from sensitive or fingerprinted signals.

Initial analytics, if approved, should measure page/CTA/form/booking/CRM-outcome events with purpose, consent basis, data minimization and retention. Use first-/last-touch only with a documented attribution rule; do not treat attribution as causal proof or use session replay on sensitive forms without explicit review.

### 5.1 End-to-end client project delivery workflow

The unified workflow is a **state machine plus a dependency-aware task graph**, not a single prompt and not an open-ended chat. Independent work may run in parallel only after prerequisites are satisfied.

| Gate | Workflow stage | Required artifacts / exit evidence | Human authority |
|---|---|---|---|
| A0 | Intake and scope | Signed/recorded project brief, business objective, audience, constraints, existing-code/asset inventory, success measure, open questions, data/source boundaries. | Agency project owner accepts scope; client confirms supplied facts/constraints. |
| A1 | Discovery and audit | Evidence register with `Observed / Client-reported / Inference / Assumption / Not checked`, URL/source/date, repository audit, asset/license notes, risks. | Project lead validates scope and source attribution. |
| A2 | Research | Competitor/category conventions, user questions, references deconstructed into reusable principles, confidence and limitations; no copying. | Research/strategy lead approves relevance; high-impact uncertainty escalates. |
| A3 | Strategy and positioning | Business objective, audience/jobs, proposition, primary/secondary CTA, content priorities, success metrics, visual thesis, emotional/perceptual target, constraints. | Creative Director and client sponsor approve material strategy. |
| A4 | IA and user journeys | Sitemap, navigation, page purpose, user question, content hierarchy, primary/secondary action, key paths, responsive intent. | UX/IA lead plus client approval for major structure. |
| A5 | Wireframe/content structure | Static hierarchy and interaction flow work before motion/3D; content model and verified/placeholder claims identified. | Project lead confirms structure is reviewable. |
| A6 | Art direction/design system | Visual territory and rationale, typography/color/grid/spacing tokens, components/variants/states, responsive and motion rules, asset strategy, accessibility/performance constraints. | Creative Director owns creative coherence; client locks the approved direction. |
| A7 | Website schema/prototype | Versioned canonical website representation or a structured implementation spec, stable IDs, content references, responsive/interactions/accessibility/SEO/analytics metadata, preview. | Client approval for material page concepts; Creative Director approves craft. |
| A8 | Implementation | Code on a branch/isolated worktree, build instructions, assets with licenses, known exceptions from schema, unit/type/lint/build results, preview link. | Engineer approves merge; no agent pushes directly to protected production branch. |
| A9 | QA and red team | Functional, visual, responsive, accessibility, performance, security/content-claim checks; issue severity, evidence and retest records. | Independent reviewer must be distinct from the producer for critical issues. |
| A10 | Client approval | Versioned client feedback classified as requirement, preference, usability issue, business requirement or technical constraint; approval and locked-decision record. | Client approver accepts the exact preview/version. |
| A11 | Release and handoff | Production release record, final QA, rollback/restore route, access/ownership, documentation, support boundary, analytics verification. | Authorized release owner approves deploy. |
| A12 | Outcome and learning | Post-launch measures with scope and attribution caveats, client feedback, support/rework, candidate patterns/failures; curated promotion only. | Human Memory Curator/owner approves generalization. |

**Rollback rule:** a discovered upstream problem reopens the right upstream gate and marks dependent artifacts stale. Do not endlessly patch a weak layout, wrong strategy, generic direction, bad source or broken design system downstream.

### 5.2 Agent capabilities: start small and cover the lifecycle

The design constitution and agency whole-chat summary define capability areas, not a demand for eight always-on model processes. Begin with one controlled runtime and assign roles per task:

1. **Orchestrator / Producer:** deterministic workflow state, task graph, context packet, budgets, deadlines, approvals, retries, audit and stop conditions; an LLM may help plan but cannot override policy.
2. **Research / Strategy:** sourced market, client and competitor findings; evidence-labelled positioning and briefs; no unsupported claims.
3. **Lead / CRM Operations:** schema-valid lead summaries, explainable score recommendations, routing suggestions and CRM drafts; no authority to modify consent, silently qualify, or send messages.
4. **Sales / Customer Success Assistant:** meeting preparation, handoff packets, proposal/status drafts from approved records, delivery follow-up recommendations; no independent prices, offers, contracts or commitments.
5. **UX / Creative Direction:** IA, interaction hierarchy, visual thesis, design system, responsive states and craft; follows the design constitution.
6. **Build / Creative Technology:** isolated branch/worktree code and previews against the approved repository and task contracts.
7. **Content / SEO / Analytics:** evidence-backed drafts, internal-link and experiment recommendations, funnel summaries; cannot publish or fabricate rankings/results.
8. **Independent QA / Security / Red Team:** deterministic tests and adversarial review of behavior, assumptions, originality, accessibility, performance, privacy and maintainability; cannot approve its own producer’s high-impact work.

Support, web performance, accessibility, SEO, finance and compliance can begin as narrow tools/checklists or human-owned tasks instead of extra model instances. Split a capability into a real sub-agent only when the host provides one and its independent context, tools, evaluation and accountability justify the cost. The Hotel Growth guest/operations/revenue/marketing capabilities belong to HGO’s separate domain; they are never given Agency CRM or client-project context by default.

### 5.3 Task and handoff contract

Every agent/worker task must declare:

```text
project_id · stage · task_id · parent_task_id · artifact_versions
objective · inputs · constraints · locked_decisions · evidence_needed
permitted_tools · forbidden_actions · output_schema · quality_gate
model/prompt/tool versions · token/time/cost budget · retry/stop policy
human approval requirement · correlation_id
```

Every result returns structured status (`complete`, `blocked`, `needs_review`, `failed`), summary, artifact references, assumptions, evidence references, decisions, risks, open questions, recommended next task and gate status. Validate the schema and evidence references before accepting a result. Recommended workflow-run states are `queued`, `running`, `blocked`, `needs_review`, `completed`, `failed` and `cancelled`; recommended artifact states are `draft`, `in_review`, `approved`, `locked`, `superseded` and `stale`. A change to an upstream decision marks dependent artifacts `stale` rather than silently reusing them. Agent disagreement is a bounded protocol: proposal → relevant critique → evidence/trade-offs → revised proposal → authorized decision; stop when evidence is sufficient or escalate.

### 5.4 Canonical artifacts and Website Schema

Keep these separate but linked and versioned: client brief, research, strategy, sitemap, wireframes, design system, content, assets, website schema, implementation commit, QA run and deployment. Stable artifact/element IDs support review, regeneration and change impact.

The canonical website representation should ultimately cover:

```text
brand/positioning · theme/tokens · sitemap/pages/sections
content references · component type/variant/states · responsive rules
interaction/motion · accessibility semantics · SEO metadata
asset IDs/licenses/alt text · analytics events · integrations
```

**Build in stages:** first versioned structured briefs/specs + code branch + preview; then validated schema-driven rendering for repeated page/component patterns; only later a visual editor or generalized compiler. Direct code exceptions are allowed but must be documented against the schema. Do not build a large compiler before one real project proves the schema and component registry.

### 5.5 Agency surfaces

- **Public Agency Marketing Site:** offer, services, permitted proof, contact/booking and consented lead capture. Keep public routes separated from internal data and never expose CRM secrets/client records in the browser.
- **CRM workspace (provider-owned):** contacts, companies, B2B/B2C deals, consent/DND, activities, sales-stage history and reports live in the selected CRM. The Agency Command Center links to it and may display a least-privilege projection; it does not become an undocumented duplicate CRM.
- **Agency Command Center (internal first):** client/project workspace, workflow/task graph, artifact versions, approvals, issues, agent/worker runs, cost, evidence, deployments and audit. An operator can answer “what happened, why, which source/version, what changed, and how to reverse it?”
- **Client Portal (later):** brief intake, project status, reviewable deliverables, feedback, approvals, preview and change requests in client language. Do not expose raw internal debate, hidden prompts, lead data or unrelated client work.
- **Generated website runtime/preview:** isolated build artifact, staged environment and human-controlled promotion; client access only to their own preview/project. A public marketing site and a generated client site have distinct deployment/analytics scopes.

---

## 6. Hotel Growth OS architecture and release boundary

### 6.1 Product hierarchy and whole-chat conflict resolution

The long-term HGO thesis includes operations/PMS, guest CRM, booking/distribution, marketing/growth, intelligence, automation and governed AI. Treat those as **bounded contexts and future capabilities**, not first-release requirements.

| Broad HGO whole-chat summary claim | Later/candidate evidence in the upload | Final architecture decision |
|---|---|---|
| Hotel Fountain website/CRM/Supabase/Vercel/Hostinger/n8n are an existing production foundation. | Public/candidate materials do not provide code, account ownership, system-owner approval or live credentials; latest status records outreach awaiting reply. | Verify each account/repository and its owner before reuse. No connection or customer claim based on the summary alone. |
| Initial MVP includes PMS, guest CRM, analytics, SEO/GEO, orchestrator and growth dashboard. | The current local MVP is described as synthetic aggregate reporting; later HGO MVP acceptance and v3 narrow first customer scope. | Phase 1 is one authorized property and aggregate daily reporting, no guest-level CRM or PMS writes. Broad scope is future vision only. |
| Launch 3–5 pilot hotels around a 14–20 week schedule; file APIs in week 0 based on stated provider review durations. | No API approvals, customer readiness, source code, schedule evidence or confirmed external requirement is supplied; latest candidate status is not pilot-qualified. | Do not promise dates or numbers of pilot hotels. Apply for a provider API only after a scoped need, authorized account and current vendor requirements are verified. |
| Pilot includes audit/setup/WhatsApp/roadmap for proposed BDT 20,000 and possibly credit it on conversion. | Later pilot/commercial materials keep fee/credit unapproved and require readiness, reconciliation, order, security and written go-live. | Price/credit remain unapproved; define one bounded pilot, start its live-day clock only after signed scope and written go-live acceptance. Messaging is a separate later approval. |
| OTA/channel-manager integrations are critical to direct booking and value. | Connector feasibility and current HGO plan require a system-specific evidence gate; no named property/provider contract or connector is verified. | Treat as a discovery/ROI hypothesis. Prefer minimized export for reporting; implement a provider adapter only after demand and access gates. |
| HGO economics, API lead times and plan targets justify expansion. | Original model and relevant workbooks are absent; audit log corrects old assumptions and later HGO documents label inputs as placeholders. | Keep HGO economics separate from Agency economics; use scenarios until actual cohort, support, provider and cash-flow data exist. |

The wide summary is useful for north-star discovery and product hypotheses; it does not supersede the newer safety/evidence gates or establish that its named systems exist in production.

```text
Phase 0 — local synthetic proof (documented current artifact)
      ↓
Phase 1 — production-safe aggregate reporting (first customer release)
      ↓
Phase 2 — one optional, approved read-only connector
      ↓
Phase 3 — one separately approved staff/growth workflow
      ↓
Later — CRM, booking/distribution, hotel operations, messaging, integrations, AI
```

### 6.2 Phase 0: local synthetic proof

- One fictional `SAMPLE_PROPERTY`; artificial 2099 dates; synthetic source/timezone/currency restrictions.
- Owner and read-only analyst behavior; exact-schema aggregate import/export; local storage and session model; visible caveats and demo labeling.
- The files report 26 integration tests and a preview smoke check. Because `app.py`, test source, static files and reset script are absent, do not claim this architecture review reran those tests.
- The current local app and the static HTML dashboard are **not** customer production systems. Demo credentials are expressly sample-only.

### 6.3 Phase 1: first production customer slice (not built/approved)

**Default scope:** one customer organization, one property, one authorized aggregate daily report; no guest-level rows; no messages; no booking, rate, inventory, cancellation, payment or refund write; no PMS replacement.

**Minimum data flow:**

```text
Written customer authority + approved purpose/fields/period
  → approved secure transfer
  → quarantined temporary staging with lifecycle timer
  → schema/size/row/date/type/scope/minimization checks
  → versioned field/channel mapping
  → report-owner reconciliation and exception disposition
  → commit aggregate values + import receipt/audit atomically
  → delete raw staging file under approved policy
  → owner report/export with source/period/denominators/quality labels
```

The uploaded CSV schema has these 15 exact ordered headers: `property_alias`, `business_date_local`, `property_timezone`, `currency_code`, `sellable_room_nights`, `occupied_room_nights`, `room_revenue_amount`, `revenue_basis`, `channel_breakdown_status`, `direct_room_nights`, `ota_room_nights`, `corporate_room_nights`, `other_source_room_nights`, `unattributed_room_nights`, `source_system_label`. It is a **synthetic demo schema** today. A production schema version and approved customer mapping must be established; do not simply remove the fixture restrictions and call the existing demo importer production-ready.

Metric rules:

- Occupancy = occupied room nights ÷ sellable room nights for the same property/period and hotel-confirmed definitions.
- ADR = agreed room revenue ÷ occupied/sold room nights only if revenue basis is defined.
- RevPAR = agreed room revenue ÷ sellable room nights only if revenue/capacity bases are defined.
- Channel room-night share is not reservation-count share or revenue share.
- `Unknown`, blank, `Not available`, `Partial`, `Withheld` and explicit zero remain distinct. Missing dates are not zero dates; do not silently interpolate or cap over-capacity values.
- All reports show property, period, date basis, timezone, currency, source, metric definition/version, numerator/denominator, gaps and source-owner reconciliation status.

### 6.4 Phase 2: connector only when justified

Prefer an approved minimized export for baseline reporting. Add a connector only when a documented hotel need cannot be met by export and the hotel/provider owners verify exact product/version, account authority, scopes, read-only proof, property boundary, costs, rate limits, webhook model, support, revocation, mappings and reconciliation. Use sandbox/synthetic tests; prove no-write behavior, idempotency, tenant isolation, retry/dead-letter behavior and restore/revoke path before customer data is used.

### 6.5 Phase 3 and later workflows

Add one customer-valued workflow at a time. A task/exception workflow may precede guest messaging. Guest messaging is off or draft-only until purpose, channel-specific permission, opt-out/suppression, copy, provider, approved recipient logic, rate/frequency limits, safe test, human approver, pause path and customer-specific written authorization all pass. Reservation, inventory, rate, payment, refund, financial, ad-budget and public-communication actions require separate explicit controls; no L4/L5 autonomy is a launch feature.

### 6.6 Hotel Fountain current gate

Based on the latest uploaded status record, do not advance from `discovery outreach sent / awaiting reply` unless a real new event is logged. If the hotel responds, follow the triage and discovery materials. The required order is:

1. Record the actual reply/date/channel (only what is known) and honor decline/suppression.
2. Confirm sponsor, hotel-stated problem, operator, report/data owner and decision authority.
3. Establish source authority by domain: reservation, availability, rates, cancellations and revenue may not share one source.
4. Agree a minimized aggregate baseline, report definitions, purpose, period, timezone, currency and approved secure route in writing.
5. Validate structure, then reconcile with the hotel report owner. A validator pass is structural only.
6. Complete applicable security, privacy, no-write, tenant, retention and export/offboarding checks.
7. Approve quote, tax/payment, scope, support, cancellation/credit policy and proposal internally before sending.
8. Configure and train; record written go-live acceptance. Only this timestamp starts the proposed 14-live-day period.
9. Run the fixed scope, midpoint review and evidence-based closeout; convert only with a separate written order or offboard/revoke as approved.

No Hotel Fountain system, CRM account, credentials, guest data, booking, message, baseline or customer agreement is evidenced in the upload.

---

## 7. Data, events, tenancy and contracts

### 7.1 Product-specific identity and data scopes

Do not create a single generic row model that conflates agency clients, hotels and internal engineering projects.

**Agency System:** internal `agency_workspace` → external CRM contact/company/deal reference → authorized `project_id` → project members/roles → project artifacts/tasks/decisions/deployments. The CRM owns sales/contact truth; the Agency OS owns delivery truth. An agency client is not automatically an HGO SaaS tenant, and a CRM contact is not automatically entitled to a project workspace.

**HGO:** `organization_id` is the hotel customer/account boundary; `property_id` is the hotel/property boundary. Add membership/property grants, composite foreign keys and server-side permission checks. Every tenant query, import, export, event, storage key, cache and background job must be tenant/property scoped.

**Readiness Console:** internal staff identity and control evidence only unless a separate customer-facing data contract is explicitly designed and reviewed.

Use database-level RLS where appropriate **plus** server-side authorization, least-privilege service roles and cross-tenant negative tests. RLS is not a substitute for secure service-role handling or authorization in workers/webhooks.

### 7.2 Initial domain entities

**Shared control-plane metadata (minimal):** identities, product/workspace memberships, roles/permissions, task/workflow definitions and runs, agent/prompt/tool versions, artifact references, approval records, audit metadata, usage/cost telemetry and correlation/event IDs.

**Agency acquisition/CRM context:** the selected external CRM owns contacts, companies, consent/DND, deals, lead-source attribution and sales activities. Agency OS stores CRM provider/reference IDs, idempotency and webhook receipts, narrowly scoped projections, approved service-catalog versions and workflow links; it does not become a second editable CRM. Provider-specific custom fields and lead-stage values are mapped/versioned in an adapter.

**Agency delivery context:** projects linked to the CRM deal ID, client/project memberships, briefs, sources/evidence, strategies, sitemaps, page/section specs, design systems/tokens/components, assets/license references, content, website schema versions, tasks/dependencies, decisions, feedback/change requests, code/commit references, QA findings, approval records, deployment/handoff, support and retainer/referral outcome references. Payment status comes from the payment provider when one is approved; never store card details in Agency OS.

**HGO Phase 1:** organizations, properties, memberships/property grants, approved source/report records, metric definitions, mapping versions, import batches, aggregate daily rows, audit/export events and retention/deletion jobs. No guest identity table is needed for the initial aggregate report.

**Readiness Console:** release records, evidence submissions, separate reviews, ADRs, findings, incidents, runbook executions and compliance bundles. Keep signing material in managed keys, not application records; a DB hash chain alone is not a guarantee against a privileged DB rewrite.

### 7.3 Durable event model

For consequential domain changes, commit the business record and outbox event in the same transaction. A dispatcher/worker publishes asynchronously; delivery is at-least-once, so consumers deduplicate and are idempotent. Use bounded retries/backoff, dead-letter queue, monitoring, trace/correlation IDs and auditable manual replay. Keep event payloads minimal and avoid guest PII.

Example envelope:

```json
{
  "event_id": "uuid",
  "event_type": "project.approval.completed",
  "schema_version": 1,
  "product_scope": "agency-os",
  "tenant_scope": "uuid",
  "resource_id": "uuid",
  "occurred_at": "ISO-8601",
  "actor_ref": "uuid-or-service",
  "correlation_id": "uuid",
  "data_ref": "scoped-reference-not-sensitive-payload"
}
```

Events trigger work; they do not bypass gates, roles or approval. External webhooks require signature/replay verification, persistence, deduplication and reconciliation before any domain command.

### 7.4 Agent/tool and approval contract

Agents have no unrestricted SQL, raw credentials, general provider access or direct production deployment rights. Tool calls must be typed and server-authorized, e.g. `create_project_artifact`, `read_approved_source`, `run_accessibility_checks`, `generate_preview`, `request_client_approval`, `get_daily_aggregate_report`. Every call validates product/tenant/project/property scope, actor, permissions, preconditions, rate/budget limit, idempotency key and approval.

Approval is bound to the exact action: tenant/property/project, target resource, payload hash, approver identity, expiry, one-time use, permitted tool and action scope. A chat response saying “approved” is not an execution token unless the approved system records and validates it.

### 7.5 Memory and intellectual property

Keep separate memory domains: client facts/preferences; project artifacts/decisions; generic design knowledge; failure/anti-patterns; measured outcomes; and HGO hotel/property data. Default retrieval is restricted to the same project/tenant. Do not expose a client’s brand assets, proprietary metrics, code or guest information to other client projects. Promote a reusable pattern only after review, rights/privacy check, scope/confidence label, validation evidence and expiry/supersession rules. A single positive result does not create a universal rule.

---

## 8. Security, privacy and operations

### 8.1 Non-negotiable controls

- Managed identity for production, privileged-role MFA, invitation/revocation and session invalidation. Do not use visible demo credentials outside a synthetic local environment.
- Deny-by-default, product/tenant/project/property/resource-level authorization. Test direct URLs, list/search, exports, file storage, preview links, background jobs, webhooks, support tools and caches across tenant boundaries.
- RLS/composite constraints and separate service identities; no service-role key in browser code, n8n export, repo, prompt, log or generated artifact.
- TLS, approved at-rest encryption, secrets/KMS, key rotation, storage lifecycle, data-region/vendor review and access logging appropriate to the chosen provider.
- Upload quarantine, exact schema/version, size/row caps, malware/format review as required, unexpected-column rejection, raw-file deletion timer and safe errors.
- Export controls include explicit scope, no-store, safe filenames/headers, audit metadata and CSV formula-injection defense for user-controlled values.
- Backups plus tested restore, recovery objectives, migration rollback, monitoring/alert ownership, incident response and tested offboarding across DB, objects, caches, backups/replicas and credentials.
- Audit evidence is tamper-evident and access-controlled; distinguish append-only application tables from independently anchored/non-repudiable evidence. No security certification is implied.
- External websites, uploaded documents, client copy and provider responses are untrusted data—not system instructions. Use prompt-injection defenses and never expose secrets/hidden instructions.
- Do not use unnecessary guest PII in model context, events, logs or analytics. Do not store card PAN/CVV; keep payment data with the processor if a future payment product is approved.
- Obtain qualified local privacy, communications, contract and accounting review where required; this architecture does not give legal or tax advice.

### 8.2 Risk and autonomy are separate axes

Use the shared autonomy ladder from HGO v3:

- **L0 Observe:** authorized read/display only.
- **L1 Analyze:** explain with source/period/confidence.
- **L2 Recommend/Draft:** no external side effect.
- **L3 Execute with approval:** exact action approved before execution.
- **L4 Constrained auto-execution:** only low-risk, reversible, capped actions after tested owner/monitor/kill-switch/rollback.
- **L5 Adaptive autonomy:** future target, not initial scope.

Also classify action risk independently:

| Risk | Examples | Default control |
|---|---|---|
| R0: internal/reversible | Format an internal draft, run tests, optimize an asset in a branch. | May be automated in a sandbox with budget, logs and rollback. |
| R1: scoped project change | Modify a preview artifact or internal task. | Reviewable diff, branch/preview, owner review. |
| R2: client-visible communication | Send/publish client or guest-facing copy; public replies. | Human/client approval, correct recipient/consent, exact version and pause. |
| R3: consequential operational/financial | Reservation/rate/inventory/payment/refund/ad-budget or sensitive data access. | Explicit authorized human approval; separate scope/test/rollback; not MVP. |
| R4: irreversible/high impact | Delete data, transfer domain, production destructive changes, legal/financial commitment. | Human-only authorization, dual control where appropriate, verified backup and audit. |

No autonomy level alone grants permission. Initial production systems stay at L0–L2 except bounded internal test/build actions.

### 8.3 Operational readiness

Before any customer production release: named service owner, alert destinations, on-call/escalation scope, operational runbook, restore exercise, incident rehearsal, credential revocation, retention/deletion test, tenant-negative test, access review, change/release approval, support boundary and customer-specific go-live acceptance. A `/health` endpoint or local log is not external monitoring/SLO/DR.

---

## 9. Quality, evaluation and metrics

### 9.1 Agency quality system

Evaluate the delivered site across strategy, comprehension, task success, information architecture, brand fit, originality, typography, composition, responsive behavior, accessibility, performance, content accuracy, security, technical maintainability and client acceptance. A single weighted score may aid triage but must not hide a blocker.

For the agency’s own marketing site and approved client websites, use these as **measured targets**, not guarantees: mobile-first task completion; a clear primary action per page; an initial-comprehension/5-second test where relevant; WCAG 2.2 AA review target; LCP below 2.5 seconds on a defined mobile test profile and CLS below 0.1 where measurement conditions are documented; reduced motion and keyboard/focus checks. Report route, device/profile, test method, baseline and result; do not claim compliance from an automated scan alone.

Required test families:

- Unit/contract tests for schemas, agent handoffs, policy decisions and state transitions.
- Scenario/regression tests for briefs, strategies, IA, design systems, code generation and expected failure modes.
- Adversarial tests for prompt injection, unauthorized tool request, cross-tenant retrieval and fabricated evidence.
- Integration/E2E tests from intake to preview/approval/deploy, including denied paths.
- Visual review at small/large mobile, tablet, laptop, desktop and large desktop; keyboard/focus/contrast/reduced-motion checks; accessibility scans and performance budgets.
- Build, lint, type, dependency, secret and security checks; only report checks that actually ran.
- Independent red team on major deliverables; issue severity, owner, fix and retest evidence.

### 9.2 HGO metric/report quality

Use the Hotel Reporting Metrics and Data Definitions Guide as the domain authority. All hotel measures include property, period, date basis, timezone, source, currency/revenue basis, numerator/denominator, channel mapping, quality state and report-owner review. Keep hotel-operating measures distinct from HGO company metrics and Agency OS delivery metrics.

### 9.3 Internal readiness / ABOS telemetry

The Grafana dashboard is a separate internal telemetry artifact. Before use, review SQL/schema, access and time filters: the visible queries are not tenant-scoped, the dashboard time picker is not visibly applied in the SQL, and currency labels use USD while HGO commercial assumptions are BDT. Keep it internal/read-only, filter by environment/product/time, document units and avoid customer exposure until corrected.

### 9.4 Agent/product success metrics

Measure value, safety and cost—not number of agents or words generated:

- Agency: qualified meetings, response-time distribution (only for a real staffed workflow), lead→meeting→proposal→Won conversions by segment/source, loss reason, revenue and gross margin by service, onboarding/delivery hours, time to approved preview/release, change/rework rate, client approval cycles, escaped defects, accessibility/performance issues, retainer conversion/renewal, referrals and cash collected. Instrument before setting targets.

The agency whole-chat file names **qualified meetings/month** as its proposed north star and proposes the following **hypothesis targets**, not baselines, commitments or verified company results. Its “1–2 people operating at the output of five” statement is also an aspiration to measure, not a capacity claim.

| KPI | Source-summary 90-day target | Source-summary 12-month target | Use |
|---|---:|---:|---|
| Organic sessions/month | 150–400 | 1,000–2,500 | Track by consented/approved analytics definition; do not optimize vanity traffic alone. |
| New leads/month | 15–30 | 60–100 | Count deduplicated, valid inquiries; separate B2B/B2C and spam. |
| First response under 5 min | 90% in business hours | 98% with a proposed 24/7 ambition | Report actual coverage hours, p50/p95 and misses; do not advertise 24/7 until staffed/monitored. |
| Lead → meeting | 15% | 20–30% | Define qualifying denominator and booked/held meeting event. |
| Meeting → proposal | 60% | 70% | Track segment and scope suitability. |
| Proposal → close | 30% | 35–45% | Define Won as signed/authorized and payment condition, not verbal intent. |
| Project → retainer | 20% | 30% | Measure cohort after delivery and offer eligibility. |
| Revenue B2B:B2C mix | 70:30 | 75:25 | Revenue mix hypothesis; not a mandate to accept unprofitable work. |
| Revenue from repeat/retainer work | — | ≥60% (12-month objective in summary) | Cohort-based actual recurring/returning revenue; define exclusions and do not relabel one-time work. |
| Agent-assisted touches/lead | ≥3 | ≥5 | Track only approved useful actions, not message volume. |
| Sampled agent error rate | <3% | <1% | Define severity/sample protocol; safety failures are release blockers regardless of average rate. |

- HGO: report freshness/reconciliation, import failures, time spent preparing owner reports, staff adoption, safe-workflow completion, onboarding/support time, actual recurring/API cost, pilot conversion and retention when enough cohorts exist.
- Agent runtime: useful evidence coverage, schema/handoff failure, retries, tool failure, human override, blocked unsafe action, task completion, latency, tokens/provider cost and cost per accepted outcome.
- Internal readiness: readiness evidence completeness, change failure, incident rate, restore success and time-to-revoke/resolve—not raw scan count.

---

## 10. Commercial and customer workflow controls

### 10.1 Agency commercial discipline

The digital-agency summary proposes B2B (higher-ticket/project and retainer) and B2C (smaller fixed-scope/fast path) segments. Keep their offers, pipelines, currencies, payment paths, qualification and service capacity distinct; do not force micro-business work through an enterprise proposal funnel or treat an enquiry as a contract.

For every service/package, define `Included / Add-on / Custom / Not supported`, exact deliverables/quantity, revision limits, meetings, content/assets, hosting, support channels/hours, onboarding, integrations, acceptance, cancellation and change-order approval. A fixed package must not become unlimited custom agency work. Do not publish `price-from`, discounts, guarantees, response SLAs or legal/payment terms until the authorized owner approves them. Sell verified outcomes and bounded scope, not “number of AI agents.” Track actual time/cost by package before asserting margin. The source summary’s draft prices, revenue mix, lead targets and retainer-conversion rates remain hypotheses.

### 10.2 HGO pricing and financial assumptions

The current proposed four-tier HGO price table in the v2/v3 materials supersedes the older PDF table, but remains **unvalidated and not approved for quotation**:

| Plan hypothesis | Monthly | Setup | Current boundary |
|---|---:|---:|---|
| Core | BDT 7,500 | BDT 10,000 | Proposed operations/reporting scope; limits/support need approval. |
| Growth | BDT 17,500 | BDT 25,000 | Proposed hero tier; direct-booking/connector capability must not be promised without verification. |
| Performance | BDT 35,000 | BDT 40,000 | Ad spend separate; content/campaign/support quantities and limits must be explicit. |
| Scale | BDT 60,000–100,000+ | Custom | Multi-property/custom statement of work; never unlimited. |

A BDT 20,000 one-time 14-live-day pilot and a possible setup-credit rule are proposals only. Tax/VAT, payment, cancellation, service levels, credit treatment and actual delivery cost require business/finance/delivery/legal approval before quote.

**Corrected scenario arithmetic from the v2 audit (not actuals):** 25/50/25 plan mix implies BDT 19,375 blended ARPA; BDT 4,250 assumed monthly direct delivery cost gives BDT 15,125 gross profit and 78.1% gross margin if cost definition is complete; 2.5% monthly churn gives a simplified BDT 605,000 gross-profit LTV. BDT 12,000 acquisition spend + BDT 18,600 first-year commission gives BDT 30,600 CAC excluding onboarding; adding BDT 16,250 assumed onboarding gives BDT 46,850 all-in acquisition/onboarding. The corresponding illustrative LTV/CAC is 19.8× excluding onboarding and 12.9× including it. Break-even wording differs by denominator: BDT 125,000 fixed opex ÷ BDT 15,125 gross profit is about 9 hotels before acquisition/other costs; ÷ the summary’s BDT 13,575 contribution after assumed recurring commission is about 10. This arithmetic explains the two source-summary estimates; neither is a verified break-even forecast, and taxes, payment fees, hiring, cash timing and cost completeness remain unresolved. Older scale EBITDA figures that treated a one-time acquisition commission as recurring on the installed base were withdrawn in the audit log.

Use these only to understand sensitivity. The referenced workbook, actual customer cohorts, invoices, tax treatment, cost ledger, provider prices and time logs are not supplied. The HGO Financial Model 2.0 is a **separate analysis deliverable**, not an excuse to broaden the MVP. It should include monthly 36-month cohort cash flow; funnel/sales capacity; onboarding hours and implementation capacity; staged headcount/capacity; per-hotel/per-plan AI, messaging, API and infrastructure costs; payment fees, collection delays, failed payments and refunds; setup/credit cash treatment; upgrade/downgrade/expansion/retention; and conservative/base/aggressive scenarios. Add a hotel ROI calculator only with sourceable user inputs (room count, ADR, occupancy, OTA commission, direct-booking share, cancellations) and clearly labelled assumptions—never guarantee uplift. Build a dated competitor matrix and an agent-economics view (accepted outcomes, hours saved, actions, cost per action) before using market/AI advantage claims. Keep all HGO values isolated from Agency revenue/unit economics. Never change assumptions merely to improve forecast outputs.

### 10.3 Safe sales and claim control

- The free audit is bounded (one property/objective, evidence-labeled findings, up to three recommendations in the template); it is not free migration, technical certification or ongoing consulting.
- The demo uses synthetic data and names what is prototype vs tested. Never imply Hotel Fountain is connected.
- The Sales Pipeline **stage** and **readiness** are distinct. A scheduled demo, interest, signed order or structural CSV pass does not independently pass data/security/go-live gates.
- Do not promise revenue, occupancy, booking, ranking, review, AI or security outcomes without current scoped evidence and approved wording.
- If the hotel declines, honor suppression; no automatic follow-up cadence from silence.

---

## 11. Build sequence and exit gates

No fixed calendar promise is made. The repository inventory, team capacity, commercial decision, customer response, partner access and security findings are not sufficiently evidenced for a credible duration estimate. Sequence the work by exit criteria.

### Gate 0 — portfolio and source-of-truth review (blocking before code changes)

**Tasks**
1. Ratify the business boundary: digital-services agency operating system (acquisition/CRM/delivery/retention) plus, only if intentionally pursued, separate Hotel Growth OS and separate internal Readiness/ABOS tooling. Record the decision; do not blend their data models.
2. Inventory the actual Agency marketing website, CRM account/workflows, hosting, repositories, domains, analytics, forms, consent records and account owners. The new agency summary says “starting from zero” while other source material describes existing assets; prove which is current.
3. Obtain authorized HGO and Readiness Console source/deployment evidence. Inspect the HGO Python/SQLite source and tests and the separate Next.js `src/`, schemas and migrations if those systems are candidates for reuse.
4. Map every file/config to its owning repository/environment; confirm code/data rights, identities, vendors, backups, restore, logs, deployments and secrets ownership without exposing secret values.
5. Validate CRM and CMS candidates, API plans/scopes, payment/communication providers, costs and data export/deletion requirements before selecting them. HubSpot Starter/Payload/Vercel/n8n/Cal.com and related tools are candidates, not verified accounts.
6. Request the missing financial workbook or build a fresh model from dated, evidence-labelled inputs. Keep Agency and HGO economics in separate models.
7. Register `/home/user/skill.md` in the chosen host only after checking its loader schema; configure and test required Graphify and Front-End Checklist MCP capabilities for the work classes that depend on them. Record actual availability and tool names.
8. Freeze an evidence ledger, missing-artifact register and current status snapshot; label source-summary targets as assumptions.

**Exit evidence:** owner-approved system context, repository/account inventory, CRM field ownership, first vertical slice selected, build-vs-adapt decisions, initial threat model, named owners, scope, approvals and ADRs.

### Gate 1 — minimum vertical-slice foundation (avoid platformizing early)

Implement only what the first revenue-to-delivery slice requires: authenticated agency operator access if a console is needed; a narrow CRM adapter; typed lead/project references; consent/DND and approval checks; minimal project/artifact/task state; audit and correlation IDs; idempotent webhook/outbox handling where needed; budgets/timeouts; tests and feature flags. Do not build a generic cross-product identity graph, multi-tenant SaaS control plane, custom CRM, universal agent runtime, vector memory or broad workflow engine before the use case proves it is needed.

**Exit evidence:** scoped authorization tests; duplicate/replay/failure handling; accepted CRM field ownership; versioned project artifacts; approvals bind to a specific action; failures are visible; no client or HGO scope is reachable from the wrong context.

### Gate 2 — Agency revenue-to-delivery vertical slice

Prove the smallest real business loop, not the whole roadmap:

1. Use the verified agency website or ship only a truthful minimum Next.js 16/React 19/Tailwind v4 site slice (primary offer, proof only if authorized, contact/booking/intake). Do not invent case studies, prices or performance claims.
2. Validate one inbound form/booking path server-side; record source and required contact permission without unnecessary fields. Test consent absent, DND, spam, duplicate submissions and provider/API failure.
3. Connect one selected CRM (HubSpot is a candidate, not a verified account) through a narrow server-side adapter. Test idempotent upsert/dedupe, CRM activity/audit, webhook signature handling and replay/reconciliation. Keep first responses human-operated; no auto-nurture or lead scoring writes in the first release.
4. Exercise one qualified B2B path through discovery → human-approved scope/proposal → explicit Won event. Keep B2C fast lane as a separately specified pipeline if the owner confirms it is part of the first market; do not force both funnels into one state machine.
5. On the authorized Won event, create a project workspace linked to the CRM deal ID (not a duplicate CRM record). Run one client website project through A0–A12: evidence/research → strategy/IA → design → branch/preview → tests/independent review → client approval → handoff.
6. Record delivery, support and retainer/referral decision as separate human-owned outcomes. No automatic payment, contract, review ask or retainer commitment until independently authorized.

**Exit evidence:** the source version and CRM provider/account are confirmed; all records and events can be reconciled; duplicate/failure/opt-out/unauthorized paths are tested; project artifacts and approvals are versioned; one preview builds and passes applicable MCP/test/quality gates; no external action occurs without its approval; a human can reconstruct the lead-to-delivery history. No public client portal, custom CRM replacement, full website-builder SaaS, large CMS, B2C checkout, 14-agent fleet or autonomous deployment is required to prove this first slice.

### Gate 3 — HGO Phase 0 source verification and product decision

Retrieve the described HGO source (`app.py`, tests, static assets, reset script and validator) and independently rerun its acceptance tests in the intended local environment. Inspect the reported 26 tests and confirm the synthetic restrictions, metrics, headers, role checks, idempotency, export and reset behavior. Fix the synthetic HTML ADR/RevPAR display discrepancy.

**Exit evidence:** reproducible test report from source, version/hash, test environment, known limitations, demo claims register updated. This still does **not** authorize hotel data or constitute production readiness.

### Gate 4 — HGO production foundation (only if the product owner chooses HGO launch)

Select stack by ADR; implement production identity/MFA/revocation, organization/property authorization, database/RLS/composite constraints, secure import/storage lifecycle, schema/mapping version, audit/export, retention/deletion, monitoring, backups/restore, incident response, alert ownership, protected logs, data/tenant negative tests and migration/rollback. Complete required vendor/privacy/security/accounting/legal reviews.

**Exit evidence:** production controls tested in staging; independent security review appropriate to scope; restore/offboarding drills pass; customer-specific authorization and source-of-truth evidence exists; no open critical blocker.

### Gate 5 — authorized aggregate-report pilot

Proceed only after the Hotel Fountain or another named customer has a sponsor, approved data owner, defined aggregate scope, secure transfer route, reconciled metrics, commercial order, safety tests, operator training and written go-live acceptance. Start the 14-live-day clock only after go-live acceptance. If no customer is ready, remain in synthetic testing; do not reinterpret public facts as permission.

**Exit evidence:** daily import/report reliability, reconciliation status, operator usage, support/time/cost, issues/pauses, Day-7 review, Day-14 closeout, explicit conversion/extension/offboarding decision.

### Gate 6 — focused expansion

Only after a repeatable first release: add one read-only connector or one approved workflow at a time; then evaluate guest CRM, booking/distribution, PMS operations, messaging, SEO/growth integrations, specialist agents, client portal and multi-property. Each extension needs demand, written authority, source-of-truth design, test/evaluation, owner, cost, support, rollback and commercial limit.

### Gate 7 — governed learning and scale

Introduce a Memory Curator/Experimentation capability only after evaluation datasets, privacy rights, quality outcomes, attribution and deletion are sound. Add L4 only for narrowly scoped reversible actions with proof of reliability and a kill switch. L5, autonomous pricing, payments, refunds, unrestricted outreach and high-impact deployment are not launch objectives.

---

## 12. Build backlog and ownership

| Priority | Work item | Accountable owner | Key dependency / acceptance |
|---|---|---|---|
| P0 | Ratify business/product boundary and revenue-to-delivery first slice. | Product owner / agency principal | ADR-00 separates agency acquisition/CRM/delivery, HGO and internal readiness. |
| P0 | Register the skill in the target host and validate MCP dependencies for relevant work. | Engineering operations owner | Loader/schema confirmed; real Graphify and Front-End Checklist tools exposed; absent tools block affected verification. |
| P0 | Inventory Agency website, CRM, domain, analytics, repositories, accounts and permission owners. | Technical + agency operations owner | Establish what is live vs proposed; choose CRM field owner; no secrets exposed. |
| P0 | Obtain and inventory Agency, HGO and Readiness application source trees plus financial workbook. | Technical owner | Repo/deployment/schema/tests/rights mapped; missing evidence logged. |
| P0 | Maintain Hotel Fountain at `awaiting reply`; use only approved response/discovery process. | Sales owner | Actual events logged; no unapproved cadence, quote, access or data request. |
| P1 | Choose CRM/CMS provider by ADR; define server-side adapters and field ownership. | Agency operations + engineering | HubSpot/Payload are candidates only; confirm account/API/data rights and exit/export path. |
| P1 | Build minimum truthful public site + consented intake and test one inbound path. | Agency lead + engineering/design | No fabricated proof/price; spam, consent, duplicate and provider-failure cases pass. |
| P1 | Connect selected CRM with idempotent upsert, human routing and auditable activity. | Engineering + sales owner | CRM remains sales system of record; first response is human-led; no auto-nurture. |
| P1 | Link explicit Won event to project workspace; run one client project A0–A12 to approved preview. | Producer + engineering + Creative Director | End-to-end revenue-to-delivery loop, tests/MCP gates and human approval evidence. |
| P1 | Reproduce HGO synthetic MVP QA from source and resolve demo metric discrepancy. | HGO technical owner | Source code present and reported 26-test suite independently rerun; synthetic label maintained. |
| P1 | Establish least-privilege Agency client/project access and initial security/retention model. | Security/data owner | Negative tests across app, DB, jobs, exports, webhooks and support surfaces; no premature multi-tenant SaaS. |
| P2 | HGO production aggregate-report release. | HGO product owner + customer data owner | Only after HGO production/customer gates; aggregate-first, no guest data/writes by default. |
| P2 | Internal readiness tooling integration or reuse. | Engineering operations owner | Source review, separation-of-duties, signing-key design, SQL scope/time fixes. |
| P3 | Client portal, visual editor/compiler, public B2C checkout, broad CRM replacement, HGO PMS/CRM, connectors, paid media and agent fleet. | Product owner per domain | Each independently justified by usage, support, security, consent and economics evidence. |

### Human authority / RACI minimum

- **Product owner / agency principal:** owns the agency’s positioning, product boundary, release scope, service catalog, priorities and budget.
- **Agency sales / CRM owner:** owns lead-stage rules, consent policy, CRM field ownership, response coverage and sales handoff; cannot override security or client approvals.
- **Agency project lead / Producer:** owns project state, approved scope, delivery and client communication.
- **Customer-success/support owner:** owns support boundaries, renewal/retainer decisions and client escalation.
- **Creative Director:** final agency creative coherence; cannot override client-locked decisions.
- **Technical owner:** architecture, code quality, migration, deployment and rollback.
- **Security/data owner:** tenant model, data minimization, threat model, retention and incident readiness.
- **Client approver:** approves specific agency deliverable/version and brand/business decisions.
- **Hotel sponsor/report owner:** approves exact HGO scope/data path and confirms metric definitions/totals.
- **Finance/accounting and qualified legal/privacy reviewers:** approve customer pricing/tax/contract/data terms where required.
- **AI/agents:** recommend and produce bounded artifacts; no independent authority over release, pricing, data transfer or consequential external action.

---

## 13. Acceptance and release checklist

A release is **not done** because code compiles or an architecture file exists. Every applicable box needs an artifact/evidence reference.

### Agency System revenue-to-delivery slice

- [ ] Product boundary and repository/source version recorded; current website/CRM ownership verified.
- [ ] Public offer, service scope, pricing and proof content are owner-approved; unsupported metrics/testimonials/case studies are absent.
- [ ] Lead form is server-validated and minimized; consent and DND states are explicit; opt-out, spam, replay and duplicate cases are tested.
- [ ] Selected CRM is the confirmed system of record; adapter/upsert/webhook is scoped, idempotent, auditable and reconciled; no parallel CRM truth is created.
- [ ] B2B and B2C stages remain distinct where both apply; scoring is deterministic/explainable; human owns qualification, proposal, price and commitment.
- [ ] One inbound path reaches CRM with source/permission evidence and human response; no unapproved automated outbound occurs.
- [ ] Explicit authorized Won/deal event creates a project linked by CRM ID; project artifacts do not duplicate CRM deal truth.
- [ ] Client/project brief, evidence, strategy, IA and wireframe are versioned.
- [ ] Approved design direction, design tokens/components and responsive/motion/accessibility rules exist.
- [ ] Build runs in a branch/isolated environment; preview maps to a known artifact version.
- [ ] Every production-code ticket followed RED→GREEN→REFACTOR with a verified failing test before implementation; docs/config-only tickets used applicable parsing/lint/schema checks instead.
- [ ] Lint/type/unit/integration/build and end-to-end checks ran; results are recorded honestly.
- [ ] Six viewport classes visually reviewed; keyboard/focus/reduced-motion and core accessibility checked.
- [ ] Independent red-team issues resolved or accepted by the authorized owner; no critical security/accessibility blocker hidden by a score.
- [ ] Claims, assets, testimonials and statistics are sourced or explicitly placeholder-marked.
- [ ] Client approval is tied to the exact version; locked decisions preserved.
- [ ] Human release approval, rollback/restore and handoff record exist.
- [ ] Actual client/project data are not retrievable by another client, agent or product context.

### HGO customer release

- [ ] Customer sponsor/data owner, purpose, property, source, fields, period, timezone, currency, metric definitions and transfer route are approved in writing.
- [ ] Production identity/MFA/revocation, tenant/property server checks, RLS/composite constraints and cross-tenant negative tests pass.
- [ ] Raw-file staging, access, retention/deletion, export, backup/replica handling and incident path are tested.
- [ ] Source owner reconciles row counts/totals and signs metric definitions; unknown/partial values remain visible/withheld.
- [ ] No guest PII is present in aggregate baseline; no unauthorized write or message path exists.
- [ ] Monitoring/alerting and named response owner exist; backup restore and offboarding drills pass.
- [ ] Required vendor, privacy/security, legal/accounting and commercial reviews are recorded.
- [ ] Operator training, pause/restart, support limits, day-7/day-14 runbook and customer-specific go-live acceptance are recorded.
- [ ] Price/terms are approved and a subscription never starts automatically.

### Internal Readiness Console / ABOS

- [ ] Source code/schema/migrations/tests reviewed; environment and datasource are internal-only.
- [ ] Maker/checker separation prevents self-approval of submitted evidence; privileged operations are MFA/audited.
- [ ] Signing keys are managed/rotated; exports are verifiable; tamper evidence is not overstated.
- [ ] Production migrations use reviewed/versioned migration files and rollback plan.
- [ ] Grafana queries have appropriate time filters, environment/product scope and correct currency units; customer data cannot leak.

---

## 14. Decision and risk register

| ID | Decision / risk | Current status | Required action before affected build/release |
|---|---|---|---|
| D00 | What is the primary product boundary? | **Settled for this plan:** the primary system is the digital-services Agency System (acquisition/CRM/delivery/retention). HGO is a separate product line only if the owner elects to pursue it; the Readiness Console remains internal. | Record the portfolio decision in an ADR; never merge domain data because they share an operator. |
| D01 | Which repositories, deployments, agency website and CRM accounts correspond to each product? | **Unverified.** README, HANDOVER and Next.js configs do not include complete application sources; agency summary says “starting from zero” while other summaries claim existing assets. | Obtain authorized source/account evidence and map app → data → deployment → owner. |
| D02 | What stack and service providers should be used? | **Greenfield Agency stack confirmed by the latest user instruction:** Next.js 16/React 19/strict TypeScript/Tailwind v4/Bun. Existing repo identity, CRM, CMS, hosting, auth and HGO stack remain unverified/unselected. | Preserve existing repos; ADR the CRM/CMS/hosting/auth/provider choices. Do not treat HubSpot/Payload/Vercel/Supabase/n8n or the generic package as live without verification. |
| D03 | Is Hotel Fountain a pilot customer? | **No.** Outreach reportedly sent; reply pending; not qualified. | Wait for actual response, then discovery and evidence gates. |
| D04 | HGO source of truth for reservations, rates, availability, cancellations and revenue? | **Unknown for Hotel Fountain.** | Hotel source/report owner confirms by data domain; no write integration before that. |
| D05 | Is real HGO aggregate ingestion authorized and implemented? | **No evidence in upload.** Current importer is described as synthetic-only. | Implement production path and obtain written scope/transfer/retention authorization. |
| D06 | Is guest messaging or guest-level CRM in the first release? | Earlier pilot brief allows optional workflow; MVP/v3 are narrower. | Resolve by excluding from first release; reopen only with separate consent/provider/security gate. |
| D07 | Which HGO pricing/credit terms are approved? | **No quote approved.** | Finance/business/delivery/legal approvals; actual costs and scope caps. |
| D08 | What are actual HGO unit economics and retention? | Assumptions only; source workbook absent. | Collect invoices/time/cohort data; build 36-month evidence-based cash model. |
| D09 | Is the readiness console genuinely production-ready? | Handover claims delivered, code absent. | Reproduce type/build/security tests and review authorization/data model before reuse. |
| D10 | Can Agency OS memory generalize client work? | Not authorized by default. | Require rights, de-identification, validation, scope, confidence and retention review. |
| R01 | Cross-tenant data exposure through query/export/job/storage/agent retrieval. | High impact. | RLS + server policy + composite FK + complete negative test matrix. |
| R02 | Unverified source or mislabeled metric creates false business decisions. | Present in candidate/demo material risk. | Source provenance, definitions, reconciliation and withheld state; correct HTML synthetic metric display. |
| R03 | AI writes, sends or deploys beyond delegated authority. | Target-state risk. | Typed tools, approval-token binding, branch-only build and deny-by-default policies. |
| R04 | HGO evolves into unlimited services agency and breaks margins. | Explicitly recognized in source docs. | Plan limits/add-ons/custom/not-supported and measured delivery capacity. |
| R05 | Inconsistent implementation claims across README/HANDOVER/configs. | Source bundle ambiguity. | Repository provenance and reproducible test/build evidence before external claims. |
| R06 | Stale/unsupported market, API, legal or financial claims are published. | Evidence gaps. | Date/source verification and owner review; no unsupported fixed API-duration promise. |

---

## 15. Final operating principles

1. **One system of record per domain.** Do not let two systems silently own hotel inventory, reservations, money, project approvals or website versions.
2. **Separate product boundary before stack boundary.** Reuse control-plane patterns; isolate domain data, permissions and learning.
3. **Evidence before claims.** Public, reported, synthetic, proposed and verified are separate states.
4. **Smallest useful release first.** One end-to-end Agency OS project; HGO aggregate reporting only after production/customer gates.
5. **LLM proposes; deterministic software validates; scoped APIs execute.** No unrestricted SQL, secret access, production writes or self-approval.
6. **Human/client authority stays explicit.** Strategy, brand, high-impact content, data sharing, pricing, messaging and production release require the applicable owner.
7. **Memory is curated and scoped.** No client or guest knowledge becomes cross-client guidance automatically.
8. **Build commercially, not ceremonially.** Measure delivery value, service capacity, cost, pilot conversion and retention; agent count and feature volume are not success.
9. **A checklist is not an implementation.** Prove each gate with tests, logs, approvals, runbooks and rollback.
10. **No silent scope drift.** Change requests identify affected artifacts, data, gates, effort and authority before work resumes.

---

# Appendix A — File-by-file review of all 51 supplied files

The following is the file audit used to assemble this architecture. The `decision` column states how each file should influence the final plan; it does not claim that a documented feature was independently verified in source code.

## A1. Agency OS and design constitution

| File | What it contains and how it is used |
|---|---|
| `AGENCY-OS-MASTER-ARCHITECTURE.md` | Detailed multi-agent website-agency architecture: constitution, 14 core agent roles plus later memory/experimentation roles, debate, structured decisions, memory, website schema/compiler, approvals, gates, security, metrics, stack ideas and build order. Strong organizational source, but too broad as a first sprint; use its design/governance ideas while reducing runtime agent count and phasing the compiler/platform. |
| `AGENCY-OS-UNIFIED-MASTER-ARCHITECTURE.md` | Consolidates the Master Design Agent and Agency OS into product/control/agent/artifact/delivery/learning planes; adds non-goals, role-as-capability, state-machine plus task-graph, selective debate, human authority and a vertical-slice strategy. Use as the controlling Agency OS baseline, then add the product-boundary separation and source-evidence gates in this final plan. |
| `master-design(1).md` | 67-section design constitution covering discovery, evidence/assumptions, research/reference abstraction, strategy, IA, wireframes, typography/color/composition, components, responsive design, motion/reduced motion/3D, accessibility, performance, implementation order, QA, red-team, handoff and modular skills. Keep as the creative quality constitution; do not run it as one giant all-purpose runtime prompt. |

## A2. Hotel Growth OS historical and current architecture sources

| File | What it contains and how it is used |
|---|---|
| `master-design-build-intelligence.md` | Early synthesis of 47 source-summary sections for HGO: product layers, target segment, proposed pricing, agents, technology, financial assumptions, broad roadmap and conflict notes. It records assumptions and gaps but contains earlier timeline/API and scope ideas; use it as history, not the final executable specification. |
| `Hotel_Growth_OS_Comprehensive_Architecture_Blueprint-1.pdf` | Older 13-page, 33-section HGO target design: six product layers, PMS/CRM/room operations, event-driven architecture, n8n, AI agents, integrations, role matrix, commercial/financial model and broad roadmap. It uses an older Starter/Growth/Managed Growth price table, conflates room/availability states in places and has an older autonomy scale; the later audit/v2/v3 documents supersede those points. The PDF itself notes that the source notebook was not independently extracted. |
| `Hotel_Growth_OS_Audit_and_Revision_Log.md` | Explicit reconciliation of the PDF and early HGO master: retires the older price table, corrects CAC/onboarding labels, withdraws the old EBITDA assumptions, narrows the MVP, standardizes autonomy, adds outbox/idempotency, clarifies tenant keys and separates room condition from inventory. Use as the record explaining why the final plan follows v2/v3 rather than older text. |
| `Hotel_Growth_OS_Comprehensive_Architecture_Blueprint_v2.md` | Audited target architecture covering tenant/property authorization, domain entities, reservation transaction boundaries, outbox/events, n8n limits, AI gateway, security, metrics and evidence-gated roadmap. Strong HGO design source; explicitly not a deployed-system certification. |
| `Hotel_Growth_OS_Master_Design_Build_Intelligence_v2.md` | Reconciled product/commercial/build intelligence with corrected economics, pricing hypotheses, narrow initial release, pilot sequence, domain rules and source map. Use for strategic and financial interpretation, not as validated market research or live operating evidence. |
| `Hotel_Growth_OS_Master_Architecture_Build_Brief_v1.md` | Inventory and architecture input brief that distinguishes the local synthetic proof from target architecture and lists missing source files, open decisions and the correct build order. It makes clear that production stack, first customer, source of truth and secure data path are unresolved. |
| `Hotel_Growth_OS_Master_Architecture_v3.md` | Most detailed/latest HGO architecture in the bundle: evidence states, Phase 0–3+ boundaries, production tenant/domain design, APIs, import/export/offboarding, event/outbox, AI governance, threats, observability, UI, commercial assumptions and decision register. Use as HGO authority, with the final plan’s stricter product separation and aggregate-only initial pilot. |
| `Hotel_Growth_OS_MVP_Product_Build_Plan_and_Acceptance_Criteria_v1.md` | Defines the 14 local synthetic-MVP acceptance criteria and separate production release gates. It establishes aggregate-only v0 and excludes hotel data, CRM, messages, integrations, writes and billing. Its reported 26-test pass is not reproducible from the uploaded files because code/tests are absent. |

## A3. HGO product, sales, commercial and operating materials

| File | What it contains and how it is used |
|---|---|
| `Hotel_Growth_OS_14-Day_Pilot_Brief_v1.md` | Proposed one-property pilot with a 14-live-day window after setup/reconciliation/training/acceptance, no PMS writes, safety gates, scorecard and an optional human-reviewed post-stay flow. The optional guest workflow is wider than the aggregate-only MVP; final plan moves it to a separate later gate. Fee/credit remain unapproved. |
| `Hotel_Growth_OS_14_Day_Pilot_Operating_Runbook_v1.md` | Day-0 setup, daily import/report checks, day-7 review, day-14 closeout, pause/incident steps and low-volume handling. Strong operating procedure template; not permission to process data or launch. |
| `Hotel_Growth_OS_Demo_and_Pilot_Conversion_Playbook_v1.md` | Evidence-safe audit-to-demo-to-pilot script, qualification gates, objection handling, follow-up and funnel metrics. Use with the pre-sales claims register; demo only tested screens and no implied connection. |
| `Hotel_Growth_OS_Free_Hotel_Growth_Audit_Template_v1.md` | Bounded, evidence-labeled one-property audit with up to three prioritized recommendations; explicitly excludes guest-level review, implementation and guaranteed uplift. Good lead asset; not free consulting scope. |
| `Hotel_Growth_OS_Financial_Model_Assumption_Validation_Plan_v1.md` | Evidence plan for replacing model placeholders with signed orders, invoices, funnel events, time logs, provider costs, collections, hiring and retention. Treat model as scenario mechanism, not forecast; keep historic forecast versions. |
| `Hotel_Growth_OS_Pilot_Commercial_Approval_Memo_v1.md` | Internal approval template for proposed BDT 20,000 pilot, tax/payment/cancellation, credit, scope and delivery costs. It expressly says no quote until approvals are recorded. |
| `Hotel_Growth_OS_Post_Pilot_Conversion_and_Onboarding_Runbook_v1.md` | Requires a completed closeout, explicit customer decision, separate subscription order and approved price/tax before onboarding; includes handoff, first-30-day cadence and offboarding. Use to prevent automatic conversion or unapproved continuing access. |
| `Hotel_Growth_OS_PreSales_Claims_and_Capability_Register_v1.md` | Controlled claims register distinguishing artifact-verified, synthetic, proposed, customer-dependent and unauthorized capabilities. Use as the external-language gate for audit/demo/proposal/website claims. |
| `Hotel_Growth_OS_Sales_Pipeline_Stage_and_Evidence_Guide_v1.md` | Defines prospect stages separately from evidence readiness; prohibits advancing from drafts, verbal claims or structural checks alone. Current candidate is still outreach sent / readiness open in the recorded status. |
| `Hotel_Growth_OS_Project_Index_and_Hotel_Fountain_Next_Gates_v1.md` | Older navigation/status index for the discovery-to-pilot package; documents public-only findings and open customer gates. Use as historical index; the v23 index is the more current status record. |
| `Hotel_Growth_OS_Project_Index_and_Next_Gates_v23.md` | Latest attached project navigation/status index (2026-10-02): local synthetic MVP documented as tested; production and Hotel Fountain pilot remain blocked; lists the current sales-to-pilot sequence and missing production gates. Use for current HGO state, while noting referenced source files are not uploaded. |

## A4. Data, metric, connector and security materials

| File | What it contains and how it is used |
|---|---|
| `Hotel_Growth_OS_Aggregate_CSV_Validator_README_v1.md` | Explains the local validator’s exact schema/type/date/consistency checks and its limits. Structural validation is not accuracy, authorization, consent, security review or reconciliation. |
| `Hotel_Growth_OS_Aggregate_Data_Request_and_Field_Guide_v1.md` | Hotel-friendly request for one-property daily aggregates, field definitions, secure-transfer prerequisites and excluded identifiers/credentials. Use only after authority and written scope are approved. |
| `Hotel_Growth_OS_Aggregate_Export_Scope_and_Approval_Record_Template_v1.md` | Operational scope record for exact purpose/property/source/fields/period/transfer/access/retention and reviews. It clearly is not a contract, DPA, legal basis or standalone authorization. |
| `Hotel_Growth_OS_Hotel_Reporting_Metrics_and_Data_Definitions_Guide_v1.md` | Defines room nights/capacity, occupancy, room revenue, ADR/RevPAR, channel denominators, cancellations, repeat stays and missing/zero/partial/withheld states. Use with source-owner sign-off. |
| `Hotel_Growth_OS_PrePilot_Data_Access_and_Security_Test_Plan_v1.md` | A01–A20 pre-ingest/no-write/tenant/consent/logging/pause/retention/go-live controls; all Hotel Fountain controls start open/not run. It is a test plan, not certification or legal approval. |
| `Hotel_Growth_OS_ReadOnly_Connector_Feasibility_Worksheet_v1.md` | System-neutral connector assessment; prefers aggregate export and requires provider, account, exact scope, revocation, data behavior, privacy and no-write evidence. It does not authorize credentials or connection. |
| `Hotel_Growth_OS_ReadOnly_Aggregate_CSV_Blank_Template_v1.csv` | One-line, 15-field CSV header for the proposed daily aggregate shape. It contains no customer data and is not by itself an approved production schema. |
| `Hotel_Growth_OS_Synthetic_Daily_Aggregate_Fixture_v1.csv` | Thirty fictional daily rows for `SAMPLE_PROPERTY` in 2099; internal arithmetic totals 960 sellable / 672 occupied room nights and BDT 3,024,000 reported room revenue. It is a test fixture only, not Hotel Fountain data. |
| `Hotel_Growth_OS_Synthetic_Fixture_Preflight_v1.json` | Reports `PASS_WITH_WARNINGS`: 30 rows; 70.0% occupancy; 17 unattributed nights; unknown revenue basis; ADR/RevPAR null/withheld. It proves fixture structure/arithmetic only. |

## A5. Hotel Fountain candidate and demonstration files

| File | What it contains and how it is used |
|---|---|
| `Hotel_Fountain_Demo_Storyboard_PreDiscovery_v1.md` | Ten-minute, priority-led demo storyboard with explicit synthetic/non-connected disclosure, no-write/no-message rules and a proceed/defer/stop decision. Use only after discovery qualifies a real problem. |
| `Hotel_Fountain_Discovery_Call_Guide_v1.md` | Twenty-five-minute qualification call to identify sponsor, problem, systems/source of truth, aggregate baseline, consent owner and a safe next step. Do not ask for credentials/guest-level data. |
| `Hotel_Fountain_Discovery_Outreach_Drafts_v1.md` | Exploratory email/WhatsApp drafts; the actual outreach reportedly sent is not tied to these drafts and its date/channel/wording is unknown. Do not represent a draft as sent. |
| `Hotel_Fountain_Discovery_Recap_Email_Template_v1.md` | Post-call recap template that distinguishes hotel-reported from verified facts and explicitly says discovery is not a pilot order. No actual meeting/use is recorded. |
| `Hotel_Fountain_Free_Hotel_Growth_Audit_Preliminary_v1.md` | Public-source review dated 2026-10-01; identifies visible room/rate/availability surfaces and trust-signal inconsistency, while documenting that no CRM, analytics, PMS, booking or guest data were checked. Preliminary only. |
| `Hotel_Fountain_PreDiscovery_Synthetic_Demo_Dashboard_v1.html` | Standalone responsive visual prototype with synthetic disclaimers and simulated controls; no live data/network integration. Its numeric synthetic ADR/RevPAR should be hidden or clearly marked illustrative-only/withheld while revenue basis is unknown; the modal should gain focus management and the CSS should respect reduced motion before wider use. |
| `Hotel_Fountain_PrePilot_ReadOnly_Aggregate_Export_Spec_v1.md` | Candidate-specific draft of the 15-field aggregate report, channel reconciliation and handling sequence. It correctly warns that public room count is not sellable capacity and all source mappings are open. |
| `Hotel_Fountain_Public_Site_Snapshot_and_Pilot_Readiness_v1.md` | Public observations, rating mismatch and readiness register; says candidate is plausible but not data/messaging-pilot-ready. Refresh stale observations before use and do not turn public facts into operating facts. |
| `Hotel_Fountain_Response_Triage_and_Discovery_Scheduling_Playbook_v1.md` | Safe handling of interest, price requests, referrals, decline, no reply, unexpected sensitive data and demo/system-access requests. It makes clear reply is not consent or qualification. |
| `Hotel_Fountain_Remaining_Actions_in_Order_v18.md` | Current detailed ten-step sequence from awaiting reply through discovery, authorization, export, reconciliation, security, commercial approval, go-live, 14-day run and offboarding. It is the operational action source for the current candidate, but references many companion workbooks/scripts not in this upload. |

## A6. Implementation, telemetry and project-configuration artifacts

| File | What it contains and how it is used |
|---|---|
| `README.md` | Describes a local Python 3.10+/SQLite synthetic-only MVP, visible demo credentials, import/export/health/reset/test procedure and explicit production boundary. `app.py`, tests and scripts are not included in this upload; treat all implementation details as documented claims until the source is supplied and tests are rerun. |
| `HANDOVER.md` | Describes a separate Next.js 16/Drizzle/PostgreSQL/Auth0 Production Readiness Console with many API modules, append-only evidence and internal operations features. No `src/`, schema, migrations or tests are attached, so features cannot be independently verified or assumed to be HGO/Agency OS. Review maker/checker separation, RLS/tenant scope, signing-key handling and production migration process before reuse. |
| `abos_executive_dashboard.json` | Grafana dashboard SQL for agent runs/cost/latency, pipeline stage latency and deal KPIs. Treat as internal telemetry only. Visible queries do not show tenant/product or time-range filters, and currency labels use USD; correct and restrict before use in a multi-tenant or customer-facing environment. |
| `drizzle.config.json` | Points to a missing `src/db/schema.ts` and contains a hard-coded localhost PostgreSQL username/password default. Development-only; replace with managed secret/environment configuration and reviewed migrations before any deployment. |
| `eslint.config.mjs` | Flat ESLint config based on Next.js Core Web Vitals with generated-output ignores. Tooling only; it does not prove application lint passed. |
| `package.json` | Generic Next.js/PostgreSQL template manifest with Next/React/Drizzle/pg/JOSE and build/lint/typecheck scripts. It has no test script and is not enough to identify the owning application without the source tree. |
| `postcss.config.mjs` | Tailwind CSS 4 PostCSS plugin configuration. Styling toolchain only; not product architecture or evidence of a built UI. |
| `tsconfig.json` | Strict TypeScript config with `@/*` pointing into a missing `src/` tree. Useful candidate baseline; cannot typecheck without source. |

## A7. Two whole-chat summaries added after v1

| File | What it contains and how it is used |
|---|---|
| `Master_Design_Build_from_Whole_Chat_Summary 2.md` | 1,128-line “Master Design & Build Intelligence” (v1.0, 2026-09-24) for a digital-services agency starting from zero: website→CRM→lead/sales→project/retainer lifecycle, B2B/B2C funnels, page/design rules, CMS/content/analytics, proposed CRM object model and workflows, eight agent roles, tool/integration map, privacy/approval controls, vendor decisions and detailed backlog. This is the crucial source that expands Agency OS beyond delivery-only. Its Next.js 15/HubSpot/Payload/n8n/hosting choices, lead/financial/KPI targets, legal notes and schedules are proposals; reconcile against the later explicit Next.js 16/React 19/TypeScript strict/Tailwind v4/Bun defaults, live repo/account evidence and owner decisions. |
| `Master_Design_Build_from_Whole_Chat_Summary.md` | 716-line HGO synthesis generated from a 47-section chat (dated 2026-09-29): broad operations/PMS/guest CRM/direct-booking/marketing/AI vision, proposed plans/pricing, existing Hotel Fountain stack claims, a 10-phase roadmap, draft API-approval timeline and financial assumptions. It explains the ambition and long-term data moat but is older and more expansive than later HGO evidence-led files. Treat claimed live systems, APIs, prices, customer access, target dates and financial figures as unverified; use HGO v3/current gates and the audit/revision log for release scope. |

**Appendix A coverage:** the original 49-file audit categories (3 Agency/design + 8 HGO architecture + 11 HGO business/pilot + 9 data/security + 10 Hotel Fountain + 8 implementation/config) plus these 2 newly attached summaries = **51 unique uploaded files**.

## A8. Conversation-generated artifacts reviewed (not part of the 51 uploads)

- `/home/user/Final_Master_Agency_System_Build_Plan_Architecture.md` is v1, based on the original 49 uploads. This v2 supersedes it by adding the two whole-chat summaries, the agency acquisition/CRM lifecycle and the user-confirmed skill defaults.
- `/home/user/skill.md` (`agency-master-skill-v4.1`) is the execution contract for specification, tickets, TDD, delegation, MCP gates, review and truthful reporting. Its metadata fields require host registration; this workspace did not connect MCPs or register slash commands. It is policy text, not a running implementation.
- `/home/user/agency-master-skill-v4.1-ticket-plan.md` records the skill-authoring work, not application engineering tickets.
- None of these generated documents is evidence of a deployed app, active CRM/provider account, independent sub-agent review, MCP audit or production launch.

---

# Appendix B — Referenced artifacts not present in the upload

The following are referenced by the supplied files but were not present as uploaded files. Their existence/content/test results should not be assumed from link text alone:

- Agency application sources: no verified Agency marketing-site repo, CRM account/config, Agency OS `src/`, deployment or test suite is present; the supplied agency files are specifications and chat summaries. The status of the public agency site/CRM claimed in summaries must be inventoried, not assumed absent or live.
- HGO local application source: `app.py`, `tests/test_app.py`, `scripts/reset_demo.py`, `static/` assets, and app-local fixture/validator copy.
- HGO validator implementation and its unit tests: `Hotel_Growth_OS_Aggregate_CSV_Validator_v1.py` and `test_Hotel_Growth_OS_Aggregate_CSV_Validator_v1.py`.
- Production Readiness Console source: `src/`, `src/db/schema.ts`, route handlers, migration files, security/code-review scans, tests, CI config and environment template.
- Financial model workbooks: the prior financial workbook and the described 36-month Assumptions-Based Model 2.0.
- Business/pilot workbooks and forms referenced by the project indexes: intake/baseline, pipeline tracker, source prefill, proposal, delivery tracker, security evidence log, commercial calculator, receipt/validation log, baseline reconciliation, go-live acceptance, closeout, and similar `.xlsx`/`.docx` files.
- Original 47-section chat/notebook export and source references used to generate the early HGO syntheses.
- Current authorized system inventory, provider contracts/API documentation, production deployment evidence, actual source financials and any Hotel Fountain reply/authorization.

**Required action:** attach or provide read-only access to the relevant source repositories and files before any engineering audit, migration choice, claim verification, or production approval.

---

## Final directive

Build the **Agency System as an operating business loop**, not a pile of AI personas: truthful market presence → consented lead capture → one authoritative CRM → human-led sales → bounded delivery → support/retainer/referral learning. Make one lead-to-approved-preview path repeatable, inspectable, reversible and measurable before adding broad automation. Use the user-confirmed greenfield Agency stack, but verify the real repository and provider accounts before implementation.

Keep Hotel Growth OS as a separately governed product line with an aggregate-first initial release only if explicitly prioritized; never treat its broad historical vision or Hotel Fountain system claims as live permission. Keep Readiness/ABOS internal until source and controls are verified. Use `/home/user/skill.md` as the operator contract only after host registration and actual MCP setup.

```text
REVIEW THE PLAN BEFORE BUILD
→ RATIFY THE PRODUCT AND SOURCE OF TRUTH
→ BUILD ONE REVENUE-TO-DELIVERY SLICE
→ KEEP CRM, PROJECTS AND HOTEL DATA SEPARATE
→ KEEP HUMAN AUTHORITY AND CONSENT EXPLICIT
→ REQUIRE REAL TEST/MCP EVIDENCE FOR CODE RELEASE
→ DEPLOY WITH MONITORING AND ROLLBACK
→ MEASURE REAL VALUE, COST AND CUSTOMER OUTCOMES
→ PROMOTE ONLY VALIDATED, PERMITTED LEARNING
```
