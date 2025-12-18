# Contract: Init CLI

## Command

```bash
node scripts/init.mjs --role=<standalone|shell|remote> [--name=<appName>] [--remote=alias:name[:expose[:urlEnv]]]... [--remote-name=<remoteAppName>] [--force]
```

npm equivalent (e.g. `npm run init -- --role=shell --remote=demoRemote:checkout`) MUST pass through flags.

## Flags

| Flag | Values | Required |
|------|--------|----------|
| `--role` | `standalone`, `shell`, `remote` | Yes |
| `--name` | camelCase identifier or lowercase npm-style name | No — defaults by role |
| `--remote` | `alias:name[:expose[:urlEnv]]` (repeatable) | No — **shell only**. Default: one `demoRemote:demoRemote:./Demo:DEMO_REMOTE_URL` |
| `--remote-name` | same rules as `--name` | No — **shell only**; shorthand for a single `demoRemote:<name>` entry. Mutually exclusive with `--remote` |
| `--force` | presence | When `starter.role.json` already exists |

## Exit behavior

| Condition | Exit | Message must convey |
|-----------|------|---------------------|
| Missing `--role` | non-zero | `--role=standalone\|shell\|remote` required |
| Invalid `--role` | non-zero | Lists allowed values |
| Invalid `--name` / `--remote` / `--remote-name` | non-zero | Valid format required |
| `--remote` / `--remote-name` without `--role=shell` | non-zero | Only valid with shell |
| Both `--remote` and `--remote-name` | non-zero | Use one or the other |
| Duplicate remote alias | non-zero | Duplicate alias |
| Metadata exists, no `--force` | non-zero | Re-init requires `--force` |
| Success | 0 | Writes metadata; updates README; shell regenerates loaders |

## Side effects on success

1. Write/overwrite `starter.role.json` ([role-metadata.schema.json](./role-metadata.schema.json)), including `name`, `federationName`, and (shell) `remotes[]`.
2. Update README role + app name + start instructions.
3. When `--name` is provided, set `package.json` `"name"` to that value.
4. Webpack reads role / `remotes[]` from metadata (no src file prune).
5. Shell init regenerates `src/app/remotes/loaders.generated.ts` with a static `import()` per remote alias.
6. **Does not** delete or restore live `src/` trees. Sample assets for all roles live under `src/` permanently; prefer one role per clone and avoid switching.

## Role behavior (runtime)

| Role | Effect |
|------|--------|
| `standalone` | Webpack: no remotes/exposes; routes → standalone |
| `shell` | Webpack remotes from `remotes[]`; routes → shell; loaders generated |
| `remote` | Webpack exposes `./Demo`; routes → remote; prints shell `remotes[]` snippet |
