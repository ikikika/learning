# Quickstart: Hybrid Role Scaffold

**Feature**: `005-hybrid-role-scaffold`  
**Date**: 2026-08-02

Validation scenarios after implementation. Prefer contract tests + Playwright over manual-only checks. See [contracts/](./contracts/) and [data-model.md](./data-model.md).

## Prerequisites

- Node ≥20, `npm install`
- Clean or `--force` init allowed on the clone under test
- For pair compose: `npm run test:compose` (runs host+remote, shell+hybrid, hybrid+leaf)

## V1 — Hybrid init + standalone smoke

```bash
cp .env.example .env   # if needed
npm run init -- --role=hybrid --port=3003 --name=demo-hybrid
# Expect: starter.role.json role=hybrid, expose + remotes:[], PORT_HYBRID=3003
# Expect stdout: "In your host clone, run:" + npm run add-remote -- ...
npm start
```

**Expect**:

- Hybrid chrome loads (`demo-hybrid-home-page`, `demo-hybrid-header-band`); empty child state usable
- Distinct from host sample (tokens/branding + header band)
- Theme toggle works; `data-theme` behaves like other own-app roles
- Phone-width (~375px): no primary horizontal scroll
- PWA / offline banner same as other own-app roles

**Automated**: `tests/contract/init-cli.test.mjs` (hybrid + snippet); `tests/integration/hybrid.spec.ts`; `npm run test:a11y` (hybrid role)

## V2 — Hybrid + leaf pair

```bash
npm run test:compose -- --mode=hybrid-leaf
# or full: npm run test:compose
```

**Expect**: child mounts inside hybrid chrome; fallback when leaf down; hybrid interactive.

**Automated**: `tests/integration/compose-hybrid-leaf.spec.ts` via compose harness

## V3 — Shell + hybrid pair

```bash
npm run test:compose -- --mode=shell-hybrid
```

**Expect**: shell owns document theme; hybrid theme toggle suppressed; `demo-hybrid-header-band` visible in panel.

**Automated**: `tests/integration/compose-shell-hybrid.spec.ts`

## V4 — add-remote role gate

```bash
# On standalone or remote clone:
npm run add-remote -- --alias=x --port=3002 --name=x
# Expect: non-zero, no writes

# On host and hybrid: valid flags succeed
```

**Automated**: `tests/contract/add-remote-cli.test.mjs`

## V5 — Non-regression

Re-run existing standalone, host, remote-standalone smokes and host compose as today (`npm run test:e2e`, `npm run test:compose -- --mode=host-remote`).

**Expect**: SC-007 — no intentional regressions.

## Out of scope for v1 quickstart

- Full three-process shell→hybrid→leaf in one CI job (deferred; pairs above cover edges)
- Auth / monorepo packaging
