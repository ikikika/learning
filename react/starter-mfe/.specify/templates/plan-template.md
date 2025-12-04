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

**Testing**: Jest + React Testing Library; Playwright for
standalone/shell smoke; contract tests for remote exposes when federation is
in scope

**Target Platform**: Modern evergreen browsers (SPA) including phone-width
viewports; PWA-capable (installable + offline app-shell baseline); Node for
build/CI only

**Project Type**: Single-app React repository — role is one of
`shell` | `remote` | `standalone` (multi-repo MFE topology)

**Performance Goals**: Keep interactive route usable under ~2s on broadband;
avoid duplicate `react`/`react-dom`; measure remote `remoteEntry` + chunk load
cost for federated surfaces; keep primary mobile flows usable without
horizontal scroll

**Constraints**: Webpack Module Federation only; singleton shared peers;
no secrets in client bundles; remote URLs via config; canonical root `src/`
layout; remotes must remain runnable standalone; UI MUST be mobile-responsive;
apps MUST ship PWA baseline (manifest, icons, service worker / equivalent)
with shell-owned install/offline UX when federated

**Scale/Scope**: Pick one role and replace with concrete paths for this plan:
- Standalone — e.g. `Role: standalone. In: features/auth, pages/LoginPage +
  ProfilePage. Out: federation, other remotes.`
- Remote — e.g. `Role: remote (checkout). In: features/checkout, expose
  ./Checkout. Out: shell chrome; other remotes.`
- Shell — e.g. `Role: shell. In: /checkout route + remote load/fallback config.
  Out: checkout domain logic (owned by checkout remote).`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Derived from `.specify/memory/constitution.md` (Starter MFE Constitution v2.1+).

- **Repository Role & Portability**: Repository role is explicit (shell,
  remote, or standalone). Remote feature logic is usable in standalone and
  federated modes; shell/remote-only code is limited to edge adapters.
- **Shared Runtime Singletons**: Plan states how `react` / `react-dom` (and any
  new shared peers) are singleton-shared; no duplicate framework bundles.
- **Explicit Host/Remote Contracts**: If federation is in scope, public remote
  exports, versions/compatibility, and failure fallbacks are defined (see
  `contracts/` when applicable). Shared contract package names and compatible
  versions are recorded. Prefer exposing `features/<name>` public entrypoints.
- **Composition-First UI**: Component APIs prefer composition over boolean-prop
  sprawl; presentational UI stays free of transport/host details; no Atomic
  Design folder taxonomy required.
- **Responsive Experience & PWA Readiness**: Primary flows are mobile-responsive;
  PWA baseline (manifest, icons, service worker / equivalent) is planned;
  federated apps prefer shell-owned install/offline UX; remotes remain safe when
  embedded and PWA-capable in standalone mode.
- **Multi-Repository Topology**: This repository contains one app at root
  `src/`; it does not embed shell and remote implementations under `apps/`.
  Shared UI/config/contracts come from versioned packages, not copied folders.
- **Application Layout**: Root `src/` matches the canonical layout. No parallel
  `lib/` for helpers that belong in `core/`.
- **Verifiable Isolation**: Unit tests do not require a live host; contract or
  integration coverage exists for federation boundaries when in scope; both
  modes remain exercisable (or deferral is tracked).
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
  - State this repository's single role: shell, remote, or standalone.
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
│       ├── [Component].module.scss  # styles (or co-located CSS)
│       └── types.ts                 # props / public types
├── core/                 # constants, hooks, types, utils (no parallel lib/)
├── services/             # app-wide infra only (e.g. httpClient.ts, logger.ts,
                            analytics.ts, localStorage.ts, realtimeClient.ts)
├── styles/
└── test/                 # app test utils / setup

tests/
├── unit/
├── integration/
└── contract/

# External versioned dependencies (not local workspace folders)
@scope/shared-ui
@scope/shared-config
@scope/remote-contracts
```

**Repository Role**: [shell | remote | standalone — choose exactly one]

**Structure Decision**: [Reference the concrete root `src/` paths used by this
feature. For a remote, state the standalone entry and federated expose(s). For
a shell, state remote configuration/fallback ownership. List shared package
names and compatible versions, or N/A.]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
