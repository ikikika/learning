# Contract: Remote public entry (PascalCase expose → App)

## Scope

Applies when role is `remote` (and when a shell consumes this remote).

## Expose

| Expose name | Module | Notes |
|-------------|--------|-------|
| `./{PascalCaseName}` | `src/app/App.tsx` | Derived from init `--name` (e.g. `my-checkout` → `./MyCheckout`) |

Init writes `expose` on `starter.role.json` for remote role. Webpack MF
`exposes` uses that key → `./src/app/App.tsx`.

## Typed public API + version (FR-024 / SC-016)

| Field | Requirement |
|-------|-------------|
| Public entry | `App` (`embedded?: boolean` optional) from `src/app/App.tsx` |
| Sample feature | `features/demo` remains the standalone home demo; contract version `1.0.0` |
| `embedded?: boolean` | Shell MUST pass `embedded={true}` when mounting; omit or `false` = standalone |
| Contract version | **`1.0.0`** in README + this artifact |
| Package | Published npm contract package **not** required in v1 (Complexity Tracking) |

## Dual-mode rules

- Federated path mounts `App` (routes). Standalone entry wraps providers + `App`.
- When `embedded={true}`, the federated module MUST NOT take over full-document
  PWA or `data-theme` (providers stay on the standalone entry only).
- Detection MUST NOT use undocumented globals or Module Federation container
  sniffing.

## Shell sample slot

| Field | Contract |
|-------|----------|
| Count | One or more via `remotes[]` |
| Target | PascalCase expose matching the remote’s `--name` |
| URL | Config placeholder / `urlEnv` |
| Mount | Pass `embedded={true}` |
| Failure | User-visible `RemoteFallback` for missing, unreachable, **empty/invalid URL**, or missing remotes map entry |

## Source layout

Demo and shell sample assets both live under `src/` permanently. Init does not
prune demo source when the role is shell (webpack/routes select the active
surface). Prefer one role per clone.

## Compose smoke (SC-009 / SC-014 / SC-015 / SC-019)

1. Two temporary workspaces (copy/clone of this starter).
2. `init --role=shell --port=…` in one; `init --role=remote --port=…` in the other.
3. Start both; Playwright asserts shell owns PWA install/offline UX and document
   `data-theme`; embedded remote does not take over either.
4. Shell mounts with `embedded={true}`.

## Rename

Changing `--name` (re-init with `--force`) updates `expose` / shell `remotes[]`
snippet. Keep Webpack exposes, shell remotes map, and docs aligned.
