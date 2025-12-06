# Data Model: React Role Scaffold

## Entities

### Repository Role

| Field | Type | Rules |
|-------|------|-------|
| value | enum | Exactly one of `standalone`, `shell`, `remote` |
| selectedVia | — | Only via required init `--role` (not prompt/default) |
| cardinality | — | Exactly one per repository after successful init |

**Relationships**: Persisted by Role Metadata File; mirrored in project guidance
(README).

### Role Metadata File

| Field | Type | Rules |
|-------|------|-------|
| path | string | Repository root: `starter.role.json` |
| role | enum | Same as Repository Role |
| version | number/string | Schema version for tooling (e.g. `1`) |
| updatedAt | ISO-8601 string | Optional; written on successful init |
| forceRequired | — | File existence blocks init unless `--force` |

**Validation**:
- Init without `--role` → fail
- Invalid `--role` → fail listing allowed values
- File exists and no `--force` → fail
- File exists with `--force` + valid `--role` → overwrite allowed

**State transitions**:

```text
[absent] --init --role=R--> [present: R]
[present: R] --init --role=R2 (no force)--> [error: refuse]
[present: R] --init --role=R2 --force--> [present: R2]
```

### Scaffold Result

| Field | Type | Rules |
|-------|------|-------|
| role | Repository Role | From successful init |
| layout | — | Canonical root `src/` present |
| sampleCapability | — | Role-appropriate demo (see below) |
| pwaBaseline | — | Manifest + icons + SW/equivalent present |
| guidance | — | README role + local start instructions |

### Remote Public Entry (remote role)

| Field | Type | Rules |
|-------|------|-------|
| name | string | Default `./Demo` |
| module | path | Maps to `features/demo` public API |
| dualMode | — | Same feature used standalone and federated |

### Remote Location Config (shell role)

| Field | Type | Rules |
|-------|------|-------|
| slotId | string | One sample slot in v1 |
| entry | string | Targets `./Demo` |
| remoteUrl | string | Placeholder URL/config (not hard-coded prod) |
| fallback | Remote Fallback | Required when load fails |

### Remote Fallback (shell role)

| Field | Type | Rules |
|-------|------|-------|
| visibility | — | User-visible (not blank/crash) |
| content | — | Clear unavailable-remote message/UI |

### Connectivity Banner

| Field | Type | Rules |
|-------|------|-------|
| trigger | — | No network / offline detected |
| message | string | "internet connection required" (or equivalent clear phrasing) |
| scope | — | All roles; not a full offline data product |

### Theme

| Field | Type | Rules |
|-------|------|-------|
| value | enum | `light` \| `dark` |
| attribute | — | Applied as `data-theme` on `document.documentElement` |
| persistence | string | Stored in `localStorage` (key owned by ThemeProvider) |
| tokens | — | CSS variables in `src/styles/tokens.css` (`:root` + `[data-theme="dark"]`) |
| UI | — | Demo includes a toggle; no third-party component library |

## Role → sample capability mapping

| Role | Sample capability |
|------|-------------------|
| standalone | Home/demo page; no remotes |
| shell | Chrome + one `./Demo` remote slot + fallback; no remote domain source |
| remote | `features/demo` exposable as `./Demo`; standalone runnable |
