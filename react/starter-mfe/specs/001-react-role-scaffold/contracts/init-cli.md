# Contract: Init CLI

## Command

```bash
node scripts/init.mjs --role=<standalone|shell|remote> [--force]
```

Documented npm script equivalent (e.g. `npm run init -- --role=standalone`)
MUST pass through the same flags.

## Required flags

| Flag | Values | Required |
|------|--------|----------|
| `--role` | `standalone`, `shell`, `remote` | Yes |
| `--force` | boolean presence | Only when `starter.role.json` already exists |

## Exit behavior

| Condition | Exit | stderr / message must convey |
|-----------|------|------------------------------|
| Missing `--role` | non-zero | `--role=standalone\|shell\|remote` is required |
| Invalid `--role` | non-zero | Lists allowed values |
| Metadata exists, no `--force` | non-zero | Re-init requires `--force` |
| Success | 0 | Writes `starter.role.json`; updates README role section |

## Side effects on success

1. Write/overwrite `starter.role.json` (see [role-metadata.schema.json](./role-metadata.schema.json)).
2. Ensure human-readable README (or equivalent) states the chosen role and local start steps.
3. Apply role-conditioned build/federation configuration for this repository.
