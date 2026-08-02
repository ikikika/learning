# Contract: starter.role.json remoteProps extension

**Feature**: `004-host-add-remote`  
**Extends**: `specs/001-react-role-scaffold/contracts/role-metadata.schema.json`

## Additive property (host)

```json
{
  "remoteProps": {
    "type": "object",
    "description": "Optional per-alias host props bags (host). Keys are remote aliases; values are JSON objects.",
    "additionalProperties": {
      "type": "object"
    }
  }
}
```

## Rules

- Keys not present in `remotes[].alias` are allowed on disk but **ignored** at runtime
- Values must be plain objects (not arrays/primitives) when written by add-remote
- `version` remains `1` for this additive field (document in schema description); no remotes[] breaking change

## Hand-edit (v1)

Developers edit `remoteProps.<alias>` in `starter.role.json`, then restart the host so DefinePlugin bake refreshes.
