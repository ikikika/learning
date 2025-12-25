# Quickstart: React Role Scaffold

Validation guide for `001-react-role-scaffold`. Implementation details live in
`tasks.md` / code; this file proves the feature end-to-end after implement.

## Prerequisites

- Node 20+
- Clean clone (or reset role metadata for re-runs)
- No mandatory published `@scope/*` contract package; no third-party UI kit
- Compose harness can create two temp workspaces and run two inits

## Contracts & model references

- Init CLI: [contracts/init-cli.md](./contracts/init-cli.md)
- Role file: [contracts/role-metadata.schema.json](./contracts/role-metadata.schema.json)
- `./Demo`: [contracts/remote-demo.md](./contracts/remote-demo.md)
- PWA / offline: [contracts/pwa-connectivity.md](./contracts/pwa-connectivity.md)
- Theming: [contracts/theming.md](./contracts/theming.md)
- A11y CI: [contracts/a11y-wcag.md](./contracts/a11y-wcag.md)
- Entities: [data-model.md](./data-model.md)

## Setup (per role)

```bash
npm install
npm run init -- --role=standalone --port=3000   # or host|remote with their ports
# npm run init -- --role=host --port=3001 --force
```

Expected after success:

- `starter.role.json` + README role match
- Canonical `src/` (demo, HomePage, HostHomePage, and remotes adapters may all
  coexist; init does not prune)
- If `host`: `loaders.generated.ts` regenerated; remotes map from metadata
- If `remote`: `./Demo` types + **`embedded?: boolean`** + contract version
  **`1.0.0`** documented; host `add-remote` command printed

## Local run

```bash
npm start
```

## Validation scenarios

### V1 — Standalone (P1)

1. Init `--role=standalone`.
2. Home loads; phone-width OK; PWA artifacts present; no live `HostHomePage`.
3. Offline → **internet connection required**.
4. Theme: cleared storage → system/`light`; toggle persists across **reload**;
   **Use system theme** clears.
5. CI axe (or local) AA on primary route passes or fails closed.

### V2 — Host (P2)

1. Init `--role=host` (`--force` if needed).
2. Confirm live demo + `HomePage` gone; host templates restored; demo
   templates intact.
3. Remote unreachable → fallback; **empty/invalid remote URL** → fallback.
4. Host theme: first visit + toggle + reload persistence + use-system.
5. Offline → connection-required message.
6. AA audit on host primary route in CI.

### V3 — Remote (P3)

1. Init `--role=remote`.
2. Standalone demo + PWA + theme; `./Demo` exports `embedded?: boolean` +
   `1.0.0`.
3. Offline message; AA on remote standalone primary route.
4. Confirm no live host-only sample assets.

### V4 — Init guardrails (no src prune)

1. Missing/invalid `--role` or `--port` → fail.
2. Re-init without `--force` → refuse.
3. `--force` to another role updates metadata (and host loaders) but does **not**
   delete demo/host sample paths under `src/`.

### V5 — Per-role automated smoke

```bash
npm test
npm run test:e2e   # or npx playwright test
```

Expected: for **standalone, host, and remote-standalone** — **first visit
(cleared storage) → system/`light`**, theme toggle/`data-theme`, **toggle →
reload → same `data-theme`**, use-system, viewport, offline; host also
**empty/invalid remote URL → RemoteFallback**.

### V6 — Compose smoke (required)

```bash
npm run test:compose
```

Harness creates **two temp workspaces**, inits host + remote, starts both.

Expected (SC-009/014/015/019): demo in host with `embedded={true}`; host owns
PWA + `data-theme`; Demo does not take over.

### V7 — WCAG 2.2 AA CI

```bash
npm run test:a11y   # or CI job wiring axe against primary routes
```

Expected (SC-020): pipeline fails on AA violations.

## Done when

- SC-001…SC-020 from [spec.md](./spec.md) demonstrable via V1–V7
  (~2s interactive remains aspirational; not a hard fail).
