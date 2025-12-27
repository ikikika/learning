# Starter MFE

In-repo React starter initialized as exactly one of `standalone` | `host` |
`remote` | `hybrid` (Webpack Module Federation). Topology: shell (host) →
hybrid → leaf remotes. Multi-repo: one role per clone.

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

Ports are empty in `.env` until init. Required port (flag or prompt) writes the role’s `PORT_*` key. Optional `PORT` overrides the current role’s port for one process. Each host remote uses its `urlEnv` (sample: `DEMO_REMOTE_URL`). `API_BASE_URL` is injected into the app for HTTP calls (`src/core/constants/app.ts`).

Init flags (optional on a TTY — missing values are prompted):

| Flag | Purpose |
|------|---------|
| `--role` | `standalone` \| `host` \| `remote` \| `hybrid` (required in CI / non-TTY) |
| `--port` | Dev-server port `1`–`65535` (required in CI / non-TTY; writes role `PORT_*` in `.env`) |
| `--name` | App name → metadata, MF container name, and (when set) `package.json` `"name"` |
| `--remote` | Host or hybrid, repeatable: `alias:name[:expose[:urlEnv]]`. Builds `remotes[]` in `starter.role.json`. Omit for an empty composer |
| `--remote-name` | Host or hybrid shorthand for one `demoRemote:<name>` entry (not with `--remote`) |
| `--force` | Required to re-init when `starter.role.json` exists |

Example multi-repo naming:

```bash
# remote (leaf) clone
npm run init -- --role=remote --port=3002 --name=checkout
# prints an add-remote command to run in the host or hybrid clone

# hybrid clone — team shell; prints add-remote for the parent host
npm run init -- --role=hybrid --port=3003 --name=demo-hybrid

# host clone — start with no remotes, or pass one or more
npm run init -- --role=host --port=3001 --name=host
npm run init -- --role=host --port=3001 --name=host --force \
  --remote=demoRemote:checkout \
  --remote=billingRemote:billing:./Billing:BILLING_REMOTE_URL
```

With no `--remote` / `--remote-name`, host/hybrid `remotes[]` is empty — the left nav shows only welcome content. After init, add remotes one at a time:

```bash
npm run add-remote -- --alias=demoRemote --name=demoRemote --port=3002 \
  --props='{"title":"From Host A"}'
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

`add-remote` is **host or hybrid only** (other roles exit non-zero, no writes). Duplicate aliases are rejected. On a TTY, `npm run add-remote` with missing required flags prompts one-by-one (alias → port/url → name → expose → federation name → url env → optional props). Restart the composer after add so the webpack remotes map and baked `__STARTER_REMOTE_PROPS__` refresh. Later prop changes in v1: hand-edit `remoteProps` in `starter.role.json`, then restart.

Webpack registers each alias you add; `src/app/remotes/loaders.generated.ts` gets a static import per alias. Host/hybrid left nav lists each remote from `REMOTE_SLOTS`; selecting one mounts it via `<LoadRemote alias="…" />` in the right panel (composer props + `embedded={true}`).

Re-init: `npm run init -- --role=host --port=3001 --name=host --force` (requires `--force` when `starter.role.json` exists).

## Roles

| Role | Behavior |
|------|----------|
| `standalone` | Single app; demo home; no MF remotes/exposes |
| `host` | Shell; optional remote/hybrid slot(s) with `embedded={true}`; remotes map + generated loaders (empty until `--remote` or `add-remote`) |
| `remote` | Dual-mode leaf: `demoRemote` routes (`/route-1`, `/route-2`) + federated PascalCase expose → `FederatedRemoteApp.tsx` |
| `hybrid` | Intermediate shell: `demoHybrid` chrome (`demo-hybrid-header-band`) + remotes map + federated expose → `FederatedHybridApp.tsx`; prints host `add-remote` snippet; `add-remote` for child modules |

Init only writes `starter.role.json`, README, `.env` port, optional `package.json` name, and (host/hybrid) `loaders.generated.ts`. It does **not** prune or restore `src/` — keep one role per clone; avoid switching.

## Public federated expose

- Expose key: PascalCase of init `--name` (e.g. `my-checkout` → `./MyCheckout`)
- Remote module: `src/app/FederatedRemoteApp.tsx` (default + named export; accepts `embedded?: boolean` and optional sample `title?: string`; nested under shell compose mount from `routePaths` — `/app/:alias/*`, or `/app/<hybrid>/<leaf>/…` when the shell mounts a hybrid)
- Hybrid module: `src/app/FederatedHybridApp.tsx` (contract `1.0.0`; `embedded={true}` suppresses hybrid theme toggle; keeps hybrid chrome in-boundary including `demo-hybrid-header-band`)
- Composer MUST pass `embedded={true}` when mounting (LoadRemote does this; bag cannot override)
- Providers / PWA apply on own-app entry (`App.tsx` + role routes), not via the federated expose
- Hybrid sample: `src/features/demoHybrid` (nav+panel, distinct from host)
- Sample feature `src/features/demo` remains the **standalone** home demo (contract version **`1.0.0`**)
- Published npm contract package is **deferred** (not required in v1)

### Renaming the expose

Re-init remote/hybrid with a new `--name` (and `--force`); update composer `remotes[].expose` to match.

## Theming & PWA

- Tokens: `src/styles/tokens.css` (no third-party UI kit)
- First visit: `prefers-color-scheme` → fallback `light`
- Toggle persists in `localStorage`; reload keeps theme
- “Use system theme” clears persistence
- Outermost shell owns document theme + PWA when composing; embedded hybrid/remote do not take over (hybrid suppresses its own theme toggle when `embedded={true}`)
- PWA: `public/manifest.webmanifest`, `public/icons/`, Workbox via `workbox-webpack-plugin`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run init` | Role init (prompts on TTY; use `--role` / `--port` in CI) |
| `npm run add-remote` | Host or hybrid: append one remote (+ optional `--props`); prompts on TTY when flags omitted; restart composer after |
| `npm start` / `npm run build` | Dev / production |
| `npm test` | Jest unit tests + contract tests |
| `npm run test:e2e` | Per-role Playwright (incl. hybrid) |
| `npm run test:compose` | Compose harness: host+remote, shell+hybrid, hybrid+leaf |
| `npm run test:a11y` | WCAG 2.2 AA (axe) for standalone/host/remote/hybrid; fails on violations |

If Playwright fails with “Executable doesn't exist” / “Looks like Playwright was just installed”, download browsers once:

```bash
npx playwright install chromium
```

## Responsive

Primary flows verified at phone-width (~375px) across standalone, host, remote-standalone, and hybrid without primary horizontal scroll. Full three-process shell→hybrid→leaf CI is deferred; pair covers run via `test:compose`.

Dev note: webpack `publicPath` is absolute in development so refreshing nested host URLs (e.g. `/app/demoRemote/route-1` or `/app/demoHybrid/demoRemote/route-1`) still loads host chunks correctly.

## Performance

Interactive demo under ~2s on broadband is **aspirational** only (not a hard CI gate).
