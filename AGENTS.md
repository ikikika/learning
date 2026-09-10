# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is

This is **not a single product**. It is a large learning/tutorial monorepo: a
collection of ~60 independent sample projects grouped by technology under
top-level folders (`angular/`, `express/`, `js/`, `knapsack/`, `mfe/`,
`nextjs/`, `py/`, `python/`, `react/`, `rn/`, `vue/`). There is **no root
`package.json`, workspace config, or orchestration** — `readme1.md` at the root
is empty. Each subproject is self-contained and set up / run on its own.

### Toolchain (already present on the VM)

- Node.js v22 + npm 10 (npm is the package manager — every Node project has a
  `package-lock.json`; use `npm install`, not yarn/pnpm).
- Python 3.12 + pip (only used by `python/plotly-dash`).

### How dependencies work (important)

There is **no shared dependency install**. Install per project on demand from
that project's directory, e.g.:

```bash
cd nextjs/routing && npm install       # any Node project
cd python/plotly-dash && pip install -r requirements.txt
```

The startup update script only pre-installs the reference demo app
(`nextjs/routing`) so at least one app is immediately runnable. When you work on
a different subproject, run `npm install` in that project's folder yourself.

### Reference demo app: `nextjs/routing`

A Next.js 13 "events" app (pages router) that is verified to install, lint,
build, and run on this VM. Standard scripts from its `package.json`:

- `npm run dev` – dev server on port `3000`
- `npm run lint`
- `npm run build`

### Running other projects (per-project standard commands)

Use each project's own `package.json` scripts / README. Common patterns:

- Angular (`angular/*`): `npm start` / `ng serve` → port `4200`
- React CRA (`react/*`): `npm start` → port `3000`
- Next.js (`nextjs/*`): `npm run dev` → port `3000`
- Vue (`vue/*`): `npm run serve` → port `8080`
- Express (`express/*`): `npm start` (usually TypeScript, compiled to `dist/`)

### Non-obvious gotchas

- Some backends read `process.env.PORT` **with no fallback** and will fail to
  bind unless `PORT` is set (e.g. `express/natoursapi`,
  `js/multiplayer-game-01/server`).
- `express/natoursapi` requires **MongoDB** plus a `config.env` with
  `DATABASE`, `DATABASE_PASSWORD`, `JWT_SECRET`, etc. No `.env`/`config.env` is
  committed anywhere in the repo.
- Multi-service projects must run several dev servers together to work
  end-to-end: `mfe/project2` (container 8080 + marketing 8081 + auth 8082 +
  dashboard 8083), `mfe/ecomm1` (container 8080 + products 8081 + cart 8082),
  `js/react-socket` (server 3001 + client 3000), `js/multiplayer-game-01`
  (server + client 3000), `react/testing2/sundaes-on-demand` (client +
  `sundae-server`), `rn/donationapp` (+ `rn/donationapp-server`).
- `python/plotly-dash/requirements.txt` pins very old (Python-2-era) versions
  and will likely need version bumps to install on Python 3.12.
- The many `bootstrap.js` files under `mfe/*` are Webpack Module Federation
  entry points, **not** setup scripts.
