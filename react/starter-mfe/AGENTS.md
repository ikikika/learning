# AGENTS.md

Instructions for AI coding agents and automated contributors working in this
repository. Humans should follow the same rules; full detail lives under `docs/`.
If generic React or agent-skill advice conflicts with this repo’s docs, follow
the repo docs.

## Before changing code

1. Read [docs/project-overview.md](./docs/project-overview.md) for product intent
   (what / who / flows / out of scope) when relevant.
2. Read [docs/coding-conventions.md](./docs/coding-conventions.md) for code
   structure and data-fetching rules.
3. Read [docs/ui-context.md](./docs/ui-context.md) before changing UI, tokens,
   theming, or shared components.
4. For role / MFE / layout principles, see
   [`.specify/memory/constitution.md`](./.specify/memory/constitution.md).
5. Prefer matching existing patterns under `src/features/demo/` (standalone),
   `src/features/demoHost/` (host), `src/features/demoRemote/` (remote), or
   `src/features/demoHybrid/` (hybrid) when adding features.

## Must follow

- Do **not** hardcode API paths in components — use `apiRoutes` /
  path helpers (e.g. `postByIdPath`) + `apiUrl()`.
- Do **not** hardcode app URL path segments — use `routePaths` /
  `composeChildPath` / `remoteSiblingPath`.
- Do **not** call APIs in a component `useEffect` — use `features/*/api` +
  `features/*/hooks`; components render from hooks/props only.
- Put `API_BASE_URL` and ports in `.env` (not hardcoded in UI code).
- Prefer design tokens (`var(--…)`) over hardcoded colors/spacing; see
  `docs/ui-context.md`.
- Prefer one role per clone (`standalone` | `host` | `remote` | `hybrid`);
  init does not prune/restore `src/` **by default**. Opt-in:
  post-init TTY prompt, `--prune-other-roles`, or `npm run prune-other-roles`
  (also removes starter Speckit feature folders under `specs/`;
  no restore — re-clone the starter if needed).
- Host or hybrid: use `npm run add-remote` to append remotes and optional
  `remoteProps`; restart afterward. Per-alias props bake via
  `__STARTER_REMOTE_PROPS__` / `getRemoteProps` in `remotes.ts`.
- Keep federated suppression via `embedded={true}` on remote/hybrid exposes;
  do not invent undocumented globals for host detection. Hybrid keeps chrome
  (`demo-hybrid-header-band`) in its mount boundary and suppresses its theme
  toggle when embedded.
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
| Init / prune | `scripts/init.mjs`, `scripts/prune-other-role-samples.mjs` |
| API routes | `src/core/constants/apiRoutes.ts` |
| App URL paths | `src/core/constants/routePaths.ts` |
| HTTP client | `src/services/httpClient.ts` |
| Env injection | `scripts/load-env.cjs`, `config/webpack.*.js` |
| Sample feature (standalone) | `src/features/demo/` |
| Sample feature (host) | `src/features/demoHost/` |
| Sample feature (remote) | `src/features/demoRemote/` |
| Sample feature (hybrid) | `src/features/demoHybrid/` |
