# Contract: Hybrid init CLI extensions

**Feature**: `005-hybrid-role-scaffold`  
**Extends**: [../../001-react-role-scaffold/contracts/init-cli.md](../../001-react-role-scaffold/contracts/init-cli.md)

## Role value

`--role=hybrid` is a valid role alongside `standalone` | `host` | `remote`.

Interactive role prompt MUST offer hybrid (e.g. `1–4` or typed `hybrid`).

Non-TTY missing/invalid role messages MUST list `hybrid` among allowed values.

## Port

| Role   | `.env` key    |
| ------ | ------------- |
| hybrid | `PORT_HYBRID` |

Port rules unchanged: integer `1`–`65535`; required non-TTY.

## Host-style remotes at init

`--remote` / `--remote-name` MUST be valid for **`host` or `hybrid`** (not standalone/remote).  
Omitting both yields `remotes: []` for hybrid (empty hybrid valid).

## Metadata on success (hybrid)

```json
{
  "role": "hybrid",
  "name": "<name>",
  "federationName": "<fed>",
  "expose": "./<PascalName>",
  "remotes": [/* zero or more RemoteRegistration */],
  "remoteProps": {/* optional */},
  "version": 1,
  "updatedAt": "<ISO>"
}
```

Also: regenerate `loaders.generated.ts` (like host); set `PORT_HYBRID` in `.env`; update README role block.

## Stdout on success (hybrid)

MUST print a copy-paste host registration command in the same shape as remote init:

```text
In your host clone, run:
npm run add-remote -- --alias=<fed> --name=<name> --port=<port> --expose=./<Pascal> --federation-name=<fed> --url-env=<ALIAS_URL>
```

Flag derivation MUST reuse the same helpers as remote init (`hostRemoteSnippetForApp` or equivalent).

## Webpack expectations after hybrid init

- `remotes` map from `remotes[]` (may be empty)
- `exposes` includes hybrid public entry → `FederatedHybridApp` (see [hybrid-public-entry.md](./hybrid-public-entry.md))
- Shared singletons unchanged
