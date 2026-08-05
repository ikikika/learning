# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for this feature/repository. Examples below match the Starter MFE constitution;
  keep, narrow, or mark NEEDS CLARIFICATION as appropriate.
-->

**Language/Version**: TypeScript 5.x + React 18/19

**Primary Dependencies**: React, React DOM, React Router, Webpack Module
Federation; TanStack Query (optional); shared packages such as
`@scope/shared-ui`, `@scope/shared-config`, `@scope/remote-contracts` (as needed)

**Storage**: N/A for pure UI apps (or remote API / browser storage if in scope)

**Testing**: Jest + React Testing Library with unit/component tests co-located
beside source modules; Playwright for standalone/host smoke; root `tests/`
reserved for cross-cutting integration and remote contract suites

**Target Platform**: Modern evergreen browsers (SPA) including phone-width
viewports; PWA-capable (installable + offline app-shell baseline); Node for
build/CI only

**Project Type**: Single-app React repository — role is one of
`host` | `remote` | `standalone` | `hybrid` (multi-repo MFE topology)

**Performance Goals**: Keep interactive route usable under ~2s on broadband;
avoid duplicate `react`/`react-dom`; measure remote `remoteEntry` + chunk load
cost for federated surfaces; keep primary mobile flows usable without
horizontal scroll

**Constraints**: Webpack Module Federation only; singleton shared peers;
no secrets in client bundles; remote/hybrid URLs via config; canonical root
`src/` layout; remotes and hybrids must remain runnable standalone; UI MUST
be mobile-responsive; apps MUST ship PWA baseline (manifest, icons, service
worker / equivalent) with outermost-shell-owned install/offline UX when
federated; nested composition MUST degrade safely

**Scale/Scope**: Pick one role and replace with concrete paths for this plan:

- Standalone — e.g. `Role: standalone. In: features/auth, pages/LoginPage +
ProfilePage. Out: federation, other remotes.`
- Remote — e.g. `Role: remote (checkout). In: features/checkout, expose
./Checkout. Out: host chrome; other remotes.`
- Host — e.g. `Role: host. In: /checkout route + remote load/fallback config.
Out: checkout domain logic (owned by checkout remote).`
- Hybrid — e.g. `Role: hybrid (team shell). In: team layout/tokens/nav,
federated entry for parent, child remotes via add-remote. Out: parent
document PWA/theme when embedded; child remote domain logic.`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Derived from `.specify/memory/constitution.md` (Starter MFE Constitution v2.2+).

- **Repository Role & Portability**: Repository role is explicit (host,
  remote, standalone, or hybrid — exactly one). Remote/hybrid feature logic is
  usable in standalone and federated modes; host/hybrid/remote-only wiring is
  limited to edge adapters. Hybrid plans MUST cover parent expose, child
  remotes via config/add-remote, standalone team shell, and embed-mode
  `embedded={true}` (parent PWA/theme ownership; team chrome in mount boundary).
- **Shared Runtime Singletons**: Plan states how `react` / `react-dom` (and any
  new shared peers) are singleton-shared across host/hybrid/remotes; no
  duplicate framework bundles.
- **Explicit Host/Remote Contracts**: If federation is in scope, public remote
  or hybrid exports, versions/compatibility, and failure fallbacks are defined
  (see `contracts/` when applicable). Nested composition MUST degrade safely at
  every level. Shared contract package names and compatible versions are
  recorded. Prefer exposing `features/<name>` public entrypoints.
- **Composition-First UI**: Component APIs prefer composition over boolean-prop
  sprawl; presentational UI stays free of transport/host details; no Atomic
  Design folder taxonomy required.
- **Responsive Experience & PWA Readiness**: Primary flows are mobile-responsive;
  PWA baseline (manifest, icons, service worker / equivalent) is planned;
  federated apps prefer outermost-shell-owned install/offline UX; remotes and
  hybrids remain safe when embedded and PWA-capable in standalone mode.
- **Multi-Repository Topology**: This repository contains one app at root
  `src/`; it does not embed host/hybrid and remote implementations under
  `apps/`. Shared UI/config/contracts come from versioned packages, not copied
  folders.
- **Application Layout**: Root `src/` matches the canonical layout. No parallel
  `lib/` for helpers that belong in `core/`.
- **Verifiable Isolation**: Unit tests do not require a live host; contract or
  integration coverage exists for federation boundaries when in scope; modes
  in scope remain exercisable (or deferral is tracked)—including hybrid
  standalone, parent-embed, and child-remote paths when applicable.
- **Complexity Tracking**: Any MUST-principle exception is listed below with
  justification—otherwise the plan MUST NOT proceed.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED:
  - Keep the canonical root layout below and replace placeholders with concrete
    feature paths.
  - State this repository's single role: host, remote, standalone, or hybrid.
  - Do not introduce apps/host, apps/remote-*, or workspace packages/ wrappers.
  - Record external package names/versions for shared UI/config/contracts.
-->

```text
# Canonical Application Layout (one application per repository)
src/
├── main.tsx              # MF-safe async entry → import('./bootstrap')
├── bootstrap.tsx         # createRoot + top-level providers
├── app/                  # App shell, providers, routes
│   ├── App.tsx
│   ├── providers/
│   └── routes/
├── features/             # domain modules; each has public index.ts
│   └── [feature]/
│       ├── api/          # HTTP/RPC calls and query/mutation definitions
│       ├── hooks/        # feature-scoped React hooks
│       ├── services/     # domain logic / orchestration (not UI)
│       ├── types/        # feature-local TypeScript types and DTOs
│       └── index.ts      # public feature API (imports for app/pages/exposes)
├── pages/                # route-level screens
├── layouts/              # page chrome
├── components/           # shared UI; one folder per component (no ui/ taxonomy)
│   └── [Component]/
│       ├── index.tsx                # component export
│       ├── [Component].tsx          # implementation
│       ├── [Component].test.tsx     # co-located unit/component test
│       ├── [Component].module.scss  # styles (or co-located CSS)
│       └── types.ts                 # props / public types
├── core/                 # constants, hooks, types, utils (no parallel lib/)
├── services/             # app-wide infra only (e.g. httpClient.ts, logger.ts,
                            analytics.ts, localStorage.ts, realtimeClient.ts)
├── styles/               # tokens.css (CSS variables) + global styles; ThemeProvider
                            sets data-theme on documentElement when theming is in scope
└── test/                 # shared app test utils / setup only

tests/
├── integration/
└── contract/

# External versioned dependencies (not local workspace folders)
@scope/shared-ui
@scope/shared-config
@scope/remote-contracts
```

**Repository Role**: [host | remote | standalone | hybrid — choose exactly one]

**Structure Decision**: [Reference the concrete root `src/` paths used by this
feature. Co-locate unit/component tests beside the source module; reserve
`src/test/` for shared setup/utilities and root `tests/` for cross-cutting
integration/contract suites. Prefer CSS-variable tokens under `src/styles/` and
local components over a third-party UI kit unless justified; if theming is in
scope, state ThemeProvider + `data-theme` behavior. For a remote, state the
standalone entry and federated expose(s). For a host, state remote
configuration/fallback ownership. For a hybrid, state parent federated entry,
child remote configuration/add-remote, team layout/tokens/nav ownership, and
embed-mode behavior (`embedded={true}` vs standalone). List shared package
names and compatible versions, or N/A.]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
