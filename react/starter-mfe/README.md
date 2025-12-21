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
npm run init           # interactive prompts for role, name, port
# or: npm run init -- --role=standalone --port=3000 --name=my-app
npm start
```

Ports are empty in `.env` until init. Required port (flag or prompt) writes the role’s `PORT_*` key. Optional `PORT` overrides the current role’s port for one process. Each shell remote uses its `urlEnv` (sample: `DEMO_REMOTE_URL`). `API_BASE_URL` is injected into the app for HTTP calls (`src/core/constants/app.ts`).

Init flags (optional on a TTY — missing values are prompted):

| Flag | Purpose |
|------|---------|
| `--role` | `standalone` \| `shell` \| `remote` (required in CI / non-TTY) |
| `--port` | Dev-server port `1`–`65535` (required in CI / non-TTY; writes role `PORT_*` in `.env`) |
| `--name` | App name → metadata, MF container name, and (when set) `package.json` `"name"` |
| `--remote` | Shell only, repeatable: `alias:name[:expose[:urlEnv]]`. Builds `remotes[]` in `starter.role.json`. Omit for an empty host (no remotes) |
| `--remote-name` | Shell only shorthand for one `demoRemote:<name>` entry (not with `--remote`) |
| `--force` | Required to re-init when `starter.role.json` exists |

Example multi-repo naming:

```bash
# remote clone
npm run init -- --role=remote --port=3002 --name=checkout
# prints a remotes[] object + --remote=… flag to paste into the shell

# shell clone — start with no remotes, or pass one or more
npm run init -- --role=shell --port=3001 --name=host
npm run init -- --role=shell --port=3001 --name=host --force \
  --remote=demoRemote:checkout \
  --remote=billingRemote:billing:./Billing:BILLING_REMOTE_URL
```

With no `--remote` / `--remote-name`, shell `remotes[]` is empty — the left nav shows only “Shell” welcome content. After shell init, add remotes one at a time:

```bash
npm run add-remote -- --alias=demoRemote --name=demoRemote --port=3002 \
  --props='{"title":"From Shell A"}'
# or: --url=http://127.0.0.1:3002/remoteEntry.js
```

| Flag | Purpose |
|------|---------|
| `--alias` | Required. Webpack remotes map key / nav slot id |
| `--url` / `--port` | Exactly one. Absolute remoteEntry URL, or local port → `http://$DEV_HOST:$port/remoteEntry.js` |
| `--name` | Optional (default alias). Remote app name |
| `--expose` | Optional (default PascalCase of name) |
| `--federation-name` | Optional (default from name) |
| `--url-env` | Optional (default from alias, e.g. `DEMO_REMOTE_URL`) |
| `--props` | Optional JSON object → `starter.role.json` `remoteProps[alias]` |

`add-remote` is **shell-only** (non-shell exits non-zero, no writes). Duplicate aliases are rejected. On a TTY, `npm run add-remote` with missing required flags prompts one-by-one (alias → port/url → name → expose → federation name → url env → optional props). Restart the shell after add so the webpack remotes map and baked `__STARTER_REMOTE_PROPS__` refresh. Later prop changes in v1: hand-edit `remoteProps` in `starter.role.json`, then restart.

Webpack registers each alias you add; `src/app/remotes/loaders.generated.ts` gets a static import per alias. The shell left nav lists each remote from `REMOTE_SLOTS`; selecting one mounts it via `<LoadRemote alias="…" />` in the right panel (host props + `embedded={true}`).

Re-init: `npm run init -- --role=shell --port=3001 --name=host --force` (requires `--force` when `starter.role.json` exists).

## Roles

| Role | Behavior |
|------|----------|
| `standalone` | Single app; demo home; no MF remotes/exposes |
| `shell` | Host; optional remote slot(s) with `embedded={true}`; remotes map + generated loaders (empty until `--remote` or `add-remote`) |
| `remote` | Dual-mode: `demoRemote` routes (`/route-1`, `/route-2`) + federated PascalCase expose → `FederatedRemoteApp.tsx` |

Init only writes `starter.role.json`, README, `.env` port, optional `package.json` name, and (shell) `loaders.generated.ts`. It does **not** prune or restore `src/` — keep one role per clone; avoid switching.

## Public federated expose

- Expose key: PascalCase of init `--name` (e.g. `my-checkout` → `./MyCheckout`)
- Module: `src/app/FederatedRemoteApp.tsx` (default + named export; accepts `embedded?: boolean` and optional sample `title?: string`; nested under shell `/remote/:alias/*` so in-panel links update the address bar)
- Shell MUST pass `embedded={true}` when mounting (LoadRemote does this; bag cannot override)
- Providers / PWA apply only on the remote **own-app entry** (`App.tsx` + `remoteRoutes`), not via the federated expose
- Remote sample: `src/features/demoRemote` with Route 1 / Route 2 and a small in-remote link between them; Route 1 shows host `title` when provided (`data-testid="demo-remote-host-title"`)
- Sample feature `src/features/demo` remains the **standalone** home demo (contract version **`1.0.0`**)
- Published npm contract package is **deferred** (not required in v1)

### Renaming the expose

Re-init remote with a new `--name` (and `--force`); update shell `remotes[].expose` to match.

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
| `npm run init` | Role init (prompts on TTY; use `--role` / `--port` in CI) |
| `npm run add-remote` | Shell only: append one remote (+ optional `--props`); prompts on TTY when flags omitted; restart shell after |
| `npm start` / `npm run build` | Dev / production |
| `npm test` | Jest unit tests + contract tests |
| `npm run test:e2e` | Per-role Playwright |
| `npm run test:compose` | Two-workspace shell+remote compose smoke |
| `npm run test:a11y` | WCAG 2.2 AA (axe); fails on violations |

If Playwright fails with “Executable doesn't exist” / “Looks like Playwright was just installed”, download browsers once:

```bash
npx playwright install chromium
```

## Responsive

Primary flows verified at phone-width (~375px) across standalone, shell, and remote-standalone without primary horizontal scroll.

Dev note: webpack `publicPath` is absolute in development so refreshing nested shell URLs (e.g. `/remote/demoRemote/route-1`) still loads host chunks correctly.

## Performance

Interactive demo under ~2s on broadband is **aspirational** only (not a hard CI gate).
