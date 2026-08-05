# Coding conventions

Source of truth for contributor and agent coding standards in this repository.
Keep this file IDE- and agent-agnostic (plain Markdown).

Higher-level product/architecture principles live in
[`.specify/memory/constitution.md`](../.specify/memory/constitution.md).

**Precedence:** This file, `AGENTS.md`, `docs/ui-context.md`, and the
constitution win over generic React / agent-skill advice. Prefer patterns
already in this codebase over alternatives from external guides.

## Layer boundaries

| Layer                  | Role                                                              |
| ---------------------- | ----------------------------------------------------------------- |
| `src/app/`             | Wiring: providers, role routes, federated entries, remote loaders |
| `src/features/<name>/` | Domain UI + `api/` / `hooks/` / `types/`                          |
| `src/pages/`           | Thin route containers that compose features                       |
| `src/components/`      | Shared UI primitives (not feature domain logic)                   |
| `src/core/`            | Shared constants, role/remotes helpers                            |
| `src/services/`        | Shared HTTP client (`httpClient`, `apiUrl`)                       |
| `src/layouts/`         | Shell chrome (e.g. `MainLayout`)                                  |

Keep new work inside the matching layer; do not grow pages into feature logic
or put API calls in presentational components.

## Data fetching

- **Do not hardcode API paths** in components. Define segments in
  `src/core/constants/apiRoutes.ts`, use path helpers for parameterized
  routes (e.g. `postByIdPath`), and build full URLs with `apiUrl()` from
  `src/services/httpClient.ts`.
- **Do not hardcode app URL path segments** (compose mount, leaf routes) in
  components or `RouteObject` tables. Define them in
  `src/core/constants/routePaths.ts` and reference `routePaths` /
  `composeChildPath` / `remoteSiblingPath`.
- **Do not call APIs inside presentational components** (including via
  `useEffect` in the component body). Prefer:
  - `src/features/<feature>/api/` — pure request functions (e.g. `getPost`)
  - `src/features/<feature>/hooks/` — hooks that own loading/error state
  - Components — consume hooks/props and render UI only
- Hooks and async UI MUST surface **loading**, **success**, and **error**
  states (and cancel/abort when the consumer unmounts or deps change).
- **Base URL** comes from `.env` (`API_BASE_URL`), injected at build time via
  webpack `DefinePlugin` into `src/core/constants/app.ts`. Restart `npm start`
  after changing `.env`.

## React UI rules

- Functional components only; keep render pure (no side effects in the render
  path). Side effects belong in feature hooks (or providers), not in page/
  presentational component bodies for data loading.
- Use hooks only at the top level of components or custom hooks.
- List keys MUST be stable identities; avoid array index keys when order can
  change.
- Prefer composition (`children`, small components) over large monolithic
  trees. Do not add `useMemo` / `useCallback` by default — use them where
  this repo already does (e.g. context values, lazy remote factories).

## Feature layout

Canonical app layout under `src/` (see constitution). Sample feature shape:

```text
src/features/<name>/
  api/           # HTTP / data access
  hooks/         # React hooks for that feature
  types/         # Feature-local types
  <Name>.tsx     # Presentational UI
  index.ts       # Public exports (especially for MF exposes)
```

### Creating a feature

Preferred order: **types → api → hooks → presentational UI → page/route wiring**.

1. `types/` — request/response and view contracts
2. `api/` — pure functions using `apiRoutes` / path helpers + `apiUrl()`
3. `hooks/` — loading / success / error (+ abort) around api
4. Feature UI — render from hooks/props only
5. `pages/` + role `*Routes.tsx` — thin container and path from `routePaths`

Keep components focused; extract a hook or child when UI and data logic grow
together. Prefer feature-local logic over cross-feature coupling.

## Imports and naming

- Prefer the `@/` alias (`tsconfig` → `src/*`) over deep relative imports
  (`../../..`).
- Use barrel `index.ts` exports for public module surfaces (especially
  federated feature entrypoints).

| Kind         | Convention                 | Example                           |
| ------------ | -------------------------- | --------------------------------- |
| Component    | PascalCase                 | `DemoHost.tsx`                    |
| Styles       | Same base + `.module.scss` | `DemoHost.module.scss`            |
| Hook         | `use` + camelCase          | `usePost.ts`                      |
| API function | camelCase verb             | `getPost.ts`                      |
| Types        | under `types/`             | `types/post.ts`, `types/index.ts` |
| Unit test    | co-located                 | `DemoHost.test.tsx`               |

## Environment & ports

- `.env.example` leaves `PORT_*` blank; required init `--port` fills the role’s key.
- Ports and remote URLs: `.env` / `.env.example` (`PORT_*`, `DEV_HOST`,
  per-remote `*_REMOTE_URL` / `urlEnv`, `API_BASE_URL`).
- Host remotes: `starter.role.json` → `remotes[]` (empty by default on host
  init; add via `--remote` / `--remote-name` at init, or later with
  `npm run add-remote` — host only). Optional `remoteProps` map holds
  per-alias host props; bake via webpack; read with `getRemoteProps(alias)`.
  See `src/core/constants/remotes.ts` and `src/app/remotes/loadRemote.tsx`.
- Loader: `scripts/load-env.cjs` (used by webpack and Node scripts).

## Module Federation / roles

- One role per clone after `npm run init` (or `--role=… --port=…`).
- Federated remote expose uses `FederatedRemoteApp` (`embedded?: boolean`);
  when embedded, host owns document theme / PWA. Remote sample UI lives in
  `features/demoRemote` (not `features/demo`). Host and remotes share
  singleton `react`, `react-dom`, and `react-router` so embedded routes update
  the host address bar under `/app/:alias/*` (nested hybrid→leaf:
  `/app/<hybrid>/<leaf>/…`).
- Init does not prune/restore `src/` **by default**; sample assets for host,
  demo, demoRemote, and demoHybrid coexist under `src/`. Opt-in prune:
  post-init TTY prompt, `--prune-other-roles`, or `npm run prune-other-roles`
  (also removes starter Speckit feature folders under `specs/`).
  Prefer not switching roles on the same clone.

## Styling & UI

- Design tokens in `src/styles/tokens.css`; no mandatory third-party UI kit.
- Prefer `var(--…)` tokens over hardcoded colors/spacing for themeable UI.
- Co-locate component styles (`*.module.scss`) and unit tests next to sources.
- Avoid new inline style objects for themeable surfaces; use CSS modules +
  tokens. See [ui-context.md](./ui-context.md).

## Lint & format

- ESLint flat config: `eslint.config.mjs` (TypeScript + React Hooks +
  Prettier via `eslint-plugin-prettier`).
- Prettier: `.prettierrc.json` / `.prettierignore`.
- Scripts: `npm run lint`, `npm run lint:fix`, `npm run format`,
  `npm run format:check`.
- Editor format-on-save: Cursor/VS Code via committed
  `.vscode/settings.json` + recommended Prettier/ESLint extensions
  (see README “Format on save”).

## Testing

- Unit: Jest + Testing Library, co-located (`*.test.tsx`).
- Contract: `tests/contract/`.
- E2E / a11y / compose: Playwright (`npm run test:e2e`, `test:a11y`,
  `test:compose`).
- Assert **user-visible behavior**, not implementation details.
- Mock boundaries (`features/*/api`, hooks, federation loaders) — not DOM
  internals.
- If Playwright reports a missing browser executable:

  ```bash
  npx playwright install chromium
  ```

## Anti-patterns

- Do **not** hardcode API path strings or hostnames in UI; use `apiRoutes` /
  path helpers + `apiUrl()` and `API_BASE_URL`.
- Do **not** bypass `httpClient` helpers for new feature APIs without a clear
  reason.
- Do **not** call APIs from presentational component `useEffect`.
- Do **not** invent undocumented globals for host/embed detection; use
  `embedded={true}` on federated exposes.
- Do **not** use `JSON.parse(JSON.stringify(...))` for new state-copy logic.
- Do **not** leave broad `console.log` in production paths.
- Prefer minimal, incremental changes over broad rewrites.
