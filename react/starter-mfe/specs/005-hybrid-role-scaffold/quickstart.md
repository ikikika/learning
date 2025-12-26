# Quickstart: Hybrid Role Scaffold

**Feature**: `005-hybrid-role-scaffold`  
**Date**: 2026-08-02

Validation scenarios after implementation. Prefer contract tests + Playwright over manual-only checks. See [contracts/](./contracts/) and [data-model.md](./data-model.md).

## Prerequisites

- Node ≥20, `npm install`
- Clean or `--force` init allowed on the clone under test
- For pair compose: ability to run two temp workspaces (pattern: existing `compose-harness`)

## V1 — Hybrid init + standalone smoke

```bash
cp .env.example .env   # if needed
npm run init -- --role=hybrid --port=3003 --name=demo-hybrid
# Expect: starter.role.json role=hybrid, expose + remotes:[], PORT_HYBRID=3003
# Expect stdout: "In your host clone, run:" + npm run add-remote -- ...
npm start
```

**Expect**:
- Hybrid chrome loads (nav+panel); empty child state usable
- Distinct from host sample (tokens/branding + layout cue / test id)
- Theme toggle works; `data-theme` behaves like other own-app roles
- Phone-width (~375px): no primary horizontal scroll
- PWA artifacts present (manifest / SW registration path)

**Automated**: `tests/contract/init-cli.test.mjs` (hybrid + snippet); `tests/integration/hybrid.spec.ts`

## V2 — Hybrid + leaf pair

```bash
# Workspace A: hybrid (from V1 or harness)
# Workspace B: remote leaf
npm run init -- --role=remote --port=3002 --name=demo-remote   # in leaf clone

# In hybrid clone:
npm run add-remote -- --alias=demoRemote --name=demo-remote --port=3002 \
  --expose=./DemoRemote --federation-name=demoRemote --url-env=DEMO_REMOTE_URL
# Restart hybrid; start leaf
```

**Expect**:
- Child appears in hybrid nav; selecting it mounts with hybrid chrome visible
- Leaf gets `embedded={true}` (no document theme takeover by leaf)
- Stop leaf → hybrid shows fallback within ~3s; hybrid nav still works

**Automated**: hybrid+leaf compose pair (new harness/spec)

## V3 — Shell + hybrid pair

```bash
# Workspace A: host/shell
npm run init -- --role=host --port=3001 --name=shell
# Workspace B: hybrid (running on 3003)
# In host: paste add-remote snippet from hybrid init (or equivalent flags)
# Restart host; start hybrid
```

**Expect**:
- Host slot loads hybrid with `embedded={true}`
- Host owns document `data-theme` / PWA install UX
- Hybrid theme toggle **not** visible; hybrid chrome still visible in panel
- Stop hybrid → host fallback; host nav still works

**Automated**: shell+hybrid compose pair (new harness/spec)

## V4 — add-remote role gate

```bash
# On standalone or remote clone:
npm run add-remote -- --alias=x --port=3002 --name=x
# Expect: non-zero, no writes

# On host and hybrid: valid flags succeed (host regression + hybrid path)
```

**Automated**: `tests/contract/add-remote-cli.test.mjs`

## V5 — Non-regression

Re-run existing standalone, host, remote-standalone smokes and host compose as today.

**Expect**: SC-007 — no intentional regressions.

## Out of scope for v1 quickstart

- Full three-process shell→hybrid→leaf in one CI job (deferred; pairs above cover edges)
- Auth / monorepo packaging
