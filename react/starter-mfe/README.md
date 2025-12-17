# Starter MFE

In-repo React starter initialized as exactly one of `standalone` | `shell` | `remote` (Webpack Module Federation). Multi-repo topology: one role per clone.

**Docs**

| Doc | Role |
|-----|------|
| [docs/project-overview.md](./docs/project-overview.md) | Product what / who / flows / out of scope |
| [docs/coding-conventions.md](./docs/coding-conventions.md) | Code structure & data-fetching conventions |
| [docs/ui-context.md](./docs/ui-context.md) | Tokens, theming, component & UI guidance |
| [AGENTS.md](./AGENTS.md) | Short checklist for AI agents |

After a design or coding session that locks new decisions, update the matching docs (e.g. ask the agent: “Update `docs/coding-conventions.md`, `docs/ui-context.md`, `docs/project-overview.md`, and/or `AGENTS.md` with the decisions from this session.”).

<!-- ROLE:START -->
**Active role:** `remote`

Start: `npm start` (after `npm install`)
<!-- ROLE:END -->

## Quick start

```bash
cp .env.example .env   # if needed
npm install
npm run init -- --role=standalone --name=my-app
npm start
```

Ports come from `.env` (`PORT_STANDALONE` / `PORT_SHELL` / `PORT_REMOTE`). Defaults: 3000 / 3001 / 3002. Optional `PORT` overrides the current role’s port. Each shell remote uses its `urlEnv` (sample: `DEMO_REMOTE_URL`). `API_BASE_URL` is injected into the app for HTTP calls (`src/core/constants/app.ts`).

Init flags:

| Flag | Purpose |
|------|---------|
| `--role` | `standalone` \| `shell` \| `remote` (required) |
| `--name` | App name → metadata, MF container name, and (when set) `package.json` `"name"` |
| `--remote` | Shell only, repeatable: `alias:name[:expose[:urlEnv]]`. Builds `remotes[]` in `starter.role.json` |
| `--remote-name` | Shell only shorthand for one `demoRemote:<name>` entry (not with `--remote`) |
| `--force` | Required to re-init when `starter.role.json` exists |

Example multi-repo naming:

```bash
# remote clone
npm run init -- --role=remote --name=checkout

# shell clone — one or more remotes
npm run init -- --role=shell --name=host \
  --remote=demoRemote:checkout \
  --remote=billingRemote:billing:./Billing:BILLING_REMOTE_URL
```

`starter.role.json` then contains a `remotes[]` array. Webpack registers each alias; `src/app/remotes/loaders.generated.ts` gets a static import per alias. Mount extras with `<LoadRemote alias="billingRemote" />` (sample home still uses `demoRemote` via `LoadDemoRemote`).

Re-init: `npm run init -- --role=shell --name=host --force` (requires `--force` when `starter.role.json` exists).

## Roles

| Role | Behavior |
|------|----------|
| `standalone` | Single app; demo home; no MF remotes/exposes |
| `shell` | Host; one `./Demo` slot with `embedded={true}`; remotes map; prunes live demo + HomePage |
| `remote` | Dual-mode: standalone demo + federated `./Demo` expose |

## Symmetric prune / restore

Templates mirror `src/` under `templates/role-assets/demo/` and `templates/role-assets/shell/`. Init never deletes templates. Restore is a straight copy into matching `src/` paths (git checkout alone is not sufficient).

- **shell**: prune `src/features/demo`, `src/pages/HomePage`; restore shell assets from `templates/role-assets/shell/`
- **standalone / remote**: prune shell-only live assets; restore demo + HomePage from `templates/role-assets/demo/`

## Public `./Demo` API

- Module: `src/features/demo` (`index.ts`)
- Props: `embedded?: boolean` — shell MUST pass `embedded={true}`
- When `embedded={true}`, the **Demo module** does not apply document `data-theme` or register a competing service worker
- Remote bootstrap `ThemeProvider` / `registerPwa` apply only for the remote **standalone entry**
- Contract version: **`1.0.0`**
- Published npm contract package is **deferred** (not required in v1)

### Renaming `./Demo`

Update Webpack `exposes`, shell remotes map, docs, exported types, `embedded?: boolean` usage, and contract version notes together.

## Theming & PWA

- Tokens: `src/styles/tokens.css` (no third-party UI kit)
- First visit: `prefers-color-scheme` → fallback `light`
- Toggle persists in `localStorage`; reload keeps theme
- “Use system theme” clears persistence
- Shell owns document theme + PWA when composing; remote embedded Demo does not take over
- PWA: `public/manifest.webmanifest`, `public/icons/`, Workbox via `workbox-webpack-plugin`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run init -- --role=…` | Role init |
| `npm start` / `npm run build` | Dev / production |
| `npm test` | Jest unit tests |
| `npm run test:e2e` | Per-role Playwright |
| `npm run test:compose` | Two-workspace shell+remote compose smoke |
| `npm run test:a11y` | WCAG 2.2 AA (axe); fails on violations |

If Playwright fails with “Executable doesn't exist” / “Looks like Playwright was just installed”, download browsers once:

```bash
npx playwright install chromium
```

## Responsive

Primary flows verified at phone-width (~375px) across standalone, shell, and remote-standalone without primary horizontal scroll.

## Performance

Interactive demo under ~2s on broadband is **aspirational** only (not a hard CI gate).
