# Contract: Init CLI

## Command

```bash
node scripts/init.mjs --role=<standalone|shell|remote> [--name=<appName>] [--remote-name=<remoteAppName>] [--force]
```

npm equivalent (e.g. `npm run init -- --role=standalone --name=my-app`) MUST pass through flags.

## Required flags

| Flag | Values | Required |
|------|--------|----------|
| `--role` | `standalone`, `shell`, `remote` | Yes |
| `--name` | camelCase identifier or lowercase npm-style name (`myApp`, `my-app`, `@scope/my-app`) | No — defaults: `standalone` / `shell` / `demoRemote` by role |
| `--remote-name` | same rules as `--name` | No — **shell only**; defaults to `demoRemote`. Must match the remote repo’s federation name |
| `--force` | presence | When `starter.role.json` already exists |

## Exit behavior

| Condition | Exit | Message must convey |
|-----------|------|---------------------|
| Missing `--role` | non-zero | `--role=standalone\|shell\|remote` required |
| Invalid `--role` | non-zero | Lists allowed values |
| Invalid `--name` / `--remote-name` | non-zero | Valid name format required |
| `--remote-name` without `--role=shell` | non-zero | Only valid with shell |
| Metadata exists, no `--force` | non-zero | Re-init requires `--force` |
| Success | 0 | Writes metadata; updates README; prune/restore as needed |

## Side effects on success

1. Write/overwrite `starter.role.json` ([role-metadata.schema.json](./role-metadata.schema.json)), including `name`, `federationName`, and (shell) `remoteName` / `remoteFederationName`.
2. Update README role + app name + start instructions.
3. When `--name` is provided, set `package.json` `"name"` to that value.
4. Webpack reads metadata for Module Federation `name` (and shell remotes RHS). Import alias for the sample remote stays `demoRemote`.
5. **Never delete** `templates/role-assets/demo/` or `templates/role-assets/shell/`.
6. Templates **mirror `src/` relative paths**; restore is a **straight copy**
   into matching `src/` destinations (git checkout alone is **not** sufficient).
7. **`--role=shell`**:
   - Delete live `src/features/demo` and `src/pages/HomePage`.
   - Restore shell-only live paths from `templates/role-assets/shell/` mirroring:
     - `pages/ShellHomePage/` → `src/pages/ShellHomePage/`
     - `app/remotes/loadDemoRemote.tsx` → `src/app/remotes/loadDemoRemote.tsx`
     - `app/routes/shellRoutes.tsx` → `src/app/routes/shellRoutes.tsx`
8. **`--role=standalone` or `remote`** (including after prior shell with
   `--force`):
   - Delete live shell-only sample assets at
     `src/pages/ShellHomePage/`, `src/app/remotes/loadDemoRemote.tsx`, and
     `src/app/routes/shellRoutes.tsx` (and any other shell-only adapters under
     those mirrored paths).
   - Restore live `src/features/demo` and `src/pages/HomePage` from
     `templates/role-assets/demo/`.
