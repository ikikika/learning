# Implementation Plan: React Role Scaffold

**Branch**: `001-react-role-scaffold` | **Date**: 2026-07-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-react-role-scaffold/spec.md`

**Note**: This plan is for the in-repo starter itself. Init configures **this**
repository as exactly one of `standalone` | `shell` | `remote` per run (not a
multi-app monorepo).

## Summary

Deliver an in-repo React starter that developers initialize with a required
`--role` flag. Init writes role metadata + README, shapes Webpack Module
Federation config for the chosen role, scaffolds the canonical `src/` layout
with a responsive demo surface, and ships PWA baseline (manifest, icons,
service worker) with shell-owned install/offline UX when federated. Offline
demo content is out of scope: show **"internet connection required"** when
offline. Re-init requires `--force`.

## Technical Context

**Language/Version**: TypeScript 5.x + React 19

**Primary Dependencies**: React, React DOM, React Router; Webpack 5 + Module
Federation; Workbox (via `workbox-webpack-plugin`) for service worker;
Jest + React Testing Library; Playwright for smoke. No mandatory shared npm
packages in v1 (`@scope/*` deferred).

**Storage**: Role metadata file at repo root (`starter.role.json`); browser
`navigator.onLine` / online events for connectivity UX; theme preference in
`localStorage` (via ThemeProvider); no app database.

**Testing**: Jest + React Testing Library with unit/component tests co-located
beside their source modules; root `tests/` is reserved for cross-cutting
integration and federation/init contracts; Playwright smoke for each role
(responsive viewport + offline message + shell fallback).

**Target Platform**: Modern evergreen browsers including phone-width viewports;
PWA-capable; Node 20+ for build/CI/init scripts.

**Project Type**: Single-app React repository template — role selected at init
(`shell` | `remote` | `standalone`); multi-repo topology across separate clones.

**Performance Goals**: Interactive demo route usable under ~2s on broadband;
singleton `react`/`react-dom` when federated; primary mobile demo without
horizontal scroll.

**Constraints**: Webpack Module Federation only; singleton shared peers for
federation; no secrets in client bundles; remote URLs via config; canonical
root `src/`; remotes runnable standalone; mobile-responsive primary demo; PWA
baseline for all roles; shell owns install/offline UX when composed; offline
→ connection-required message (not full offline app); init requires `--role`;
re-init requires `--force`; styling via `src/styles/tokens` CSS variables +
local SCSS modules — **no third-party component library in v1**.

**Scale/Scope**: This plan delivers the **starter template + init tooling** that
can produce any one role per repository clone.
- In: `scripts/init` (or equivalent), `starter.role.json`, README role section,
  role-conditioned Webpack MF config, canonical `src/` with `features/demo`
  (`./Demo` expose for remote), shell remote slot + fallback, PWA assets,
  offline connection banner, responsive layouts, `src/styles/tokens` (CSS
  variables), `ThemeProvider` with `data-theme="light"|"dark"` on the document
  root, demo theme toggle.
- Out: external multi-repo generator CLI; dedicated migration tooling beyond
  `--force` init; shared `@scope/*` packages; third-party UI kits (MUI/Chakra/
  etc.); multi-brand theme packs; shell→remote theme sync package; full offline
  demo/API; auth/backend product features.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Derived from `.specify/memory/constitution.md` (Starter MFE Constitution v2.1+).

- **Repository Role & Portability**: PASS — init selects exactly one role;
  remote keeps dual-mode via shared `features/demo` + expose `./Demo`; shell
  has adapters only.
- **Shared Runtime Singletons**: PASS — Webpack `shared` marks `react` /
  `react-dom` as singleton for shell/remote roles; standalone omits remotes.
- **Explicit Host/Remote Contracts**: PASS — `./Demo` documented; shell sample
  slot + fallback; contracts under `specs/.../contracts/`.
- **Composition-First UI**: PASS — flat `components/[Component]`; feature
  public `index.ts`; no Atomic Design taxonomy.
- **Responsive Experience & PWA Readiness**: PASS — responsive demo required;
  PWA baseline for all roles; shell-owned install/offline when federated;
  remote PWA in standalone; offline UX = connection-required message (app-shell
  SW for installability; full offline content out of scope — see Complexity
  Tracking note).
- **Multi-Repository Topology**: PASS — one app per clone; no `apps/` wrapper.
- **Application Layout**: PASS — canonical root `src/` as below.
- **Verifiable Isolation**: PASS — unit tests without live host; Playwright per
  role; contract tests for init + expose.
- **Complexity Tracking**: See note below (offline UX vs full offline shell
  content).

## Project Structure

### Documentation (this feature)

```text
specs/001-react-role-scaffold/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md             # /speckit-tasks — not created by /speckit-plan
```

### Source Code (repository root)

```text
starter.role.json         # machine-readable role (written by init)
README.md                 # human-readable role + start instructions
package.json
webpack.config.js         # role-conditioned MF + Workbox
public/
├── manifest.webmanifest
├── icons/
└── offline messaging is app-driven (online detection)
scripts/
└── init.mjs              # --role=… [--force]
src/
├── main.tsx
├── bootstrap.tsx
├── app/
│   ├── App.tsx
│   ├── providers/        # ThemeProvider, connectivity, PWA registration
│   └── routes/
├── features/
│   └── demo/             # sample capability; remote exposes ./Demo
│       ├── hooks/
│       ├── services/
│       ├── types/
│       ├── Demo.test.tsx  # co-located feature test
│       └── index.ts
├── pages/
│   ├── HomePage/         # standalone / remote standalone
│   └── ShellHomePage/    # shell chrome + remote slot
├── layouts/
│   └── MainLayout/
├── components/
│   ├── Button/            # includes Button.test.tsx
│   ├── RemoteFallback/
│   └── ConnectionRequired/  # "internet connection required"
├── core/
│   ├── constants/
│   ├── hooks/            # e.g. useOnlineStatus
│   └── types/
├── services/             # app-wide infra as needed
├── styles/
│   ├── tokens.css        # CSS variables for light + [data-theme="dark"]
│   └── global.scss       # global resets / base using tokens
├── sw/                   # service worker source if not fully Workbox-generated
└── test/                 # shared test setup/utilities only
tests/
├── integration/
└── contract/
```

**Repository Role**: Template supports all three; each clone is configured to
exactly one role after `init --role=…`.

**Structure Decision**: Single root `src/` canonical layout. Unit/component
tests are co-located with the component, hook, service, or feature they verify;
`src/test/` contains shared test setup/utilities only. Root `tests/` contains
cross-cutting integration and contract suites. Styling: CSS variables in
`src/styles/tokens.css` (no third-party component library); `ThemeProvider`
under `app/providers/` sets `data-theme="light"|"dark"` on `document.documentElement`
and persists preference; components consume tokens via CSS variables / SCSS
modules. Role differences are configuration and thin adapters (Webpack
`exposes`/`remotes`, shell remote slot page, PWA registration strategy)—not
forked feature trees. Shared npm packages: N/A for v1. Remote public entry:
`./Demo` → `features/demo`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Full offline demo content not shipped; offline shows connection-required message | Spec clarification: connectivity required for demo content | Serving full offline demo exceeds v1 scope and conflicts with clarified UX; SW still supports installability / asset baseline per constitution intent |

## Phase 0 / Phase 1 outputs

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/](./contracts/)
- [quickstart.md](./quickstart.md)

## Post-design Constitution Check

Re-evaluated after Phase 1 artifacts: all gates remain PASS with the Complexity
Tracking note above. No unjustified MUST violations.
