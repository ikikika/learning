# Contract: Init CLI

## Command

```bash
# Interactive (TTY): prompts for missing role / name / port
npm run init

# Non-interactive (CI / scripts): flags required
node scripts/init.mjs --role=<standalone|host|remote|hybrid> --port=<number> [--name=<appName>] [--remote=alias:name[:expose[:urlEnv]]]... [--remote-name=<remoteAppName>] [--force]
```

npm equivalent (e.g. `npm run init -- --role=host --port=3001 --remote=demoRemote:checkout`) MUST pass through flags.

## Flags

| Flag | Values | Required |
|------|--------|----------|
| `--role` | `standalone`, `host`, `remote`, `hybrid` | Yes in non-TTY; prompted when stdin is a TTY |
| `--port` | Integer `1`–`65535` | Yes in non-TTY; prompted when stdin is a TTY — writes role `PORT_*` in `.env` |
| `--name` | camelCase identifier or lowercase npm-style name | No — prompted on TTY (Enter = role default); flag/default otherwise |
| `--remote` | `alias:name[:expose[:urlEnv]]` (repeatable) | No — **host or hybrid**. Default expose is PascalCase of `name`. When omitted (and no `--remote-name`), `remotes[]` is **empty** |
| `--remote-name` | same rules as `--name` | No — **host or hybrid**; shorthand for a single `demoRemote:<name>` entry. Mutually exclusive with `--remote` |
| `--force` | presence | When `starter.role.json` already exists |

## Interactive prompts

When **stdin and stdout are TTYs** and a value is missing:

1. **Role** — numbered list (`1–4`) or type `standalone` / `host` / `remote` / `hybrid`
2. **App name** — string; empty accepts the role default (does not rewrite `package.json` name unless the user typed a value or passed `--name`)
3. **Port** — integer `1–65535`

Partial flags still work (e.g. `--role=host` prompts only for name + port).  
When **not** a TTY (CI, piped stdin), missing `--role` / `--port` MUST fail with the same messages as before — no silent defaults for those.

## Exit behavior

| Condition | Exit | Message must convey |
|-----------|------|---------------------|
| Missing `--role` (non-TTY) | non-zero | `--role=standalone\|host\|remote\|hybrid` required |
| Invalid `--role` | non-zero | Lists allowed values |
| Missing / invalid `--port` (non-TTY / invalid flag) | non-zero | `--port` required; integer 1–65535 |
| Invalid `--name` / `--remote` / `--remote-name` | non-zero | Valid format required |
| `--remote` / `--remote-name` without `--role=host` or `hybrid` | non-zero | Only valid with host or hybrid |
| Both `--remote` and `--remote-name` | non-zero | Use one or the other |
| Duplicate remote alias | non-zero | Duplicate alias |
| Metadata exists, no `--force` | non-zero | Re-init requires `--force` |
| Success | 0 | Writes metadata; updates README + `.env` port; host/hybrid regenerates loaders |

## Side effects on success

1. Write/overwrite `starter.role.json` ([role-metadata.schema.json](./role-metadata.schema.json)), including `name`, `federationName`, (remote/hybrid) `expose`, and (host/hybrid) `remotes[]`.
2. Update README role + app name + start instructions.
3. Set the role’s port in `.env` (`PORT_STANDALONE` / `PORT_HOST` / `PORT_REMOTE` / `PORT_HYBRID`). `.env.example` leaves these blank; init creates `.env` from the example when missing and fills the active role’s key.
4. When `--name` is provided **or** the user typed a non-default name at the prompt, set `package.json` `"name"` to that value.
5. Webpack reads role / `remotes[]` / remote `expose` from metadata (no src file prune).
6. Host/hybrid init regenerates `src/app/remotes/loaders.generated.ts` with a static `import()` per remote alias (empty registry when `remotes[]` is empty).
7. **Does not** delete or restore live `src/` trees. Sample assets for all roles live under `src/` permanently; prefer one role per clone and avoid switching.
8. Remote and hybrid success stdout MUST print a copy-paste `npm run add-remote` command for a parent host (see [hybrid-init-cli.md](../../005-hybrid-role-scaffold/contracts/hybrid-init-cli.md) for hybrid detail).

## Role behavior (runtime)

| Role | Effect |
|------|--------|
| `standalone` | Webpack: no remotes/exposes; routes → standalone |
| `host` | Webpack remotes from `remotes[]` (may be empty); routes → host; loaders generated |
| `remote` | Webpack exposes PascalCase name → `FederatedRemoteApp.tsx`; prints host `add-remote` snippet |
| `hybrid` | Webpack remotes + expose → `FederatedHybridApp.tsx`; routes → hybrid; loaders generated; prints host `add-remote` snippet |
