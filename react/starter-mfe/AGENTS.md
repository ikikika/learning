# AGENTS.md

Instructions for AI coding agents and automated contributors working in this
repository. Humans should follow the same rules; full detail lives under `docs/`.

## Before changing code

1. Read [docs/project-overview.md](./docs/project-overview.md) for product intent
   (what / who / flows / out of scope) when relevant.
2. Read [docs/coding-conventions.md](./docs/coding-conventions.md) for code
   structure and data-fetching rules.
3. Read [docs/ui-context.md](./docs/ui-context.md) before changing UI, tokens,
   theming, or shared components.
4. For role / MFE / layout principles, see
   [`.specify/memory/constitution.md`](./.specify/memory/constitution.md).
5. Prefer matching existing patterns under `src/features/demo/` (standalone)
   or `src/features/demoRemote/` (remote) when adding features.

## Must follow

- Do **not** hardcode API paths in components — use `apiRoutes` + `apiUrl()`.
- Do **not** call APIs in a component `useEffect` — use `features/*/api` +
  `features/*/hooks`; components render from hooks/props only.
- Put `API_BASE_URL` and ports in `.env` (not hardcoded in UI code).
- Prefer design tokens (`var(--…)`) over hardcoded colors/spacing; see
  `docs/ui-context.md`.
- Keep federated Demo suppression via `embedded={true}` on the Demo module;
  do not invent undocumented globals for host detection.
- Prefer one role per clone; init does not prune/restore `src/` (no
  `templates/role-assets`).
- Do not commit secrets; `.env` is gitignored — update `.env.example` when
  adding new env keys.
- Do not create commits unless the user explicitly asks.

## Quick pointers

| Concern | Location |
|---------|----------|
| Product overview | `docs/project-overview.md` |
| Coding conventions | `docs/coding-conventions.md` |
| UI / tokens / components | `docs/ui-context.md` |
| Constitution | `.specify/memory/constitution.md` |
| API routes | `src/core/constants/apiRoutes.ts` |
| HTTP client | `src/services/httpClient.ts` |
| Env injection | `scripts/load-env.cjs`, `config/webpack.*.js` |
| Sample feature (standalone) | `src/features/demo/` |
| Sample feature (remote) | `src/features/demoRemote/` |
