# Contract: add-remote for host | hybrid

**Feature**: `005-hybrid-role-scaffold`  
**Extends**: [../../004-host-add-remote/contracts/add-remote-cli.md](../../004-host-add-remote/contracts/add-remote-cli.md)

## Role gate (updated)

| `starter.role.json.role` | Result                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `host`                   | Success path unchanged                                                                     |
| **`hybrid`**             | **Same success path** (append `remotes[]`, `.env` url, regenerate loaders, optional props) |
| `standalone` \| `remote` | Non-zero; clear role error; **no writes**                                                  |

Error copy MUST NOT say “host-only” exclusively; it MUST indicate allowed roles are host and hybrid (or equivalent clear wording).

## Child eligibility

No additional refusal for “child looks like a hybrid.” Any valid federated registration accepted (same validation as host). Sample docs recommend leaf modules.

## Artifacts

Identical to host add-remote on success. Restart composer (host or hybrid) required after add.

## Compatibility

- Host add-remote behavior for existing hosts MUST NOT regress.
- Hybrid init `--remote` / `--remote-name` and add-remote both may populate the same `remotes[]`.
