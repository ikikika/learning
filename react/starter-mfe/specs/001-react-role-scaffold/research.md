# Research: React Role Scaffold

## Decision: React 19 + TypeScript 5.x

- **Rationale**: Current React line; aligns with composition patterns and
  concurrent defaults without legacy baggage for a greenfield starter.
- **Alternatives considered**: React 18 (still fine; slightly older default).

## Decision: Webpack 5 + Module Federation Plugin

- **Rationale**: Constitution mandates Webpack Module Federation; async
  `main.tsx` → `bootstrap.tsx` avoids eager shared init.
- **Alternatives considered**: Rspack / Vite federation (constitution forbids
  without Complexity Tracking exception).

## Decision: Role-conditioned single Webpack config

- **Rationale**: One repo, one app; `starter.role.json` (or env injected by
  init) selects `standalone` | `shell` | `remote` MF `exposes`/`remotes`/
  `shared` blocks. Avoids maintaining three full config trees.
- **Alternatives considered**: Three webpack configs copied by init (more
  drift); runtime-only role switching (violates one-role-per-repo clarity).

## Decision: Init as Node script `scripts/init.mjs`

- **Rationale**: Required `--role`, optional `--force`; no interactive prompts;
  works on Windows/macOS/Linux with Node 20+. Writes `starter.role.json` and
  patches README role section.
- **Alternatives considered**: Interactive prompts (rejected by clarify);
  Yeoman/Plop generator emitting new repos (out of scope).

## Decision: Role metadata filename `starter.role.json`

- **Rationale**: Explicit, root-level, machine-readable; easy for CI/scripts;
  does not overload `package.json`.
- **Alternatives considered**: `.starter-role`, `package.json#starterRole`
  (less visible / more coupling).

## Decision: Jest + React Testing Library + Playwright

- **Rationale**: Plan template default; RTL for components; Playwright for
  role smoke (viewport, offline message, shell fallback). Contract tests as
  Node assertions on init CLI + webpack expose map / docs.
- **Alternatives considered**: Vitest (excellent DX; switch later if desired).

## Decision: Workbox via `workbox-webpack-plugin` for PWA SW

- **Rationale**: Mature Webpack integration; precache app-shell assets for
  installability; runtime strategy can still surface online-required UX for
  navigation/demo routes.
- **Alternatives considered**: Hand-rolled SW (more error-prone); vite-plugin-pwa
  (wrong bundler).

## Decision: PWA registration strategy by role

- **Rationale**: Clarify + constitution: shell registers install/offline UX for
  composed apps; remote registers full PWA only in standalone builds; when
  built as federated remote entry, skip competing full-document SW registration
  (or no-op guard when `window` is under shell control / `SKIP_PWA` define).
- **Alternatives considered**: Always register SW in remotes (conflicts with
  shell ownership).

## Decision: Connectivity UX via `navigator.onLine` + online/offline events

- **Rationale**: Spec requires "internet connection required" message when no
  network; simple, testable; not a full offline data layer.
- **Alternatives considered**: Full offline demo with mocked APIs (out of scope).

## Decision: Sample feature `features/demo` exposed as `./Demo`

- **Rationale**: Clarify default public entry; rename guidance in README.
- **Alternatives considered**: `./App`, `./RemoteApp`, required `--expose`.

## Decision: No shared `@scope/*` packages in v1

- **Rationale**: Spec allows deferral; reduce bootstrap complexity.
- **Alternatives considered**: Immediate private registry packages (heavier).

## Decision: CSS variable tokens in `src/styles/tokens` + SCSS modules

- **Rationale**: Constitution lists `styles/` as the tokens entry; CSS
  variables give a single source for color/spacing/type/breakpoints without a
  published design-token package. SCSS modules keep component styles local and
  responsive. **No third-party component library in v1** (MUI, Chakra, Ant,
  shadcn, etc.) so the starter stays lean and role/MF-focused.
- **Alternatives considered**: Tailwind-only tokens; CSS Modules with hard-coded
  values; adopting a UI kit day one (rejected — locks look, adds weight, and
  complicates federated sharing before `@scope/shared-ui` exists).

## Decision: `ThemeProvider` + `data-theme` + preference lifecycle

- **Rationale**: Spec FR-019–022. `ThemeProvider` (under `app/providers/`) owns
  theme state and writes `data-theme="light"|"dark"` on
  `document.documentElement`. Token file defines `:root` (light) and
  `[data-theme="dark"]` overrides. **First visit** (no persisted choice): follow
  `prefers-color-scheme`, fallback `light`. **After toggle**: persist in
  `localStorage` and ignore system until cleared. Demo `ThemeToggle` makes this
  verifiable in every role’s standalone experience.
- **Alternatives considered**: Always-default-light (rejected); system-only with
  no persistence (rejected); CSS-in-JS theme objects (heavier).

## Decision: Shell-owned document theme when federated

- **Rationale**: Spec FR-022 / SC-014 — mirrors PWA ownership. Shell owns
  document-level `data-theme` / ThemeProvider UX when composed. Remote runs full
  ThemeProvider + toggle in **standalone only**; when embedded, skip competing
  document-theme registration (same guard pattern as `SKIP_PWA` / federated
  remote entry).
- **Alternatives considered**: Last-writer-wins dual providers (racey); required
  shared theme-sync package in v1 (out of scope).
