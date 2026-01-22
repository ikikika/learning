# Data Model: Hybrid Role Scaffold

**Feature**: `005-hybrid-role-scaffold` | **Date**: 2026-08-02

## Entities

### RepositoryRoleMetadata (`starter.role.json`)

| Field            | Type    | Rules                                                      |
| ---------------- | ------- | ---------------------------------------------------------- |
| `role`           | enum    | `standalone` \| `host` \| `remote` \| **`hybrid`**         |
| `name`           | string  | App display / package name input                           |
| `federationName` | string  | MF container name (derived from name)                      |
| `expose`         | string  | Required for `remote` and **`hybrid`** — e.g. `./MyHybrid` |
| `remotes`        | array   | Required for `host` and **`hybrid`** (may be `[]`)         |
| `remoteProps`    | object? | Optional per-alias props map (host and hybrid)             |
| `version`        | number  | Metadata schema version (existing)                         |
| `updatedAt`      | string  | ISO timestamp                                              |

**Hybrid invariant**: `role === 'hybrid'` ⇒ both `expose` present and `remotes` is an array (possibly empty). Exactly one role per clone.

### RemoteRegistration (element of `remotes[]`)

Unchanged from host (specs 001/004):

| Field            | Type   | Notes                       |
| ---------------- | ------ | --------------------------- |
| `alias`          | string | Unique within composer      |
| `name`           | string | Remote/hybrid app name      |
| `federationName` | string | MF name                     |
| `expose`         | string | Expose path e.g. `./Demo`   |
| `urlEnv`         | string | Env key for remoteEntry URL |

### HybridPublicEntryContract

| Field                  | Type         | Rules                                                                           |
| ---------------------- | ------------ | ------------------------------------------------------------------------------- |
| Export name            | string       | Stable PascalCase expose from init `--name`                                     |
| `embedded`             | boolean?     | Shell passes `true` when nesting; omit/false = own-app semantics for toggle/PWA |
| Optional display props | serializable | Additive only (e.g. title); must not override `embedded`                        |
| `CONTRACT_VERSION`     | string       | Semver string documented in-repo (start `1.0.0`)                                |

### HybridChrome (sample UI)

| Aspect          | Rule                                                                               |
| --------------- | ---------------------------------------------------------------------------------- |
| Composition     | Nav (slots from `REMOTE_SLOTS`) + content panel (`LoadRemote`)                     |
| Tokens/branding | Distinct from `demoHost` / shell sample                                            |
| Layout cue      | Header band with `data-testid="demo-hybrid-header-band"` (distinct from host)      |
| Theme toggle    | Present on own-app; **suppressed** when `embedded === true` (`FederatedHybridApp`) |
| Empty state     | Zero remotes → usable empty chrome (no crash)                                      |
| Fallback        | Missing/failing child → defined fallback; chrome stays interactive                 |

### EnvPortBinding

| Role       | Env key           | Suggested default (e2e) |
| ---------- | ----------------- | ----------------------- |
| standalone | `PORT_STANDALONE` | 3000                    |
| host       | `PORT_HOST`       | 3001                    |
| remote     | `PORT_REMOTE`     | 3002                    |
| **hybrid** | **`PORT_HYBRID`** | **3003**                |

Child / peer URLs continue as `*_URL` keys from `urlEnv`.

## Relationships

```text
Shell (host) --add-remote / remotes[]--> Hybrid (expose)
Hybrid       --add-remote / remotes[]--> Leaf remote (expose)
```

- Host and hybrid are **composers** (own `remotes[]` + loaders).
- Hybrid and remote are **composees** (own `expose`).
- Hybrid is both; leaf remote is composee-only in the sample topology.

## State / lifecycle

1. **Uninitialized** → `init --role=hybrid` → metadata + `PORT_HYBRID` + optional remotes/loaders + printed host `add-remote` snippet.
2. **Hybrid running (own-app)** → theme/PWA on; empty or populated child slots.
3. **Child registered** → `add-remote` on hybrid → restart → slot appears.
4. **Embedded under shell** → shell `LoadRemote` with `embedded={true}` → toggle suppressed; chrome in-boundary.
5. **Degraded** → child or hybrid unavailable → fallback; composer remains up.

## Validation rules

- Init refuses unknown roles; hybrid allowed.
- Re-init requires `--force` when metadata exists.
- `add-remote` only if role is `host` or `hybrid`; duplicate alias rejected.
- `embedded` from composer mount cannot be overridden by `remoteProps` bag (existing host rule applies to hybrid mounts too).
