# Contract: Init CLI

## Command

```bash
# Interactive (TTY): prompts for missing role / name / port
npm run init

# Non-interactive (CI / scripts): flags required
node scripts/init.mjs --role=<standalone|shell|remote> --port=<number> [--name=<appName>] [--remote=alias:name[:expose[:urlEnv]]]... [--remote-name=<remoteAppName>] [--force]
```

npm equivalent (e.g. `npm run init -- --role=shell --port=3001 --remote=demoRemote:checkout`) MUST pass through flags.

## Flags

| Flag | Values | Required |
|------|--------|----------|
| `--role` | `standalone`, `shell`, `remote` | Yes in non-TTY; prompted when stdin is a TTY |
| `--port` | Integer `1`–`65535` | Yes in non-TTY; prompted when stdin is a TTY — writes role `PORT_*` in `.env` |
| `--name` | camelCase identifier or lowercase npm-style name | No — prompted on TTY (Enter = role default); flag/default otherwise |
| `--remote` | `alias:name[:expose[:urlEnv]]` (repeatable) | No — **shell only**. Default expose is PascalCase of `name` (e.g. `demoRemote:checkout` → `./Checkout`). When omitted (and no `--remote-name`), `remotes[]` is **empty** |
| `--remote-name` | same rules as `--name` | No — **shell only**; shorthand for a single `demoRemote:<name>` entry. Mutually exclusive with `--remote` |
| `--force` | presence | When `starter.role.json` already exists |

## Interactive prompts

When **stdin and stdout are TTYs** and a value is missing:

1. **Role** — numbered list (`1–3`) or type `standalone` / `shell` / `remote`
2. **App name** — string; empty accepts the role default (does not rewrite `package.json` name unless the user typed a value or passed `--name`)
3. **Port** — integer `1–65535`

Partial flags still work (e.g. `--role=shell` prompts only for name + port).  
When **not** a TTY (CI, piped stdin), missing `--role` / `--port` MUST fail with the same messages as before — no silent defaults for those.

## Exit behavior

| Condition | Exit | Message must convey |
|-----------|------|---------------------|
| Missing `--role` (non-TTY) | non-zero | `--role=standalone\|shell\|remote` required |
| Invalid `--role` | non-zero | Lists allowed values |
| Missing / invalid `--port` (non-TTY / invalid flag) | non-zero | `--port` required; integer 1–65535 |
| Invalid `--name` / `--remote` / `--remote-name` | non-zero | Valid format required |
| `--remote` / `--remote-name` without `--role=shell` | non-zero | Only valid with shell |
| Both `--remote` and `--remote-name` | non-zero | Use one or the other |
| Duplicate remote alias | non-zero | Duplicate alias |
| Metadata exists, no `--force` | non-zero | Re-init requires `--force` |
| Success | 0 | Writes metadata; updates README + `.env` port; shell regenerates loaders |

## Side effects on success

1. Write/overwrite `starter.role.json` ([role-metadata.schema.json](./role-metadata.schema.json)), including `name`, `federationName`, (remote) `expose`, and (shell) `remotes[]`.
2. Update README role + app name + start instructions.
3. Set the role’s port in `.env` (`PORT_STANDALONE` / `PORT_SHELL` / `PORT_REMOTE`). `.env.example` leaves these blank; init creates `.env` from the example when missing and fills the active role’s key.
4. When `--name` is provided **or** the user typed a non-default name at the prompt, set `package.json` `"name"` to that value.
5. Webpack reads role / `remotes[]` / remote `expose` from metadata (no src file prune).
6. Shell init regenerates `src/app/remotes/loaders.generated.ts` with a static `import()` per remote alias (empty registry when `remotes[]` is empty).
7. **Does not** delete or restore live `src/` trees. Sample assets for all roles live under `src/` permanently; prefer one role per clone and avoid switching.

## Role behavior (runtime)

| Role | Effect |
|------|--------|
| `standalone` | Webpack: no remotes/exposes; routes → standalone |
| `shell` | Webpack remotes from `remotes[]` (may be empty); routes → shell; loaders generated |
| `remote` | Webpack exposes PascalCase name → `./src/app/App.tsx`; prints shell `remotes[]` snippet |
