# Contract: Remote public entry `./Demo`

## Scope

Applies when repository role is `remote` (and when a shell consumes this remote).

## Expose

| Expose name | Module | Notes |
|-------------|--------|-------|
| `./Demo` | `src/features/demo` public API (`index.ts`) | Default sample; rename guidance in README |

## Dual-mode rules

- Standalone remote build MUST render the same demo capability without a shell.
- Federated load MUST use the same feature module (no forked business implementation).
- When embedded in a shell, remote MUST NOT register a competing full-document
  install/offline PWA takeover.
- When embedded in a shell, remote MUST NOT apply a competing document-level
  `data-theme` / ThemeProvider takeover (shell owns document theme).

## Shell sample slot (shell role)

| Field | Contract |
|-------|----------|
| Count | Exactly one sample remote slot in v1 |
| Target entry | `./Demo` |
| Remote URL | Config-driven placeholder (not production hard-code) |
| On failure | User-visible fallback UI (see RemoteFallback component / page slot) |

## Rename guidance (documentation obligation)

Project guidance MUST state how to rename `./Demo` safely (update Webpack
`exposes`, shell remotes map, docs, and any typed contract aliases).
