# Tasks: React Role Scaffold

**Input**: Design documents from `/specs/001-react-role-scaffold/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Spec requires verifiable isolation — co-located unit tests, `tests/contract/`, per-role Playwright (**first visit** + toggle + **reload** per SC-012/SC-013; **use-system** per SC-017), host **empty/invalid remote URL** fallback (SC-004), **two-workspace compose smoke** (FR-023), and **WCAG 2.2 AA CI** (FR-026).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- One application at repository-root `src/` (canonical layout)
- Templates mirror `src/` under `templates/role-assets/demo/` and `templates/role-assets/host/`
- Symmetric prune/restore via `scripts/init.mjs` (never delete templates)
- `./Demo` public prop: **`embedded?: boolean`** (host passes `embedded={true}`)
- When `embedded={true}`, **Demo module** suppresses document PWA/theme; remote bootstrap ThemeProvider/`registerPwa` are **standalone-entry only**
- Unit tests co-located; `src/test/` setup; `tests/contract/` + `tests/integration/`
- No third-party component library; tokens in `src/styles/tokens.css`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tooling skeleton

- [x] T001 Create canonical directory tree per plan (`src/app`, `src/features`, `src/pages`, `src/layouts`, `src/components`, `src/core`, `src/services`, `src/styles`, `src/test`, `public/icons`, `scripts`, `templates/role-assets/demo`, `templates/role-assets/host`, `tests/contract`, `tests/integration`)
- [x] T002 Initialize `package.json` with React 19, React DOM, React Router, TypeScript 5.x, Webpack 5, Module Federation plugin, Workbox webpack plugin, Jest, React Testing Library, Playwright, `@axe-core/playwright` (or equivalent), sass loader, and scripts (`init`, `start`, `build`, `test`, `test:e2e`, `test:compose`, `test:a11y`)
- [x] T003 [P] Add `tsconfig.json` and `tsconfig.node.json` for app + tooling
- [x] T004 [P] Add base `webpack.config.js` (entry `src/main.tsx`, HTML plugin, CSS/SCSS loaders, devServer) with role-conditioned MF hooks stubbed
- [x] T005 [P] Add `jest.config.js`, `src/test/setup.ts`, and `playwright.config.ts` (per-role + compose + a11y projects/targets)
- [x] T006 [P] Add `.gitignore`, `public/index.html`, and CI workflow stub under `.github/workflows/ci.yml` (or equivalent) with placeholders for `test`, `test:e2e`, `test:compose`, `test:a11y`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared app shell, theming (incl. use-system), connectivity, PWA, and init CLI skeleton with symmetric prune/restore helpers

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement MF-safe `src/main.tsx` (`import('./bootstrap')`) and `src/bootstrap.tsx` (`createRoot` + providers mount)
- [x] T008 [P] Add design tokens in `src/styles/tokens.css` (`:root` light + `[data-theme="dark"]`) and base styles in `src/styles/global.scss`
- [x] T009 [P] Implement theme types/constants in `src/core/types/theme.ts` and `src/core/constants/theme.ts` (storage key, `light`|`dark`)
- [x] T010 Implement `ThemeProvider` in `src/app/providers/ThemeProvider.tsx` for **standalone/host (and remote-standalone) entry** only (first visit: `prefers-color-scheme` → `light`; toggle persists; **“Use system theme”** clears) — not the federated suppression path
- [x] T011 [P] Implement `ThemeToggle` in `src/components/ThemeToggle/ThemeToggle.tsx`, `index.tsx`, `ThemeToggle.module.scss`, `types.ts` (light/dark + “Use system theme” control)
- [x] T012 [P] Implement `useOnlineStatus` in `src/core/hooks/useOnlineStatus.ts` and `ConnectionRequired` in `src/components/ConnectionRequired/ConnectionRequired.tsx` (message conveys "internet connection required")
- [x] T013 [P] Implement shared `Button` in `src/components/Button/Button.tsx`, `index.tsx`, `Button.module.scss`, `types.ts`
- [x] T014 Implement `MainLayout` in `src/layouts/MainLayout/MainLayout.tsx` (responsive chrome; hosts theme controls + connection banner slot)
- [x] T015 Wire provider composition in `src/app/providers/AppProviders.tsx` and `src/app/App.tsx` with React Router outlet
- [x] T016 [P] Add PWA assets `public/manifest.webmanifest` and icons under `public/icons/`
- [x] T017 Configure Workbox via `workbox-webpack-plugin` in `webpack.config.js` and entry registration in `src/app/providers/registerPwa.ts` for **standalone/host/remote-standalone entry** (federated Demo path does not use this as suppression)
- [x] T018 Implement init CLI skeleton in `scripts/init.mjs` per `contracts/init-cli.md` (require `--role`; refuse without `--force` when `starter.role.json` exists; write schema-compatible metadata; patch README; shared helpers for straight-copy restore mirroring `src/` paths and never deleting `templates/role-assets/*`; role-specific prune/restore branches completed in US1–US3)
- [x] T019 Teach `webpack.config.js` to read `starter.role.json` and select MF `exposes`/`remotes`/`shared` (`react`/`react-dom` singleton) for the active role
- [x] T020 Author root `README.md` with role placeholder, local start instructions, `./Demo` rename + `embedded?: boolean` guidance stub, contract version stub, theming/PWA ownership, symmetric templates, compose/a11y commands, deferred published package note, and no third-party UI kit

**Checkpoint**: Foundation ready — role-specific stories can proceed

---

## Phase 3: User Story 1 - Scaffold a standalone app (Priority: P1) 🎯 MVP

**Goal**: `init --role=standalone` yields a runnable single-app repo with demo home, PWA, theme (first visit + reload + use-system), offline banner; no live host-only assets; demo templates seeded.

**Independent Test**: `npm run init -- --role=standalone`, `npm start`; verify home at phone-width, first-visit theme, toggle/`data-theme`, reload persistence, “Use system theme”, offline message, no live `HostHomePage`, and `starter.role.json` + README say `standalone`.

### Tests for User Story 1

- [x] T021 [P] [US1] Add co-located unit tests `src/components/ThemeToggle/ThemeToggle.test.tsx` and `src/app/providers/ThemeProvider.test.tsx` (first visit, persist, “Use system theme” clear)
- [x] T022 [P] [US1] Add Playwright smoke `tests/integration/standalone.spec.ts` (viewport ~375px, offline banner, **first visit with cleared storage → system/`light`**, theme toggle/`data-theme`, **toggle → reload → same `data-theme`**, “Use system theme”)

### Implementation for User Story 1

- [x] T023 [US1] Implement sample feature module in `src/features/demo/` (`index.ts`, `types/` including optional **`embedded?: boolean`**, presentational demo using tokens — when `embedded={true}` Demo MUST NOT apply document `data-theme` or register competing SW)
- [x] T024 [US1] Implement `src/pages/HomePage/HomePage.tsx` composing demo feature (without `embedded`) + `MainLayout`
- [x] T025 [US1] Seed pristine copies under `templates/role-assets/demo/` mirroring `features/demo/` + `pages/HomePage/` (FR-025)
- [x] T026 [US1] Add standalone routes in `src/app/routes/standaloneRoutes.tsx` and select them from `src/app/App.tsx` when role is `standalone`
- [x] T027 [US1] Ensure standalone Webpack path in `webpack.config.js` omits `remotes`/`exposes` while keeping PWA + shared app entry
- [x] T028 [US1] Complete `scripts/init.mjs` **standalone branch only** (extends T018: metadata `standalone`; prune live host-only assets; restore demo+HomePage from `templates/role-assets/demo/` if missing; update README)
- [x] T029 [US1] Enable ThemeProvider + `registerPwa` for standalone entry in `src/app/providers/AppProviders.tsx` / `registerPwa.ts`

**Checkpoint**: Standalone scaffold is fully functional and independently verifiable (MVP)

---

## Phase 4: User Story 2 - Scaffold a host app (Priority: P2)

**Goal**: `init --role=host` prunes live demo+HomePage, restores host assets from templates, yields host with `HostHomePage` + one `./Demo` slot (`embedded={true}`) + fallback for unreachable **and** empty/invalid remote URL; host-owned PWA + document theme.

**Independent Test**: `npm run init -- --role=host --force`; confirm live demo+HomePage absent, host templates restored; start with remote unreachable **and** empty/invalid URL → `RemoteFallback`; host theme first visit + reload persistence.

### Tests for User Story 2

- [x] T030 [P] [US2] Add Playwright host smoke `tests/integration/host.spec.ts` (fallback when remote unreachable; fallback when **empty/invalid remote URL** or missing remotes map entry; host theme **first visit** + toggle/`data-theme` + **toggle → reload → same `data-theme`** + use-system; viewport; offline banner)
- [x] T031 [P] [US2] Add contract test `tests/contract/init-host-prune.test.mjs` asserting host init deletes live `src/features/demo` and `src/pages/HomePage`, restores host assets from `templates/role-assets/host/`, and does **not** delete either templates bucket

### Implementation for User Story 2

- [x] T032 [US2] Add host remote location config in `src/core/constants/remotes.ts` (one sample slot targeting `./Demo` with placeholder URL; treat empty/invalid as fallback trigger)
- [x] T033 [P] [US2] Implement `RemoteFallback` in `src/components/RemoteFallback/RemoteFallback.tsx`, `index.tsx`, `RemoteFallback.module.scss`, `types.ts`
- [x] T034 [US2] Implement host remote loader adapter in `src/app/remotes/loadDemoRemote.tsx` (MF remote load; pass **`embedded={true}`** to `./Demo`; on missing/unreachable/empty/invalid config render `RemoteFallback`)
- [x] T035 [US2] Implement `src/pages/HostHomePage/HostHomePage.tsx` (host chrome + one `./Demo` slot + fallback; no import of `features/demo`)
- [x] T036 [US2] Add host routes in `src/app/routes/hostRoutes.tsx` and select them from `src/app/App.tsx` when role is `host`
- [x] T037 [US2] Configure Webpack `remotes` map for host role in `webpack.config.js` (placeholder remote URL; `shared` singletons; no `exposes` of demo)
- [x] T038 [US2] Seed pristine copies under `templates/role-assets/host/` mirroring `pages/HostHomePage/`, `app/remotes/loadDemoRemote.tsx`, and `app/routes/hostRoutes.tsx`
- [x] T039 [US2] Complete `scripts/init.mjs` **host branch only** (extends T018: prune live demo+HomePage; restore host assets from `templates/role-assets/host/`; write metadata `host`; update README)
- [x] T040 [US2] Ensure host entry registers PWA + ThemeProvider document ownership in `registerPwa.ts` / `ThemeProvider.tsx` / `AppProviders.tsx`

**Checkpoint**: Host scaffold works alone with fallbacks (unreachable + empty/invalid); demo+HomePage pruned; host assets from templates

---

## Phase 5: User Story 3 - Scaffold a remote app (Priority: P3)

**Goal**: `init --role=remote` yields dual-mode app: standalone demo + federated `./Demo` with `embedded?: boolean` + `CONTRACT_VERSION = '1.0.0'`; prune host-only assets; restore demo from templates; PWA/theme via standalone entry only.

**Independent Test**: `init --role=remote`; standalone demo + PWA + theme first visit/reload; confirm `./Demo` types + `embedded?: boolean` + `1.0.0`; after host→remote `--force`, demo restored and host-only live assets absent.

### Tests for User Story 3

- [x] T041 [P] [US3] Add Playwright remote-standalone smoke `tests/integration/remote-standalone.spec.ts` (**first visit with cleared storage → system/`light`**, theme toggle/`data-theme`, **toggle → reload → same `data-theme`**, use-system, viewport, offline banner, PWA artifacts)
- [x] T042 [P] [US3] Add contract tests `tests/contract/remote-demo-expose.test.mjs` (Webpack exposes `./Demo`; public types include **`embedded?: boolean`** + `1.0.0` exported/documented) and `tests/contract/init-restore-from-templates.test.mjs` (host then `--force --role=remote|standalone` restores demo from templates and prunes host-only live assets; `--force --role=host` restores host templates)

### Implementation for User Story 3

- [x] T043 [US3] Finalize `src/features/demo/index.ts` as sole public API for standalone + MF expose; export public props/types including **`embedded?: boolean`** and `CONTRACT_VERSION = '1.0.0'`; when `embedded={true}` Demo suppresses document theme/SW takeover
- [x] T044 [US3] Document `./Demo` typed API, `embedded?: boolean`, contract version `1.0.0`, Demo-module suppression vs standalone-entry providers, and deferred published package note in `README.md`; align with `specs/001-react-role-scaffold/contracts/remote-demo.md`
- [x] T045 [US3] Configure Webpack `exposes: { './Demo': './src/features/demo' }` and singleton `shared` for remote role in `webpack.config.js`
- [x] T046 [US3] Wire remote standalone routes to reuse `HomePage` / demo (without `embedded`) in `src/app/routes/remoteRoutes.tsx` and `src/app/App.tsx`
- [x] T047 [US3] Ensure remote **standalone entry** mounts ThemeProvider + `registerPwa` in `AppProviders.tsx` / `registerPwa.ts`; confirm federated path relies on Demo `embedded={true}` only (no globals; bootstrap providers are not the federated suppression mechanism)
- [x] T048 [US3] Complete `scripts/init.mjs` **remote branch only** (extends T018: metadata `remote`; prune host-only live assets; copy restore from `templates/role-assets/demo/`; README documents dual-mode + rename)

**Checkpoint**: Remote standalone works; typed expose + `embedded?: boolean` documented; template restore verified; Demo-module suppression in place

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Compose harness (two temp workspaces), WCAG 2.2 AA CI, remaining unit/contract coverage, docs, quickstart V1–V7

- [x] T049 [P] Add co-located unit tests `src/components/Button/Button.test.tsx`, `src/components/ConnectionRequired/ConnectionRequired.test.tsx`, `src/components/RemoteFallback/RemoteFallback.test.tsx`, `src/features/demo/Demo.test.tsx` (assert `embedded={true}` does not apply document `data-theme` / competing SW hooks)
- [x] T050 [P] Add contract tests in `tests/contract/init-cli.test.mjs` (missing/invalid `--role`; refuse without `--force`; success write of `starter.role.json`)
- [x] T051 Implement compose harness in `scripts/compose-harness.mjs` that creates **two temporary workspaces** (copy/clone), runs `init --role=host` and `init --role=remote`, starts both, then exits ready for Playwright (wire `npm run test:compose`)
- [x] T052 Add Playwright compose smoke `tests/integration/compose.spec.ts` asserting host-owned PWA install/offline UX and document `data-theme` with no remote takeover when Demo is mounted with `embedded={true}` (SC-009/SC-014/SC-015/SC-019)
- [x] T053 [P] Add WCAG 2.2 AA audit specs under `tests/integration/a11y.spec.ts` (axe or equivalent against primary demo routes for standalone, host, and remote-standalone) and wire `npm run test:a11y` + CI job to **fail on AA violations** per `contracts/a11y-wcag.md` (FR-026 / SC-020)
- [x] T054 Verify primary flows at phone-width (~375px) across roles and note pass in `README.md`
- [x] T055 [P] Confirm PWA baseline artifacts present (`public/manifest.webmanifest`, `public/icons/`, Workbox output) for each role path
- [x] T056 Run full `specs/001-react-role-scaffold/quickstart.md` validation (V1–V7) and fix gaps
- [x] T057 [P] Documentation pass: `README.md` covers init flags, `starter.role.json`, symmetric prune/restore (`demo/` + `host/` templates), `./Demo` types/`embedded?: boolean`/version/rename, Demo-module vs standalone-entry providers, theming/PWA ownership, `test:compose`, `test:a11y`, deferred published package + aspirational ~2s notes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — MVP; seeds `templates/role-assets/demo/`
- **User Story 2 (Phase 4)**: Depends on Foundational; prefer US1 → US2 when solo; seeds `templates/role-assets/host/`
- **User Story 3 (Phase 5)**: Depends on Foundational; reuses `features/demo` / demo templates from US1
- **Polish (Phase 6)**: Compose (T051–T052) after US2+US3; a11y (T053) after primary routes exist

### User Story Dependencies

- **US1 (P1)**: After Phase 2 only
- **US2 (P2)**: After Phase 2; prune/restore assumes demo/host template paths
- **US3 (P3)**: After Phase 2; reuses `features/demo` from US1

### Parallel Opportunities

- Phase 1: T003–T006 after T002
- Phase 2: T008–T009, T011–T013, T016 in parallel
- Phase 3: T021–T022 once ThemeProvider/ThemeToggle exist; T023–T024 parallel before T025
- Phase 4: T030–T031, T033 parallel with T032
- Phase 5: T041–T042 parallel; T043–T044 parallel with T045
- Phase 6: T049–T050, T053, T055, T057 in parallel after implementation stabilizes; T051–T052 after US2+US3

---

## Parallel Example: User Story 1

```bash
Task: "T023 features/demo with embedded?: boolean"
Task: "T024 HomePage"
# Then:
Task: "T025 seed templates/role-assets/demo/"
Task: "T021–T022 standalone unit + Playwright (first visit + reload)"
Task: "T026–T029 routes + webpack + init standalone branch + providers"
```

## Parallel Example: User Story 2

```bash
Task: "T033 RemoteFallback"
Task: "T032 remotes constants"
Task: "T030–T031 host Playwright (empty/invalid URL + reload) + prune contract"
# Then:
Task: "T034 loadDemoRemote (embedded={true})"
Task: "T035 HostHomePage"
Task: "T038 seed templates/role-assets/host/"
Task: "T039 init host branch"
```

## Parallel Example: User Story 3

```bash
Task: "T043–T044 embedded?: boolean + CONTRACT_VERSION + README"
Task: "T041–T042 remote Playwright (first visit + reload) + expose/restore contracts"
Task: "T045 webpack exposes ./Demo"
Task: "T047 standalone-entry providers vs Demo embedded suppression"
Task: "T048 init remote branch"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 standalone (+ demo templates seed)
4. **STOP and VALIDATE** via quickstart V1 (+ V4 subset + standalone theme first-visit/reload smoke)
5. Demo/MVP ready

### Incremental Delivery

1. Setup + Foundational → shared starter ready
2. US1 standalone → MVP (+ demo templates)
3. US2 host (prune/restore; `embedded={true}`; empty/invalid fallback) → host
4. US3 remote (typed `./Demo` + Demo-module suppression + template restore) → dual-mode
5. Polish → compose (two workspaces), WCAG AA CI, V1–V7

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Then:
   - Dev A: US1 (`features/demo` + demo templates)
   - Dev B: US2 host adapters + host templates + prune
   - Dev C: US3 expose/guards/restore after T023/T025
3. Shared polish: compose harness + a11y CI

---

## Notes

- [P] = different files, no incomplete-task dependencies
- [USn] required on user-story phase tasks only
- T018 = init skeleton + shared helpers; T028/T039/T048 = role-branch deltas only (avoid rewriting full init thrice)
- Prefer `npm run init -- --role=…` / `--force` per `contracts/init-cli.md`
- Host MUST leave neither live `src/features/demo` nor `src/pages/HomePage` after host init
- Standalone/remote MUST leave no live host-only sample assets after init
- Restore MUST straight-copy from mirrored templates
- Federated suppression: **`embedded={true}` on Demo module only** — no undocumented globals
- Per-role smoke MUST include SC-013 first visit + reload persistence
- Host smoke MUST include empty/invalid remote URL → `RemoteFallback`
- Published contract package is deferred (Complexity Tracking); ~2s interactive aspirational only
- Commit after each task or logical group
- Stop at checkpoints to validate independently
