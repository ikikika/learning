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
| Success | 0 | Writes metadata; updates README; prune/restore as needed |

## Side effects on success

1. Write/overwrite `starter.role.json` ([role-metadata.schema.json](./role-metadata.schema.json)), including `name`, `federationName`, and (shell) `remotes[]`.
2. Update README role + app name + start instructions.
3. When `--name` is provided, set `package.json` `"name"` to that value.
4. Webpack reads `remotes[]` for Module Federation `remotes` map and injects config into the app.
5. Shell init generates `src/app/remotes/loaders.generated.ts` with a static `import()` per remote alias.
6. **Never delete** `templates/role-assets/demo/` or `templates/role-assets/shell/`.
7. Templates **mirror `src/` relative paths**; restore is a **straight copy**
   into matching `src/` destinations (git checkout alone is **not** sufficient).
8. **`--role=shell`**:
   - Delete live `src/features/demo` and `src/pages/HomePage`.
   - Restore shell-only live paths from `templates/role-assets/shell/` mirroring:
     - `pages/ShellHomePage/` → `src/pages/ShellHomePage/`
     - `app/remotes/*` → `src/app/remotes/*`
     - `app/routes/shellRoutes.tsx` → `src/app/routes/shellRoutes.tsx`
9. **`--role=standalone` or `remote`** (including after prior shell with
   `--force`):
   - Delete live shell-only sample assets under
     `src/pages/ShellHomePage/`, `src/app/remotes/`, and
     `src/app/routes/shellRoutes.tsx`.
   - Restore live `src/features/demo` and `src/pages/HomePage` from
     `templates/role-assets/demo/`.
