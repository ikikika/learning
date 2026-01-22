# Implementation Plan: Host add-remote command

**Branch**: `004-host-add-remote` | **Date**: 2026-08-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-host-add-remote/spec.md`

## Summary

Add a host-only `npm run add-remote` CLI that appends one already-running remote to `starter.role.json` remotes[], regenerates `loaders.generated.ts`, and writes the remote URL env key—without touching standalone/remote role behavior. Extend host composition so each alias can carry a distinct JSON props bag (optional on add-remote; hand-edited later), baked at build time and passed by `LoadRemote` with `embedded={true}` authoritative. Sample `FederatedRemoteApp` / Route 1 UI must reflect a host `title` (or equivalent) prop when embedded for SC-006.

## Technical Context

**Language/Version**: TypeScript 5.x + React 19; Node ≥20 for CLI scripts (ESM `.mjs` + shared CJS helpers)

**Primary Dependencies**: React, React DOM, React Router, Webpack Module Federation (existing). No new runtime packages required for v1.

**Storage**: Repo files only — `starter.role.json` (`remotes[]` + `remoteProps`), `.env` (`*_URL`), generated `src/app/remotes/loaders.generated.ts`. No database.

**Testing**: Jest unit tests for CLI helpers / props merge; Node contract tests for add-remote (host-only, duplicate reject, env/meta writes); Playwright host/compose smokes for nav + visible host prop; existing standalone/remote suites must stay green.

**Target Platform**: Evergreen browsers + Node for CLI/CI; phone-width host chrome unchanged

**Project Type**: Single-app React starter; this feature’s **runtime surface is host**; CLI is host-gated; shared tree keeps remote/standalone dual-mode intact

**Performance Goals**: Unchanged (~2s interactive aspirational); no extra React copies; props bags are small JSON baked at build time

**Constraints**: MF only; singleton `react`/`react-dom`; no secrets in client; remotes stay dual-mode; `embedded` cannot be overridden by custom props; do not change `App.tsx` non-embedded path, `standaloneRoutes`, or `hostRoutes` structure beyond LoadRemote prop wiring; restart host after add-remote for webpack remotes map

**Scale/Scope**: Role focus **host tooling + composition**. In: `scripts/add-remote.mjs`, remotes-config helpers, role metadata `remoteProps`, webpack bake `__STARTER_REMOTE_PROPS__`, `LoadRemote` prop merge, `FederatedRemoteApp` + demoRemote sample title display, README. Out: auto-discovery of remotes, process management, dedicated props-update CLI, standalone home/demo changes, host nav redesign.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Derived from `.specify/memory/constitution.md` (Starter MFE Constitution v2.1+).

- **Repository Role & Portability**: PASS — Host owns add-remote + props bake/load; remote sample accepts optional display prop only when embedded; own-app path unchanged; standalone untouched.
- **Shared Runtime Singletons**: PASS — No new shared peers; existing MF `shared` for react/react-dom remains.
- **Explicit Host/Remote Contracts**: PASS — Document CLI contract + host props (`embedded` + serializable bag); failure still uses `RemoteFallback`; sample prop is additive MINOR on federated entry.
- **Composition-First UI**: PASS — Props passed at mount; sample reads optional `title` without host transport sprawl; no Atomic Design folders.
- **Responsive Experience & PWA Readiness**: PASS — No layout ownership change; host keeps PWA/theme when composing; remotes stay embedded-safe.
- **Multi-Repository Topology**: PASS — One app at root `src/`; no `apps/` split.
- **Application Layout**: PASS — CLI under `scripts/`; constants/loaders under existing `src/app/remotes` + `src/core/constants`; feature sample under `features/demoRemote`.
- **Verifiable Isolation**: PASS — CLI contract tests without live MF; unit tests for props merge; compose/host smokes for federated path; standalone/remote smoke non-regression.
- **Complexity Tracking**: None — no MUST exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/004-host-add-remote/
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
├── add-remote.mjs           # NEW — host-only CLI
├── remotes-config.cjs       # EXTEND — props normalize, URL-from-port, shared write helpers
├── init.mjs                 # TOUCH lightly — keep remotes[] compatible; optional shared write helpers
└── load-env.cjs             # READ — DEV_HOST for port→URL

src/app/remotes/
├── loadRemote.tsx           # EXTEND — merge per-alias props + embedded={true}
├── loaders.generated.ts     # REGEN via add-remote (and init)
└── (props via getRemoteProps in remotes.ts — no separate remoteProps.ts)

src/core/constants/remotes.ts  # EXTEND — getRemoteProps(alias); ignore unknown aliases

src/app/FederatedRemoteApp.tsx # EXTEND — accept/forward sample host props (e.g. title)
src/features/demoRemote/       # EXTEND — show host title when provided (embedded)

config/webpack.common.js       # EXTEND — DefinePlugin __STARTER_REMOTE_PROPS__

starter.role.json              # EXTEND schema — remoteProps?: Record<alias, object>
.env / .env.example            # EXTEND — document per-remote *_URL keys

tests/contract/                # NEW — add-remote-*.test.mjs
tests/integration/             # EXTEND — host/compose prop visibility as needed
```

**Repository Role**: Host (tooling + composition); shared starter also contains remote/standalone assets that must not regress.

**Structure Decision**: Reuse `remotes-config.cjs` + `generateLoadersSource` (same as init). Store `remoteProps` on `starter.role.json` for one hand-edit surface. Bake props like remotes config via webpack. Keep `App.tsx` / role route tables behaviorally unchanged aside from LoadRemote → FederatedRemoteApp prop plumbing. Shared packages: N/A (in-repo only).

## Complexity Tracking

> No constitution violations requiring justification.
