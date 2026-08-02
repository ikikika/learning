# Implementation Plan: Hybrid Role Scaffold

**Branch**: `005-hybrid-role-scaffold` | **Date**: 2026-08-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-hybrid-role-scaffold/spec.md`

## Summary

Add a fourth repository role **`hybrid`**: one clone that both **exposes** a stable federated entry to a parent shell (host) and **consumes** child remotes via the same remotes map / `add-remote` path as host. Hybrid own-app entry runs standalone with distinct chrome (nav+panel like host, different tokens/branding + one layout cue). When the shell mounts the hybrid with `embedded={true}`, suppress the hybrid theme toggle and document PWA/theme takeover while keeping hybrid chrome inside the mount boundary; pass `embedded={true}` to child remotes. Init prints a host `add-remote` snippet (remote DX). CI requires hybrid standalone + pair compose (hybrid+leaf, shell+hybrid); full three-tier CI deferred. Must not regress standalone | host | remote.

## Technical Context

**Language/Version**: TypeScript 5.x + React 19; Node ≥20 for CLI scripts (ESM `.mjs` + shared CJS helpers)

**Primary Dependencies**: React, React DOM, React Router, Webpack Module Federation (existing). No new runtime packages for v1.

**Storage**: Repo files only — `starter.role.json` (`role`, `expose`, `remotes[]`, optional `remoteProps`), `.env` (`PORT_HYBRID`, child `*_URL`), generated `loaders.generated.ts`. No database.

**Testing**: Node contract tests (init hybrid role/snippet/metadata; add-remote host|hybrid gate); Playwright hybrid standalone smoke; pair compose harnesses (hybrid+leaf, shell+hybrid); existing standalone/host/remote smokes must stay green. Jest/RTL for hybrid chrome / embed toggle gating as needed.

**Target Platform**: Evergreen browsers + Node for CLI/CI; phone-width hybrid chrome

**Project Type**: Single-app React starter; this feature scaffolds **hybrid** while extending shared tooling so **host** can register a hybrid and **hybrid** can register leaf remotes. Shared tree must keep standalone/host/remote intact.

**Performance Goals**: Unchanged (~2s interactive aspirational); singleton `react`/`react-dom`/`react-router` across shell↔hybrid↔leaf; no duplicate framework bundles under nesting

**Constraints**: MF only; singleton shared peers; no secrets in client; URLs via config; one role per clone; `embedded` authoritative on mounts; leaf dual-mode unchanged beyond embed contracts; three-tier CI not a v1 hard gate; published npm contract packages remain deferred (in-repo typed contract + version)

**Scale/Scope**: **Role: hybrid** (scaffold + tooling). In: init `--role=hybrid`, `PORT_HYBRID`, webpack remotes+exposes, `hybridRoutes` + `demoHybrid` chrome, `FederatedHybridApp` (or equivalent expose), add-remote for host|hybrid, pair compose tests, README/AGENTS. Out: auth; monorepo packaging; leaf remote UX redesign; hybrid-as-child sample harness; three-process CI gate; role-sniffing leaf-only enforcement on add-remote.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Derived from `.specify/memory/constitution.md` (Starter MFE Constitution v2.2+).

- **Repository Role & Portability**: PASS — Explicit `hybrid`; own-app + federated expose + child remotes via config; edge adapters only (webpack, routes, federated entry, add-remote).
- **Shared Runtime Singletons**: PASS — Reuse existing MF `shared` singletons for `react` / `react-dom` / `react-router`; hybrid does not bundle a second copy.
- **Explicit Host/Remote Contracts**: PASS — Hybrid public entry typed (`embedded`, optional display props, `CONTRACT_VERSION`); degrade-safe fallbacks at shell and hybrid; no undocumented globals. See `contracts/`.
- **Composition-First UI**: PASS — Hybrid chrome composes nav + panel + `LoadRemote`; embed gating via `embedded` prop; no Atomic Design taxonomy.
- **Responsive Experience & PWA Readiness**: PASS — Hybrid own-app ships PWA + theme; when embedded, shell owns document PWA/theme; hybrid toggle suppressed; in-boundary tokens/chrome remain; phone-width smoke.
- **Multi-Repository Topology**: PASS — One app at root `src/`; children/parent are other clones via config.
- **Application Layout**: PASS — `features/demoHybrid`, `app/routes/hybridRoutes.tsx`, federated entry under `app/`; CLI under `scripts/`.
- **Verifiable Isolation**: PASS — Contract tests without live MF; hybrid standalone smoke; pair compose; non-regression for other roles. Three-tier CI deferred with tracked follow-up (spec FR-016).
- **Complexity Tracking**: Published npm contract packages remain deferred (same exception posture as prior role work)—in-repo typed hybrid entry + version satisfies Principle III for v1.

## Project Structure

### Documentation (this feature)

```text
specs/005-hybrid-role-scaffold/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
└── tasks.md             # /speckit-tasks (not this command)
```

### Source Code (repository root)

```text
scripts/
├── init.mjs                 # EXTEND — ALLOWED_ROLES += hybrid; metadata expose+remotes;
│                            #   print host add-remote snippet; optional --remote like host
├── add-remote.mjs           # EXTEND — allow role host | hybrid (refuse standalone|remote)
├── remotes-config.cjs       # EXTEND — shared writes; hybrid-safe helpers if needed
├── load-env.cjs             # EXTEND — PORT_HYBRID + getPortForRole
├── app-name.cjs             # READ/EXTEND — snippet helpers reuse for hybrid
├── compose-harness.mjs      # EXTEND or sibling — shell+hybrid and hybrid+leaf pairs
└── run-e2e.mjs              # EXTEND — ROLE_PORTS hybrid

config/webpack.common.js     # EXTEND — hybrid: remotes map + exposes; @active-routes →
                             #   hybridRoutes; remoteEntries + REMOTE_PROPS when hybrid;
                             #   expose → FederatedHybridApp

.env.example                 # EXTEND — PORT_HYBRID

src/core/constants/role.ts   # EXTEND — AppRole includes hybrid
src/types/shims.d.ts         # EXTEND — role union / defines if needed

src/app/routes/hybridRoutes.tsx          # NEW — own-app routes + demoHybrid
src/app/FederatedHybridApp.tsx           # NEW — MF expose; owns embed ThemeToggle suppression
src/features/demoHybrid/                 # NEW — hybrid home/nav/panel; owns
                                         #   data-testid="demo-hybrid-header-band"
src/app/providers/…                      # TOUCH only if hybrid role needs provider gating
src/app/remotes/loadRemote.tsx           # TOUCH — messaging host|hybrid; keep embedded:true
src/core/constants/remotes.ts            # TOUCH — comments / wording for hybrid composer

tests/contract/init-cli.test.mjs         # EXTEND — hybrid role, PORT_HYBRID, add-remote snippet
tests/contract/add-remote-cli.test.mjs   # EXTEND — allow hybrid; refuse standalone|remote
tests/contract/add-remote-writes.test.mjs# EXTEND — hybrid registration writes
tests/contract/hybrid-expose.test.mjs    # NEW — expose wiring + contract version/embedded
tests/integration/hybrid.spec.ts         # NEW — standalone hybrid smoke (theme, phone-width, PWA)
tests/integration/compose-shell-hybrid…  # NEW — shell+hybrid pair (via test:compose)
tests/integration/compose-hybrid-leaf…   # NEW — hybrid+leaf pair (via test:compose)
tests/integration/a11y.spec.ts           # EXTEND — hybrid primary route AA
scripts/compose-harness.mjs              # EXTEND — invoke both pair suites from test:compose
scripts/run-a11y.mjs                     # EXTEND — hybrid role coverage if needed

README.md / AGENTS.md                    # EXTEND — hybrid topology, init snippet, add-remote
specs/001-react-role-scaffold/contracts/init-cli.md  # EXTEND additively for hybrid

# External versioned packages: N/A (deferred; in-repo contracts only)
```

**Repository Role**: Hybrid (scaffold target). Shared starter also contains host/remote/standalone assets that must not regress. Host remains the outermost shell that can `add-remote` a hybrid.

**Structure Decision**: Treat hybrid as **host ∩ remote** at the edges: remotes/loaders/add-remote/`__STARTER_REMOTE_*` like host; `expose` + printed add-remote snippet like remote; new `hybridRoutes` + `demoHybrid` (owns `demo-hybrid-header-band`) + `FederatedHybridApp` (owns embed ThemeToggle suppression) so App.tsx / remote/host route tables stay behaviorally unchanged for other roles. Default hybrid init: empty `remotes[]`. Default port: `PORT_HYBRID` (recommend **3003**). Pair compose suites MUST run via `npm run test:compose`. Shared packages: N/A.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Published npm contract package deferred (Principle III packaging) | Same v1 posture as prior role features; in-repo typed hybrid entry + version is enough | Publishing packages now expands scope beyond hybrid scaffold |
| Full shell→hybrid→leaf CI compose deferred (Principle V multi-mode) | Spec FR-016 / clarify: pair covers required; three-tier optional | Mandating 3-process CI in v1 triples harness cost without unique contract coverage beyond pairs |
