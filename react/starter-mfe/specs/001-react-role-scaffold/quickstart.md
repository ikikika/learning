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
npm run init -- --role=standalone   # or shell | remote
# npm run init -- --role=shell --force
```

Expected after success:

- `starter.role.json` + README role match
- Canonical `src/` + `src/styles/tokens.css`
- `templates/role-assets/demo/` and `templates/role-assets/shell/` present
  (mirror `src/` paths; never deleted by init)
- If `shell`: live `src/features/demo` and `src/pages/HomePage` **absent**;
  `ShellHomePage` + remotes adapters present (from shell templates)
- If `standalone`|`remote`: live demo + `HomePage` present; live shell-only
  sample assets **absent**
- If `remote`: `./Demo` types + **`embedded?: boolean`** + contract version
  **`1.0.0`** documented

## Local run

```bash
npm start
```

## Validation scenarios

### V1 — Standalone (P1)

1. Init `--role=standalone`.
2. Home loads; phone-width OK; PWA artifacts present; no live `ShellHomePage`.
3. Offline → **internet connection required**.
4. Theme: cleared storage → system/`light`; toggle persists across **reload**;
   **Use system theme** clears.
5. CI axe (or local) AA on primary route passes or fails closed.

### V2 — Shell (P2)

1. Init `--role=shell` (`--force` if needed).
2. Confirm live demo + `HomePage` gone; shell templates restored; demo
   templates intact.
3. Remote unreachable → fallback; **empty/invalid remote URL** → fallback.
4. Shell theme: first visit + toggle + reload persistence + use-system.
5. Offline → connection-required message.
6. AA audit on shell primary route in CI.

### V3 — Remote (P3)

1. Init `--role=remote`.
2. Standalone demo + PWA + theme; `./Demo` exports `embedded?: boolean` +
   `1.0.0`.
3. Offline message; AA on remote standalone primary route.
4. Confirm no live shell-only sample assets.

### V4 — Init guardrails + symmetric restore

1. Missing/invalid `--role` → fail.
2. Re-init without `--force` → refuse.
3. `--force --role=shell` then `--force --role=remote` → demo + HomePage from
   `templates/role-assets/demo/`; shell-only live assets gone.
4. `--force --role=shell` again → shell assets from
   `templates/role-assets/shell/`; demo live paths gone.

### V5 — Per-role automated smoke

```bash
npm test
npm run test:e2e   # or npx playwright test
```

Expected: for **standalone, shell, and remote-standalone** — **first visit
(cleared storage) → system/`light`**, theme toggle/`data-theme`, **toggle →
reload → same `data-theme`**, use-system, viewport, offline; shell also
**empty/invalid remote URL → RemoteFallback**.

### V6 — Compose smoke (required)

```bash
npm run test:compose
```

Harness creates **two temp workspaces**, inits shell + remote, starts both.

Expected (SC-009/014/015/019): demo in shell with `embedded={true}`; shell owns
PWA + `data-theme`; Demo does not take over.

### V7 — WCAG 2.2 AA CI

```bash
npm run test:a11y   # or CI job wiring axe against primary routes
```

Expected (SC-020): pipeline fails on AA violations.

## Done when

- SC-001…SC-020 from [spec.md](./spec.md) demonstrable via V1–V7
  (~2s interactive remains aspirational; not a hard fail).
