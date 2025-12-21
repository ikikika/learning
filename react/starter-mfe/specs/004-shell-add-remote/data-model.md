# Data Model: Shell add-remote

**Feature**: `004-shell-add-remote` | **Date**: 2026-08-02

## Entities

### ShellRemoteRegistration

Host-side record for one federated remote (existing `remotes[]` item).

| Field | Type | Rules |
|-------|------|--------|
| alias | string | Required; JS identifier; unique in `remotes[]` |
| name | string | Required; package-like name; default = alias |
| federationName | string | Required; MF container name; default from name |
| expose | string | Required; `./PascalCase…` |
| urlEnv | string | Required; `UPPER_SNAKE` env key for remoteEntry URL |

**Relationships**: Zero-or-one `PerRemoteHostProps` keyed by the same `alias`.

**Lifecycle**: Created by `add-remote` (or init `--remote`); never auto-deleted by add-remote; duplicate alias → reject.

### RunningRemoteLocation

Developer-supplied location for an already-running entry.

| Field | Type | Rules |
|-------|------|--------|
| url | string (URL) | Optional input; http(s) absolute; typically ends with `/remoteEntry.js` |
| port | integer | Optional input; 1–65535; mutually exclusive with url at CLI |

**Derived**: Stored value is always the resolved URL written to `.env[urlEnv]`.

### PerRemoteHostProps

Serializable props bag for one alias.

| Field | Type | Rules |
|-------|------|--------|
| alias | string (map key) | Must match a registration to take effect; unknown keys ignored at runtime |
| props | object | JSON object; no functions; may be `{}` |
| title | string (sample) | Optional conventional key consumed by demoRemote when embedded |

**Storage**: `starter.role.json` → `remoteProps: { [alias]: props }`

**Lifecycle**: Optional create on add-remote via `--props`; later hand-edit; removing a remote from `remotes[]` may leave orphan props (ignored).

### ShellCompositionMount

Runtime mount in the shell panel (not persisted).

| Field | Type | Rules |
|-------|------|--------|
| alias | string | From route `/remote/:alias` |
| embedded | boolean | Always `true` from host |
| props | object | From `remoteProps[alias]` or `{}`; `embedded` key stripped if present |

## Validation summary

- Shell role required for add-remote writes
- Exactly one of `--url` / `--port`
- `--props` if present must parse as a JSON **object** (not array/primitive)
- Alias uniqueness within `remotes[]`
- URL must pass http(s) URL parse after expansion

## State transitions

```text
[unregistered]
    --add-remote success--> [registered (+ optional props)]
[registered]
    --hand-edit remoteProps--> [registered with updated props]
[registered]
    --select in shell nav--> [mounted with props ∪ embedded=true]
[props for unknown alias]
    --runtime read--> ignored (no mount effect)
```
