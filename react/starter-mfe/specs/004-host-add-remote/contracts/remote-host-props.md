# Contract: Host → remote props (host composition)

**Feature**: `004-host-add-remote`  
**Consumer**: Host `LoadRemote`  
**Provider**: Federated expose (`FederatedRemoteApp` / compatible default export)

## Mount props

| Prop | Source | Rules |
|------|--------|--------|
| `embedded` | Host always | Always `true` when composed; cannot be overridden by `remoteProps` |
| `…rest` | `remoteProps[alias]` | JSON-serializable; unknown aliases → treat as `{}` (ignore stale map keys) |
| `title` | Optional in bag | Sample convention; demoRemote MUST display when non-empty string while embedded |

## Bake

- Host webpack defines `__STARTER_REMOTE_PROPS__` from `starter.role.json.remoteProps` (default `{}`)
- Non-host builds: empty object

## Failure

- Load failures unchanged: `RemoteFallback` + error boundary
- Props never cause host crash; missing display prop → sample UI without host title line

## Versioning

- Additive optional props = MINOR for sample expose
- Removing/renaming `embedded` behavior = MAJOR (forbidden by this feature)
