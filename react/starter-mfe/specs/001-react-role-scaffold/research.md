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
  init) selects `standalone` | `host` | `remote` MF `exposes`/`remotes`/
  `shared` blocks. Avoids maintaining three full config trees.
- **Alternatives considered**: Three webpack configs copied by init (more
  drift); runtime-only role switching (violates one-role-per-repo clarity).

## Decision: Init as Node script with symmetric prune/restore

- **Rationale**: Required `--role`, optional `--force`; no interactive prompts;
  writes `starter.role.json` + README. **Symmetric** FR-025:
  - Host: prune live demo + `HomePage`; restore host assets from
    `templates/role-assets/host/`.
  - Standalone/remote: prune live host-only assets; restore demo + `HomePage`
    from `templates/role-assets/demo/`.
    Templates **mirror `src/` relative paths**; restore is a straight copy
    (not git checkout alone).
- **Alternatives considered**: Interactive prompts; external generators; git
  restore only; leave dormant opposite-role assets on disk; flat templates with
  remap tables (all rejected).

## Decision: Role metadata filename `starter.role.json`

- **Rationale**: Explicit, root-level, machine-readable.
- **Alternatives considered**: `.starter-role`, `package.json#starterRole`.

## Decision: Jest + RTL + Playwright + axe (WCAG 2.2 AA CI)

- **Rationale**: Unit/contract; per-role Playwright for **first visit (cleared
  storage) → system/`light`**, **theme toggle** (SC-012), and **toggle →
  reload → same `data-theme`** (SC-013) for standalone, host, and
  remote-standalone; host smoke also covers **empty/invalid remote URL**
  fallback (SC-004 / FR-007); compose smoke; **FR-026 WCAG 2.2 AA** via axe
  (or equivalent) failing CI on primary demo routes.
- **Alternatives considered**: Vitest; unit-only for SC-013 first-visit/reload;
  unreachable-only host fallback; manual compose; no AA tooling (rejected).

## Decision: Workbox via `workbox-webpack-plugin` for PWA SW

- **Rationale**: Webpack-native precache for installability.
- **Alternatives considered**: Hand-rolled SW; vite-plugin-pwa.

## Decision: PWA registration strategy by role

- **Rationale**: Host owns composed install/offline; remote full PWA in
  **standalone entry** only. When `./Demo` is mounted with `embedded={true}`,
  the Demo module must not take over document SW; remote bootstrap
  `registerPwa` is not the federated control point.
- **Alternatives considered**: Always register SW in remotes; remote bootstrap
  checks a host global (rejected).

## Decision: Connectivity UX via `navigator.onLine` + events

- **Rationale**: Show "internet connection required"; no full offline product.
- **Alternatives considered**: Full offline demo APIs.

## Decision: Sample feature `./Demo` with `embedded?: boolean`

- **Rationale**: FR-024 — public types + contract version **`1.0.0`** +
  optional boolean **`embedded?: boolean`** (host passes `embedded={true}`;
  omit/`false` = standalone). When `embedded` is `true`, the **`./Demo` module
  itself** suppresses full-document PWA and `data-theme` ownership. Published
  npm package deferred (Complexity Tracking).
- **Alternatives considered**: Docs-only expose; published npm contracts in v1;
  `hostContext` object; `mode` enum; `window` globals; MF container sniffing;
  suppression only in remote bootstrap ThemeProvider (rejected — MF may load
  only the expose).

## Decision: No shared `@scope/*` packages in v1

- **Rationale**: Reduce bootstrap complexity; Principle III still met via
  in-repo typed/versioned API. Recorded in Complexity Tracking.
- **Alternatives considered**: Immediate private registry packages.

## Decision: CSS variable tokens + SCSS modules

- **Rationale**: No third-party UI kit in v1.
- **Alternatives considered**: Tailwind-only; UI kit day one.

## Decision: `ThemeProvider` + preference lifecycle

- **Rationale**: First visit system preference; toggle persists; “Use system
  theme” clears (FR-021). Per-role e2e asserts first visit + reload (SC-013).
  Standalone/host (and remote-standalone) entry mounts ThemeProvider; federated
  Demo with `embedded={true}` does not own document theme.
- **Alternatives considered**: Always-light; no clear control; unit-only first
  visit/reload.

## Decision: Host-owned document theme when federated

- **Rationale**: FR-022 / SC-014; mirrors PWA ownership; driven by
  `embedded={true}` on Demo.
- **Alternatives considered**: Last-writer-wins; shared theme sync package;
  remote bootstrap ThemeProvider always mounts and reads host context
  (rejected).

## Decision: Host fallback for unreachable and empty/invalid remotes

- **Rationale**: FR-007 / SC-004 — `RemoteFallback` for missing/failing remotes
  and for empty/invalid remote URL (or missing remotes map entry); automated
  host smoke covers both.
- **Alternatives considered**: Unreachable-only smoke; docs-only empty URL.

## Decision: Automated compose smoke via two temporary workspaces

- **Rationale**: FR-023 / SC-015 / SC-019. Harness copies/clones into two temp
  dirs, `init --role=host` and `init --role=remote`, starts both, Playwright
  asserts ownership. Product tree stays one role per init.
- **Alternatives considered**: Single-tree dual-role build; manual-only clones
  without harness automation (rejected).

## Decision: Host always removes `HomePage`; standalone/remote remove host assets

- **Rationale**: Clarify FR-006 / FR-025. Host uses **`HostHomePage` only**;
  standalone/remote must not leave live host-only sample assets on disk.
- **Alternatives considered**: Keep unused opposite-role pages; prune HomePage
  only without host templates (rejected).

## Decision: Interactive ~2s is aspirational only

- **Rationale**: Clarify — document as plan performance goal; **no hard CI
  perf gate** in v1.
- **Alternatives considered**: Fail CI on >2s LCP/TTI (deferred).
