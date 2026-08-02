# Quickstart: Validate host add-remote

**Feature**: `004-host-add-remote`  
**Goal**: Prove incremental remote registration, per-alias props, and non-regression for standalone/remote.

## Prerequisites

- Node ≥20, dependencies installed (`npm ci` / `npm install`)
- Two terminals available (host + at least one remote), or reuse compose harness patterns
- Chromium for Playwright if running e2e

See also: [add-remote-cli.md](./contracts/add-remote-cli.md), [remote-host-props.md](./contracts/remote-host-props.md), [data-model.md](./data-model.md)

## 1. Host-only gate

```bash
# On a standalone or remote init clone — must fail, no remotes mutation
npm run add-remote -- --alias=demoRemote --port=3002
```

**Expect**: Non-zero exit; clear role error; `starter.role.json` remotes unchanged.

## 2. Register first remote (empty remotes[])

```bash
npm run init -- --role=host --port=3001 --force
# Start a remote app elsewhere on 3002 with matching expose, or use a second clone:
#   npm run init -- --role=remote --port=3002 --name=demoRemote --force && npm start

npm run add-remote -- --alias=demoRemote --name=demoRemote --port=3002 --props='{"title":"From Host A"}'
```

**Expect**:

- `starter.role.json` has one remotes[] entry + `remoteProps.demoRemote.title`
- `.env` has `DEMO_REMOTE_URL=http://127.0.0.1:3002/remoteEntry.js` (or DEV_HOST)
- `loaders.generated.ts` contains `demoRemote`
- CLI prints restart hint

Restart host (`npm start`), open host, click remote nav → panel shows Route 1 and visible host title **From Host A** (`demo-remote-host-title` or equivalent).

## 3. Register second remote

```bash
npm run add-remote -- --alias=billingRemote --name=billing --port=3003 --props='{"title":"Billing Slot"}'
```

**Expect**: Both aliases in remotes[] and nav; selecting each shows its own title only (SC-006).

## 4. Hand-edit props

Edit `starter.role.json` → `remoteProps.demoRemote.title` to a new string; restart host; reopen demo remote → new title visible without re-add.

## 5. Stale props ignored

Add `remoteProps.orphanAlias: { "title": "x" }` without registering `orphanAlias`; host still starts; registered remotes load.

## 6. Internal routes

With remote open in panel, exercise remote-owned Route 2 (MemoryRouter / remote-internal navigation as implemented) → content switches; host chrome remains.

## 7. Non-regression

```bash
npm test
# role-appropriate e2e as in README
npm run test:e2e   # or project scripts for standalone / remote-standalone / host
```

**Expect**: Existing standalone home/demo and remote-as-own-app (no host title required) still pass.

## Contract tests (CI-friendly)

```bash
node --test tests/contract/add-remote*.test.mjs
```

**Expect**: Role gate, duplicate alias, url/port validation, successful write shape for meta/env/loaders.
