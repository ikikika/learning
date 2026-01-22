# Research: Hybrid Role Scaffold

**Feature**: `005-hybrid-role-scaffold` | **Date**: 2026-08-02

## R1 — Hybrid as host∩remote at federation edges

**Decision**: Webpack `federationOptions('hybrid')` sets **both** `remotes: buildRemotesMap(...)` (like host) and `exposes: { [expose]: './src/app/FederatedHybridApp.tsx' }` (like remote). Bake `__STARTER_REMOTE_PROPS__` / remoteEntries when role is host **or** hybrid. `@active-routes` → `hybridRoutes.tsx` for own-app.

**Rationale**: Matches constitution (expose to parent + consume children) without dual apps or monorepo split.

**Alternatives considered**:

- Separate “hybrid host” and “hybrid remote” clones — rejected (one role per clone).
- Reuse `FederatedRemoteApp` for hybrid expose — rejected (hybrid must render chrome + child slots, not leaf routes).

## R2 — Port and env key

**Decision**: Add `PORT_HYBRID` (default **3003** in e2e/compose conventions). Mirror `portEnvKeyForRole` / `getPortForRole` in `init.mjs` and `load-env.cjs`. Document in `.env.example`.

**Rationale**: Parallel to `PORT_HOST` / `PORT_REMOTE` / `PORT_STANDALONE`; avoids colliding with common 3000–3002 role ports.

**Alternatives considered**: Reuse `PORT_HOST` for hybrid — rejected (confuses shell vs hybrid clones).

## R3 — Init metadata and host add-remote snippet

**Decision**: Hybrid `starter.role.json` includes `expose` (PascalCase path from `--name`) **and** `remotes[]` (empty by default; optional `--remote` / `--remote-name` like host). After init, print the same style host `add-remote` command as remote init (`hostRemoteSnippetForApp`).

**Rationale**: Spec FR-003 / SC-002; reuses proven DX.

**Alternatives considered**: Document-only registration steps — rejected (spec requires printed command).

## R4 — add-remote gate

**Decision**: Allow `meta.role === 'host' || meta.role === 'hybrid'`. Refuse standalone/remote with clear error. No role-sniffing of child “leaf vs hybrid” (clarify A).

**Rationale**: Spec FR-006/007; keeps CLI simple; sample docs still recommend leaf children.

**Alternatives considered**: Hybrid-only leaf enforcement — rejected in clarify.

## R5 — Distinct hybrid chrome

**Decision**: Reuse nav+panel composition (slot list + `LoadRemote` panel) patterned on `demoHost`, implemented as `features/demoHybrid` with **distinct CSS tokens/branding** and **one layout cue** (e.g. hybrid-specific header/band `data-testid` distinguishable from host). Own-app wraps with layout that includes `ThemeToggle`.

**Rationale**: Clarify A for distinct chrome; minimizes IA inventiveness while satisfying “not a visual clone.”

**Alternatives considered**: Tokens-only with identical layout — rejected (clarify). Full top-nav IA rewrite — deferred as unnecessary for v1.

## R6 — Embed-mode theme toggle suppression

**Decision**: `FederatedHybridApp` accepts `embedded?: boolean`. When `embedded === true`: do not mount hybrid `ThemeToggle` / do not call document theme or PWA registration from the federated path; still render hybrid chrome (layout, tokens scoped to mount, nav). Own-app `App` + `hybridRoutes` keep ThemeProvider + PWA via bootstrap (unchanged pattern). Shell `LoadRemote` continues to force `embedded: true`. Hybrid’s `LoadRemote` likewise passes `embedded: true` to children.

**Rationale**: Clarify B; aligns with constitution outermost-shell ownership.

**Alternatives considered**: Keep toggle but scope tokens only — rejected (clarify). Strip hybrid tokens when embedded — rejected (loses distinct in-boundary chrome).

## R7 — Federated entry module

**Decision**: New `src/app/FederatedHybridApp.tsx` (not `App.tsx`, not `FederatedRemoteApp.tsx`). Own-app continues `App.tsx` → `@active-routes` → `hybridRoutes`. Export typed props + `CONTRACT_VERSION` from `features/demoHybrid` (or federated module) for contract tests.

**Rationale**: Same dual-entry pattern as remote (`App` vs `FederatedRemoteApp`); keeps other roles’ expose path stable.

**Alternatives considered**: Point expose at `App.tsx` — rejected (breaks embed router nesting / provider assumptions under shell).

## R8 — Pair compose verification

**Decision**: CI/automation requires (1) hybrid standalone Playwright smoke, (2) hybrid+leaf pair (add-remote leaf, fallback), (3) shell+hybrid pair (embed ownership, toggle suppressed, chrome visible, hybrid-down fallback). Full shell→hybrid→leaf three-process CI is **deferred** with tracked follow-up in plan Complexity Tracking.

**Rationale**: Spec FR-016 / clarify B for verification depth.

**Alternatives considered**: Mandate three-tier CI in v1 — rejected (cost vs coverage). Defer all compose — rejected (spec requires pairs).

## R9 — Schema and docs

**Decision**: Extend role metadata schema enum with `hybrid`; document hybrid shape (`expose` + `remotes`). Update README/AGENTS topology (shell / hybrid / leaf). Keep init no-prune policy.

**Rationale**: One role per clone; discoverability (SC-009).

**Alternatives considered**: Informal README-only role — rejected (contracts/tests need enum).

## Resolved NEEDS CLARIFICATION

None remaining for planning; clarify session 2026-08-02 + codebase exploration closed port, entry, chrome, gate, and verification choices.
