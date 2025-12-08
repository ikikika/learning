# Contract: Init CLI

## Command

```bash
node scripts/init.mjs --role=<standalone|shell|remote> [--force]
```

npm equivalent (e.g. `npm run init -- --role=standalone`) MUST pass through flags.

## Required flags

| Flag | Values | Required |
|------|--------|----------|
| `--role` | `standalone`, `shell`, `remote` | Yes |
| `--force` | presence | When `starter.role.json` already exists |

## Exit behavior

| Condition | Exit | Message must convey |
|-----------|------|---------------------|
| Missing `--role` | non-zero | `--role=standalone\|shell\|remote` required |
| Invalid `--role` | non-zero | Lists allowed values |
| Metadata exists, no `--force` | non-zero | Re-init requires `--force` |
| Success | 0 | Writes metadata; updates README; prune/restore as needed |

## Side effects on success

1. Write/overwrite `starter.role.json` ([role-metadata.schema.json](./role-metadata.schema.json)).
2. Update README role + start instructions.
3. Apply role-conditioned Webpack/federation config.
4. **Never delete** `templates/role-assets/demo/` or `templates/role-assets/shell/`.
5. Templates **mirror `src/` relative paths**; restore is a **straight copy**
   into matching `src/` destinations (git checkout alone is **not** sufficient).
6. **`--role=shell`**:
   - Delete live `src/features/demo` and `src/pages/HomePage`.
   - Restore shell-only live paths from `templates/role-assets/shell/` mirroring:
     - `pages/ShellHomePage/` → `src/pages/ShellHomePage/`
     - `app/remotes/loadDemoRemote.tsx` → `src/app/remotes/loadDemoRemote.tsx`
     - `app/routes/shellRoutes.tsx` → `src/app/routes/shellRoutes.tsx`
7. **`--role=standalone` or `remote`** (including after prior shell with
   `--force`):
   - Delete live shell-only sample assets at
     `src/pages/ShellHomePage/`, `src/app/remotes/loadDemoRemote.tsx`, and
     `src/app/routes/shellRoutes.tsx` (and any other shell-only adapters under
     those mirrored paths).
   - Restore live `src/features/demo` and `src/pages/HomePage` from
     `templates/role-assets/demo/`.
