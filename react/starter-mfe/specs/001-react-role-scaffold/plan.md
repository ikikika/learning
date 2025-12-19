# Implementation Plan: React Role Scaffold

**Branch**: `001-react-role-scaffold` | **Date**: 2026-07-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-react-role-scaffold/spec.md`

**Note**: This plan is for the in-repo starter itself. Init configures **this**
repository as exactly one of `standalone` | `shell` | `remote` per run (not a
multi-app monorepo).

## Summary

Deliver an in-repo React starter initialized with required `--role`. Init writes
`starter.role.json` + README, shapes Webpack MF, and uses **symmetric**
prune/restore via templates that **mirror `src/` relative paths**:
`templates/role-assets/demo/` and `templates/role-assets/shell/`. Shell prunes
live demo + `HomePage` and restores shell assets; standalone/remote prune
shell-only live assets and restore demo + `HomePage`. Tokens + ThemeProvider
with light/dark + “Use system theme”. Shell mounts `./Demo` with
**`embedded={true}`**; the **Demo module** suppresses document PWA/theme when
embedded (remote bootstrap ThemeProvider/`registerPwa` are standalone-entry
only). **Compose smoke**: two temp workspaces. **WCAG 2.2 AA CI**. Per-role
smoke: first visit (cleared storage) → system/`light`, toggle, **toggle →
reload → same `data-theme`**, use-system. Shell smoke also covers
**empty/invalid remote URL**. Offline: **"internet connection required"**.
In-repo typed `./Demo` + `1.0.0` (published package deferred). ~2s interactive
is **aspirational**.

## Technical Context

**Language/Version**: TypeScript 5.x + React 19

**Primary Dependencies**: React, React DOM, React Router; Webpack 5 + Module
Federation; Workbox (`workbox-webpack-plugin`); Jest + RTL; Playwright
(per-role + compose); axe (or equivalent) for **WCAG 2.2 AA** CI audits.
No mandatory published shared contract packages in v1.

**Storage**: `starter.role.json`; `navigator.onLine`; theme in `localStorage`
after light/dark toggle (first visit: `prefers-color-scheme` → `light`;
“Use system theme” clears); pristine role assets under
`templates/role-assets/demo/` and `templates/role-assets/shell/` (mirror
`src/` relative paths).

**Testing**: Co-located unit tests; `tests/contract/`; Playwright per-role
(viewport, offline, shell fallback incl. **empty/invalid remote URL**, theme
**first visit** + toggle + **reload persistence** + use-system for
standalone/shell/remote-standalone); compose harness (two temp workspaces);
WCAG 2.2 AA CI gate on primary routes.

**Target Platform**: Evergreen browsers incl. phone-width; PWA-capable; Node 20+.

**Project Type**: Single-app React template — one role per clone after init.

**Performance Goals**: **Aspirational** interactive demo under ~2s on broadband
(not a hard CI failure); singleton `react`/`react-dom` when federated; no
primary horizontal scroll at phone-width.

**Constraints**: Webpack MF only; singleton shared peers; no secrets in bundles;
canonical `src/`; symmetric templates prune/restore; typed `./Demo` with
`embedded?: boolean` + version `1.0.0`; Demo-module suppression when embedded;
compose via two workspaces; WCAG 2.2 AA CI; no third-party UI kit; `--role`
required; `--force` to re-init.

**Scale/Scope**:
- In: init + symmetric templates, MF roles, demo/typed contract + `embedded`
  prop, shell slot/fallback (incl. empty/invalid URL), PWA, theming, compose
  smoke, per-role theme first-visit/reload smoke, axe CI.
- Out: external generators; separate migration CLI (FR-012); `@scope/*`; UI
  kits; published remote-contracts package (deferred); hard CI perf budget;
  full offline app; auth/backend.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Repository Role & Portability**: PASS — one role; symmetric prune/restore;
  remote dual-mode.
- **Shared Runtime Singletons**: PASS — MF `shared` singletons.
- **Explicit Host/Remote Contracts**: PASS — typed `./Demo` + `1.0.0` +
  `embedded?: boolean` (Principle III). Published package deferred via
  Complexity Tracking.
- **Composition-First UI**: PASS — flat components; no UI kit.
- **Responsive Experience & PWA Readiness**: PASS — responsive + PWA; shell
  owns federated PWA/theme; Demo suppresses when `embedded={true}`; WCAG AA CI.
- **Multi-Repository Topology**: PASS — one app/clone; compose uses temp copies.
- **Application Layout**: PASS — canonical `src/` + mirrored templates.
- **Verifiable Isolation**: PASS — unit/contract; per-role (first-visit +
  reload) + empty-remote fallback + compose smoke; AA CI.
- **Complexity Tracking**: Offline UX; aspirational perf; deferred published
  contract package.

## Project Structure

### Documentation (this feature)

```text
specs/001-react-role-scaffold/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md             # regenerate via /speckit-tasks
```

### Source Code (repository root)

```text
starter.role.json
README.md
package.json
config/
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js
public/
├── manifest.webmanifest
└── icons/
templates/
└── role-assets/
    ├── demo/             # mirrors src/: features/demo/, pages/HomePage/
    └── shell/            # mirrors src/: pages/ShellHomePage/, app/remotes/loadDemoRemote.tsx, app/routes/shellRoutes.tsx
scripts/
├── init.mjs              # symmetric prune/restore; --role [--force]
└── compose-harness.mjs   # two temp workspaces for test:compose
src/
├── main.tsx
├── bootstrap.tsx
├── app/
│   ├── App.tsx
│   ├── providers/        # ThemeProvider + registerPwa: standalone/shell entry
│   ├── remotes/          # shell loaders pass embedded={true} to ./Demo
│   └── routes/
├── features/
│   └── demo/             # ./Demo; honors embedded?: boolean (suppress when true)
├── pages/
│   ├── HomePage/
│   └── ShellHomePage/
├── layouts/MainLayout/
├── components/
│   ├── Button/
│   ├── ThemeToggle/
│   ├── RemoteFallback/
│   └── ConnectionRequired/
├── core/
├── services/
├── styles/
│   ├── tokens.css
│   └── global.scss
└── test/
tests/
├── integration/
└── contract/
```

**Repository Role**: One of three after `init --role=…`.

**Structure Decision**: Live app under `src/`. Templates mirror `src/` under
`demo/` and `shell/`. Shell mounts `./Demo` with `embedded={true}`; Demo module
suppresses document PWA/theme; remote bootstrap providers are standalone-entry
only. Per-role smoke covers first visit + reload; shell smoke covers
empty/invalid remote URL. Perf ~2s aspirational only.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Full offline demo not shipped; show connection-required | Spec clarification | Conflicts with clarified UX; SW still for installability |
| Interactive ~2s not a hard CI gate | Clarify: aspirational plan goal | Hard perf CI premature for v1 scaffold; still document target |
| Published shared contract package deferred; in-repo typed `./Demo` + `1.0.0` only | Clarify / constitution Tech Constraints exception | Registry packaging mid-scaffold adds bootstrap complexity; Principle III still met via typed, versioned in-repo public API + `embedded?: boolean` |

## Phase 0 / Phase 1 outputs

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/](./contracts/)
- [quickstart.md](./quickstart.md)

## Post-design Constitution Check

Re-evaluated after Phase 1 (`embedded?: boolean`, Demo-module suppression,
first-visit + empty-remote smoke, Complexity Tracking for deferred published
contracts): all gates PASS with Complexity Tracking notes. No unjustified MUST
violations.
