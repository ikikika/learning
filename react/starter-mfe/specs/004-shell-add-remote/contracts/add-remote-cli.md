# Contract: add-remote CLI

**Feature**: `004-shell-add-remote`  
**Invocation**: `npm run add-remote -- [flags]`  
**Role gate**: `starter.role.json.role === "shell"` only

## Flags

| Flag | Required | Description |
|------|----------|-------------|
| `--alias=<id>` | Yes* | Webpack remotes map key / nav slot id |
| `--url=<url>` | One of url/port* | Absolute `http(s)` remoteEntry URL |
| `--port=<n>` | One of url/port* | Expands to `http://$DEV_HOST:$n/remoteEntry.js` (`DEV_HOST` default `127.0.0.1`) |
| `--name=<name>` | No | Defaults to alias |
| `--expose=./X` | No | Defaults to PascalCase expose of name |
| `--federation-name=<id>` | No | Defaults from name |
| `--url-env=<ENV>` | No | Defaults via `aliasToUrlEnv(alias)` |
| `--props=<json>` | No | JSON object string; initial `remoteProps[alias]` |

\* On a TTY, missing required values are prompted one-by-one (optional fields
prompted with Enter-to-accept defaults). Non-TTY / CI must pass flags.

## Interactive prompts (TTY)

When `--alias` and/or location (`--url`/`--port`) are omitted:

1. Alias  
2. Location kind (`port` default, or `url`) then port/URL value  
3. Name (default alias)  
4. Expose (default from name)  
5. Federation name (default from name)  
6. URL env key (default from alias)  
7. Props JSON (optional; Enter skips)  

If required flags are already complete, optional flags use defaults with no prompts.

## Exit behavior

| Condition | Exit | Side effects |
|-----------|------|--------------|
| Success | 0 | Appends `remotes[]`, writes `.env[urlEnv]`, regenerates loaders, optionally sets `remoteProps[alias]`; prints restart hint |
| Not shell | ≠0 | No file writes |
| Duplicate alias | ≠0 | No file writes |
| Invalid/missing location or props JSON | ≠0 | No file writes |

## Artifacts written (success)

1. `starter.role.json` — `remotes[]` + optional `remoteProps`
2. `.env` — `urlEnv=resolvedUrl` (create/update key)
3. `src/app/remotes/loaders.generated.ts` — full regenerate

## Compatibility

- Does not replace init `--remote` / `--remote-name`; both may populate `remotes[]`
- Standalone/remote role metadata must not be mutated by this command
