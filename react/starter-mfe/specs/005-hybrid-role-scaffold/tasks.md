# Tasks: Hybrid Role Scaffold

**Input**: Design documents from `/specs/005-hybrid-role-scaffold/`

**Prerequisites**: plan.md, spec.md (incl. clarifications), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Required by FR-016 / SC-002–SC-008 — contract, hybrid standalone smoke, and pair compose included.

**Organization**: By user story (US1–US4). Setup → Foundational → stories in priority order → Polish.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (different files, no incomplete deps)
- **[Story]**: `[US1]`…`[US4]` on story-phase tasks only
- Exact file paths in every description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Env/schema/docs surfaces that all hybrid work depends on

- [X] T001 Add blank `PORT_HYBRID=` to `.env.example` and document hybrid port alongside other `PORT_*` keys
- [X] T002 [P] Extend `role` enum with `hybrid` in `specs/001-react-role-scaffold/contracts/role-metadata.schema.json` (hybrid shape: `expose` + `remotes[]` per `specs/005-hybrid-role-scaffold/data-model.md`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Role typing, port resolution, webpack hybrid branch — MUST complete before story UI/CLI paths

**⚠️ CRITICAL**: Blocks all user stories

- [X] T003 Extend `AppRole` / role helpers to include `hybrid` in `src/core/constants/role.ts` and `src/types/shims.d.ts` (and any `__STARTER_ROLE__` typings)
- [X] T004 [P] Add `PORT_HYBRID` to `portEnvKeyForRole` / `getPortForRole` in `scripts/load-env.cjs` and the matching helper in `scripts/init.mjs` (default e2e port **3003**)
- [X] T005 Extend `federationOptions` and `@active-routes` in `config/webpack.common.js` so `hybrid` gets **both** remotes map (like host) and expose → `./src/app/FederatedHybridApp.tsx` (like remote); bake `remoteEntries` + `__STARTER_REMOTE_PROPS__` when role is `host` **or** `hybrid`
- [X] T006 [P] Add hybrid to `ROLE_PORTS` / role runners in `scripts/run-e2e.mjs` (port 3003) without breaking existing three-role runs
- [X] T007 [P] Touch composer wording only if needed in `src/app/remotes/loadRemote.tsx` and `src/core/constants/remotes.ts` so host|hybrid messaging stays accurate; keep `embedded: true` authoritative

**Checkpoint**: Foundation ready — hybrid role recognized by webpack/env/types

---

## Phase 3: User Story 1 — Initialize hybrid shell for local development (Priority: P1) 🎯 MVP

**Goal**: `--role=hybrid` init writes metadata + `PORT_HYBRID`, prints host `add-remote` snippet, and hybrid own-app runs with distinct chrome, theme, PWA, phone-width UX (empty remotes OK)

**Independent Test**: `npm run init -- --role=hybrid --port=3003 --name=demo-hybrid` → snippet on stdout → `npm start` → hybrid chrome distinct from host; theme toggle; ~375px OK; empty child state usable

### Tests for User Story 1

- [X] T008 [P] [US1] Extend `tests/contract/init-cli.test.mjs` for hybrid: allowed role, `PORT_HYBRID`, metadata `expose` + `remotes: []`, and stdout host `add-remote` snippet shape (per `specs/005-hybrid-role-scaffold/contracts/hybrid-init-cli.md`)
- [X] T009 [P] [US1] Add Playwright smoke `tests/integration/hybrid.spec.ts`: phone-width; theme first-visit/toggle/reload (same as other own-app roles); **same** PWA/offline banner assertions as other own-app roles; empty hybrid chrome; assert `data-testid="demo-hybrid-header-band"` present (and absent on host sample expectations where compared)

### Implementation for User Story 1

- [X] T010 [US1] Extend `scripts/init.mjs`: `ALLOWED_ROLES` += `hybrid`; interactive prompt includes hybrid; `--remote`/`--remote-name` allowed for host|hybrid; write hybrid metadata (`expose` + `remotes`); regenerate loaders; print host `add-remote` snippet via existing `hostRemoteSnippetForApp` (or equivalent)
- [X] T011 [P] [US1] Create `src/features/demoHybrid/` (public `index.ts`, home/nav/panel from `REMOTE_SLOTS`, empty state, fallback slot UI) with distinct tokens/branding vs `src/features/demoHost/` and header band `data-testid="demo-hybrid-header-band"`
- [X] T012 [P] [US1] Add `src/app/routes/hybridRoutes.tsx` wiring own-app layout + `demoHybrid` (nav+panel composition like host; include theme toggle on own-app)
- [X] T013 [US1] Add `src/app/FederatedHybridApp.tsx` expose stub (typed `embedded?`, optional display props, `CONTRACT_VERSION = '1.0.0'`) that renders hybrid chrome for MF; own-app path remains `App.tsx` + `hybridRoutes` (full embed toggle suppression finalized in US3 T024)
- [X] T014 [US1] Ensure hybrid own-app providers/PWA path works for role `hybrid` (bootstrap / `AppProviders` / layout) without changing standalone/host/remote route tables’ behavior

**Checkpoint**: US1 complete — MVP hybrid init + standalone chrome

---

## Phase 4: User Story 2 — Add and load leaf module remotes from hybrid (Priority: P2)

**Goal**: `add-remote` works on hybrid; children appear in hybrid nav; `embedded={true}` passed to leaves; missing leaf shows fallback; standalone/remote still refused; host unchanged

**Independent Test**: Hybrid clone → `npm run add-remote` for a leaf → restart → select child in nav → mount inside hybrid chrome; stop leaf → fallback; hybrid nav still works

### Tests for User Story 2

- [X] T015 [P] [US2] Extend `tests/contract/add-remote-cli.test.mjs`: allow `hybrid`; refuse `standalone`|`remote` with clear non-“host-only-only” error; host success path still passes (per `specs/005-hybrid-role-scaffold/contracts/add-remote-host-hybrid.md`)
- [X] T016 [P] [US2] Extend `tests/contract/add-remote-writes.test.mjs`: successful add on hybrid updates `remotes[]`, `.env`, and `src/app/remotes/loaders.generated.ts`
- [X] T017 [P] [US2] Add hybrid+leaf pair compose coverage in `tests/integration/compose-hybrid-leaf.spec.ts` **and wire it into** `scripts/compose-harness.mjs` / `npm run test:compose` (or a sibling script invoked by that entry): mount child with hybrid chrome; stop leaf → fallback within ~3s; hybrid interactive

### Implementation for User Story 2

- [X] T018 [US2] Update `scripts/add-remote.mjs` role gate to `host || hybrid`; keep validation/writes identical; no leaf-vs-hybrid role sniffing
- [X] T019 [US2] Wire `demoHybrid` / hybrid panel to reuse `LoadRemote` so children get `embedded={true}` and defined `RemoteFallback` (or hybrid-equivalent fallback) on failure
- [X] T020 [US2] Confirm init `--remote` on hybrid regenerates loaders consistently with add-remote (`scripts/init.mjs` / `scripts/remotes-config.cjs`)

**Checkpoint**: US2 complete — hybrid as composer

---

## Phase 5: User Story 3 — Shell loads hybrid as nested composee (Priority: P3)

**Goal**: Host can `add-remote` a hybrid expose; embed suppresses hybrid theme toggle; shell owns document theme/PWA; hybrid chrome visible in-boundary; hybrid-down → host fallback

**Independent Test**: Host + hybrid pair → select hybrid slot → shell theme ownership + no hybrid toggle + chrome in panel; stop hybrid → host fallback

### Tests for User Story 3

- [X] T021 [P] [US3] Add contract test `tests/contract/hybrid-expose.test.mjs`: webpack/metadata expose points at `FederatedHybridApp`; public types include `embedded?: boolean` + `CONTRACT_VERSION` (per `specs/005-hybrid-role-scaffold/contracts/hybrid-public-entry.md`)
- [X] T022 [P] [US3] Add shell+hybrid pair compose coverage in `tests/integration/compose-shell-hybrid.spec.ts` **and wire it into** `scripts/compose-harness.mjs` / `npm run test:compose` (or sibling invoked by that entry): `embedded={true}`, shell document theme ownership, hybrid theme toggle absent, `demo-hybrid-header-band` present in panel; stop hybrid → host fallback
- [X] T023 [P] [US3] Unit/component test for embed toggle gating in `src/app/FederatedHybridApp.tsx` or `src/features/demoHybrid/` (toggle absent when `embedded`)

### Implementation for User Story 3

- [X] T024 [US3] Finalize `src/app/FederatedHybridApp.tsx` embed behavior (suppress ThemeToggle when `embedded={true}`; keep in-boundary tokens/layout/nav/header band; no document PWA/theme registration on federated path)—completes US1 stub from T013
- [X] T025 [US3] Verify host `LoadRemote` + existing host chrome can register/load hybrid expose without host-only code changes beyond docs/tests (fix only if expose path or props merge needs a hybrid-safe tweak in `src/app/remotes/loadRemote.tsx`)

**Checkpoint**: US3 complete — hybrid as composee under shell

---

## Phase 6: User Story 4 — Preserve standalone, host, and remote (Priority: P4)

**Goal**: Existing roles and leaf dual-mode do not regress; one role per clone; hybrid-only surfaces not required for other roles

**Independent Test**: Re-run standalone, host, remote-standalone smokes + host add-remote contracts; all green

### Tests for User Story 4

- [X] T026 [P] [US4] Confirm existing `tests/integration/standalone.spec.ts`, `tests/integration/host.spec.ts`, `tests/integration/remote-standalone.spec.ts`, and host compose/`add-remote` contracts still pass (fix only regressions caused by hybrid shared helpers)
- [X] T027 [P] [US4] Extend `tests/contract/init-no-prune.test.mjs` (or equivalent) if needed so hybrid init still does not prune/restore `src/`

### Implementation for User Story 4

- [X] T028 [US4] Audit shared webpack/init/add-remote changes so standalone|host|remote branches remain behaviorally identical aside from intentional host|hybrid gate widening in `scripts/add-remote.mjs` and `config/webpack.common.js`
- [X] T029 [US4] Ensure leaf remote sample (`src/app/FederatedRemoteApp.tsx`, `src/features/demoRemote/`) changes only if required for embed-contract compatibility—no dual-mode UX redesign

**Checkpoint**: US4 complete — non-regression

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Docs, a11y, init-cli sync, deferred three-tier tracking

- [X] T030 [P] Update `README.md` roles table + init/add-remote docs for hybrid topology (shell → hybrid → leaf), printed host snippet, `PORT_HYBRID`, embed rules, `demo-hybrid-header-band`
- [X] T031 [P] Update `AGENTS.md` for hybrid role, add-remote on host|hybrid, and `features/demoHybrid` pointer
- [X] T032 Verify primary hybrid flows at phone-width in `tests/integration/hybrid.spec.ts` (no primary horizontal scroll)
- [X] T033 [P] Record deferred full shell→hybrid→leaf CI follow-up in `specs/005-hybrid-role-scaffold/plan.md` Complexity Tracking / README note (not a v1 hard gate)
- [X] T034 [P] Extend `tests/integration/a11y.spec.ts` and/or `scripts/run-a11y.mjs` so hybrid primary own-app route is covered by `npm run test:a11y` (WCAG 2.2 AA fail-on-violations)
- [X] T035 [P] Update `specs/001-react-role-scaffold/contracts/init-cli.md` additively for `--role=hybrid`, `PORT_HYBRID`, host|hybrid `--remote`, and printed add-remote snippet (companion remains `specs/005-hybrid-role-scaffold/contracts/hybrid-init-cli.md`)
- [X] T036 Confirm `npm run test:compose` runs both pair suites (hybrid+leaf and shell+hybrid) after T017/T022 wiring
- [X] T037 Run `specs/005-hybrid-role-scaffold/quickstart.md` validation scenarios V1–V5 (manual or automated equivalents)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Start immediately
- **Phase 2 (Foundational)**: After Setup — **BLOCKS** US1–US4
- **Phase 3 (US1)**: After Foundational — **MVP**
- **Phase 4 (US2)**: After US1 (needs hybrid chrome + init)
- **Phase 5 (US3)**: After US1 (needs `FederatedHybridApp`); can overlap late US2 once expose exists
- **Phase 6 (US4)**: After US2–US3 shared tooling lands (or continuous regression during implementation)
- **Phase 7 (Polish)**: After desired stories complete

### User Story Dependencies

- **US1 (P1)**: No dependency on US2–US4 — MVP
- **US2 (P2)**: Depends on US1 hybrid own-app + LoadRemote wiring
- **US3 (P3)**: Depends on US1 federated entry; host path mostly existing
- **US4 (P4)**: Cross-cutting verification after shared changes

### Parallel Opportunities

- T001 ∥ T002 (Setup)
- T004 ∥ T006 ∥ T007 after T003/T005 sequencing as noted
- Within US1: T008 ∥ T009 (tests); T011 ∥ T012 after T010 or in parallel with care
- Within US2: T015 ∥ T016 ∥ T017 (tests) before/alongside T018
- Within US3: T021 ∥ T022 ∥ T023
- Polish: T030 ∥ T031 ∥ T033

---

## Parallel Example: User Story 1

```bash
# After foundation:
Task: "T008 Extend tests/contract/init-cli.test.mjs for hybrid"
Task: "T009 Add tests/integration/hybrid.spec.ts"

# UI surfaces in parallel:
Task: "T011 Create src/features/demoHybrid/"
Task: "T012 Add src/app/routes/hybridRoutes.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1–2
2. Complete Phase 3 (US1)
3. **STOP and VALIDATE** via quickstart V1 + init contract + hybrid.spec
4. Demo: hybrid init + standalone chrome + printed add-remote snippet

### Incremental Delivery

1. US1 → hybrid local shell
2. US2 → hybrid composes leaves
3. US3 → shell embeds hybrid
4. US4 → regression gate
5. Polish → docs + deferred three-tier note

### Parallel Team Strategy

- Dev A: init/webpack/CLI (T003–T010, T018)
- Dev B: demoHybrid UI + routes + FederatedHybridApp (T011–T014, T024)
- Dev C: contracts + Playwright pair harnesses (T008–T009, T015–T017, T021–T022)

---

## Notes

- [P] = different files, no incomplete deps
- Do not implement full three-process CI in v1 (Complexity Tracking)
- add-remote does **not** refuse hybrid-as-child (clarify); sample docs stay leaf-focused
- Format validation: all tasks use `- [ ] Tnnn ...` with paths
