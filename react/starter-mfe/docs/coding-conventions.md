# Coding conventions

Source of truth for contributor and agent coding standards in this repository.
Keep this file IDE- and agent-agnostic (plain Markdown).

Higher-level product/architecture principles live in
[`.specify/memory/constitution.md`](../.specify/memory/constitution.md).

## Data fetching

- **Do not hardcode API paths** in components. Define routes in
  `src/core/constants/apiRoutes.ts` and build full URLs with `apiUrl()` from
  `src/services/httpClient.ts`.
- **Do not call APIs inside presentational components** (including via
  `useEffect` in the component body). Prefer:
  - `src/features/<feature>/api/` — pure request functions (e.g. `getPost`)
  - `src/features/<feature>/hooks/` — hooks that own loading/error state
  - Components — consume hooks/props and render UI only
- **Base URL** comes from `.env` (`API_BASE_URL`), injected at build time via
  webpack `DefinePlugin` into `src/core/constants/app.ts`. Restart `npm start`
  after changing `.env`.

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

## Environment & ports

- Ports and remote URLs: `.env` / `.env.example` (`PORT_*`, `DEV_HOST`,
  per-remote `*_REMOTE_URL` / `urlEnv`, `API_BASE_URL`).
- Shell remotes: `starter.role.json` → `remotes[]`; see `src/core/constants/remotes.ts`
  and `src/app/remotes/loadRemote.tsx`.
- Loader: `scripts/load-env.cjs` (used by webpack and Node scripts).

## Module Federation / roles

- One role per clone after `npm run init -- --role=…`.
- Federated `./Demo` uses `embedded?: boolean`; when `embedded={true}`, Demo
  must not take over document theme or service worker registration.
- Symmetric prune/restore via `templates/role-assets/{demo,shell}/` — never
  delete templates from init.

## Styling & UI

- Design tokens in `src/styles/tokens.css`; no mandatory third-party UI kit.
- Co-locate component styles (`*.module.scss`) and unit tests next to sources.

## Testing

- Unit: Jest + Testing Library, co-located (`*.test.tsx`).
- Contract: `tests/contract/`.
- E2E / a11y / compose: Playwright (`npm run test:e2e`, `test:a11y`,
  `test:compose`).
- If Playwright reports a missing browser executable:

  ```bash
  npx playwright install chromium
  ```
