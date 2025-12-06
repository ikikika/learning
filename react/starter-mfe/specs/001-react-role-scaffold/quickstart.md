# Quickstart: React Role Scaffold

Validation guide for `001-react-role-scaffold`. Implementation details live in
`tasks.md` / code; this file proves the feature end-to-end after implement.

## Prerequisites

- Node 20+
- Clean clone of this repository (or reset role metadata for re-runs)
- No mandatory shared `@scope/*` packages for v1

## Contracts & model references

- Init CLI: [contracts/init-cli.md](./contracts/init-cli.md)
- Role file schema: [contracts/role-metadata.schema.json](./contracts/role-metadata.schema.json)
- `./Demo` expose: [contracts/remote-demo.md](./contracts/remote-demo.md)
- PWA / offline UX: [contracts/pwa-connectivity.md](./contracts/pwa-connectivity.md)
- Entities: [data-model.md](./data-model.md)

## Setup (per role)

```bash
# From repository root — choose one role per clone/session
npm install
npm run init -- --role=standalone   # or shell | remote
# Re-init only when needed:
# npm run init -- --role=shell --force
```

Expected after success:

- `starter.role.json` exists with matching `role`
- README states the same role and local start steps
- Canonical `src/` layout present

## Local run

```bash
npm start   # or documented equivalent
```

Open the app URL from the start script output.

## Validation scenarios

### V1 — Standalone (P1)

1. Init with `--role=standalone` (no other repos).
2. `npm start` → sample home/demo loads.
3. Phone-width viewport (~375px): primary content usable without horizontal scroll.
4. Confirm `public/manifest.webmanifest` (or equivalent), icons, and SW registration path.
5. Simulate offline (DevTools) → message conveys **internet connection required**.
6. Toggle theme → `document.documentElement` has `data-theme="dark"` (or light);
   demo surfaces update via CSS variables (no third-party UI kit).

### V2 — Shell without remotes (P2)

1. Init with `--role=shell` (use `--force` if metadata already exists).
2. Start with sample remote unreachable.
3. Shell boots; sample `./Demo` slot shows **user-visible fallback** (no blank crash).
4. Confirm shell owns PWA install/offline UX; responsive chrome OK at phone-width.
5. Offline → connection-required message.

### V3 — Remote dual-mode (P3)

1. Init with `--role=remote`.
2. Standalone start: demo capability works; PWA baseline available.
3. Confirm docs/Webpack expose list public entry `./Demo` → `features/demo`.
4. (Optional compose) Point a shell slot at this remote’s `remoteEntry`; same demo
   loads inside shell; remote does not take over install/offline UX.
5. Offline (standalone) → connection-required message.

### V4 — Init guardrails

1. Init without `--role` → non-zero exit + clear required-flag message.
2. Init with `--role=invalid` → non-zero + lists allowed roles.
3. Second init without `--force` → refuse.
4. Second init with `--force --role=…` → overwrites metadata/config for new role.

### V5 — Automated smoke (when implemented)

```bash
npm test                 # unit + contract
npx playwright test      # or npm run test:e2e — per-role smoke
```

Expected: unit/contract green; Playwright covers viewport + offline message +
shell fallback for the roles under test.

## Done when

- SC-001…SC-011 from [spec.md](./spec.md) can be demonstrated via the scenarios
  above in one local session per role (compose optional for SC-009).
