# Data Model: React Role Scaffold

## Entities

### Repository Role

| Field | Type | Rules |
|-------|------|-------|
| value | enum | Exactly one of `standalone`, `shell`, `remote` |
| selectedVia | — | Only via required init `--role` |
| cardinality | — | Exactly one per repository after successful init |

### Role Metadata File

| Field | Type | Rules |
|-------|------|-------|
| path | string | `starter.role.json` at repo root |
| role | enum | Same as Repository Role |
| name | string | App name from `--name` (defaults by role) |
| federationName | string | MF container name derived from `name` |
| remotes | array | Shell only: `{ alias, name, federationName, expose, urlEnv }[]` |
| remoteName / remoteFederationName | string | Deprecated legacy single-remote fields (still read if `remotes` absent) |
| version | integer | Schema version (`1`) |
| updatedAt | ISO-8601 | Optional |
| forceRequired | — | Exists → init needs `--force` |

**State transitions**:

```text
[absent] --init --role=R--> [present: R]
[present: R] --init (no force)--> [error]
[present: R] --init --role=R2 --force--> [present: R2] (metadata only; src/ unchanged)
```

### Live sample assets

All role sample paths live permanently under `src/` (demo, HomePage, ShellHomePage,
remotes adapters). Init does **not** prune or restore files. Prefer one role per
clone; avoid switching.

### Scaffold Result

| Field | Type | Rules |
|-------|------|-------|
| role | Repository Role | From init |
| layout | — | Canonical `src/` (all sample assets may coexist) |
| pwaBaseline | — | Manifest + icons + SW |
| a11yCi | — | WCAG 2.2 AA tooling in CI |
| guidance | — | README role + start + contract version |

### Remote Public Entry (remote)

| Field | Type | Rules |
|-------|------|-------|
| name | string | `./Demo` |
| module | path | `features/demo` |
| publicTypes | — | Exported props/types |
| embedded | `boolean?` | Optional prop `embedded?: boolean`; shell passes `true`; omit/`false` = standalone |
| suppressionLocus | — | When `embedded===true`, **Demo module** suppresses document PWA/`data-theme` |
| contractVersion | string | `1.0.0` documented |
| dualMode | — | Same module standalone + federated |
| publishedPackage | — | Not required in v1 (Complexity Tracking) |

### Remote Location Config (shell)

| Field | Type | Rules |
|-------|------|-------|
| slotId | string | One sample slot |
| entry | string | `./Demo` |
| remoteUrl | string | Placeholder; empty/invalid → fallback |
| mountProps | — | Shell passes `embedded={true}` |
| fallback | Remote Fallback | Required for missing, unreachable, empty/invalid |

### Remote Fallback (shell)

| Field | Type | Rules |
|-------|------|-------|
| visibility | — | User-visible |
| content | — | Unavailable-remote UI |
| triggers | — | Missing remote; load failure; empty/invalid URL; missing remotes map entry |

### Connectivity Banner

| Field | Type | Rules |
|-------|------|-------|
| trigger | — | Offline / no network |
| message | string | "internet connection required" (or equivalent) |

### Theme

| Field | Type | Rules |
|-------|------|-------|
| value | enum | `light` \| `dark` |
| attribute | — | `data-theme` on `documentElement` |
| firstVisit | — | `prefers-color-scheme` → `light` |
| persistence | — | After light/dark toggle → `localStorage` |
| clearControl | — | “Use system theme” |
| federatedOwnership | — | Shell owns when composed |
| perRoleSmoke | — | First visit + toggle + **reload persistence** + use-system for standalone, shell, remote-standalone |

**State transitions**:

```text
[no persisted] --load--> [system or light]
[any] --toggle--> [persisted] --reload--> [same]
[persisted] --“Use system theme”--> [no persisted]
```

### Compose Harness Run

| Field | Type | Rules |
|-------|------|-------|
| workspaces | 2 | Temp copy/clone each |
| inits | — | One `shell`, one `remote` |
| assert | — | Shell owns PWA + `data-theme`; no remote takeover |

## Role → sample capability

| Role | Active surface (via webpack/routes) |
|------|-------------------------------------|
| standalone | `features/demo` + `HomePage` |
| shell | `ShellHomePage` + remote slot(s) |
| remote | `features/demo` + `HomePage`; expose `./Demo` |

All of the above sample paths may coexist under `src/`; init does not prune.
