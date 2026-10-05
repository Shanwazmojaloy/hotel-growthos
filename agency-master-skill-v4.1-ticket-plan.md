# Ticket Plan — `agency-master-skill-v4.1`

**Status:** Completed for the documentation deliverable. This plan records the work performed; it does not claim the skill has been installed, registered, or run in a target host.

| ID | Task | Target | Depends on | Acceptance / evidence | Status |
|---|---|---|---|---|---|
| TKT-001 | Inspect and reconcile the agency and HGO source summaries with the existing architecture decisions. | Source set; `skill.md` source hierarchy | — | Agency website/CRM workflow distinguished from Hotel Growth OS; older and unverified claims labeled as context, not live facts. | DONE |
| TKT-002 | Define the portable skill metadata, trigger mappings, host-loader caveat, and task/product contexts. | `skill.md` frontmatter; §0 | TKT-001 | Valid YAML structure; four requested intent-to-command mappings; no claim that metadata connects tools or creates commands. | DONE |
| TKT-003 | Specify preflight, greenfield stack defaults, MCP hard dependencies, and unavailable-tool behavior. | `skill.md` §1 | TKT-002 | Next.js 16/React 19/TypeScript strict/Tailwind v4/Bun and Vitest defaults; existing-stack preservation; MCP failures block verification rather than being simulated. | DONE |
| TKT-004 | Define spec → plan → build → review → ship lifecycle, task states, delegation, worktree fallback, and absolute TDD for code. | `skill.md` §2 | TKT-003 | Explicit gates, real-vs-simulated sub-agent distinction, RED/GREEN/REFACTOR, docs/config exemption with validation, release approvals. | DONE |
| TKT-005 | Add design, website/CRM, privacy, tenant, external-action and HGO-specific controls. | `skill.md` §§3–4 | TKT-001, TKT-004 | No invented claims/prices; consent/DND and human approval; separate agency-client and hotel scopes; aggregate-first HGO boundary. | DONE |
| TKT-006 | Add audit/evaluation requirements, escalation thresholds, anti-rationalization rules, and truthful completion report. | `skill.md` §§5–7 | TKT-003–005 | Missing MCP/test/agent/deployment evidence cannot be reported as passed; blocked states and checkpoint format defined. | DONE |
| TKT-007 | Validate final documentation and prepare concise handoff. | `skill.md`; this file | TKT-002–006 | Frontmatter parses as YAML (where parser is available); requested source context is reflected; no application code or external system action is claimed. | DONE |

## Release note

`skill.md` is the primary artifact. Install it only after mapping its custom frontmatter fields (`triggers`, `required_mcp`, `default_stack`) to the target host’s loader and configuring the declared MCP servers. The current workspace did not register slash commands or connect those servers.
