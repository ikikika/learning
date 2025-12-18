# Contract: Remote public entry `./Demo`

## Scope

Applies when role is `remote` (and when a shell consumes this remote).

## Expose

| Expose name | Module | Notes |
|-------------|--------|-------|
| `./Demo` | `src/features/demo` (`index.ts`) | Default; rename guidance in README |

## Typed public API + version (FR-024 / SC-016)

| Field | Requirement |
|-------|-------------|
| Public types | Exported props/types from `features/demo` |
| `embedded?: boolean` | Shell MUST pass `embedded={true}` when mounting; omit or `false` = standalone |
| Contract version | **`1.0.0`** in README + this artifact |
| Package | Published npm contract package **not** required in v1 (Complexity Tracking) |

## Dual-mode rules

- Same module for standalone and federated (no forked business logic).
- When `embedded={true}`, the **`./Demo` module itself** MUST NOT take over
  full-document PWA or `data-theme` (federated path may load only this expose).
- Remote bootstrap ThemeProvider / `registerPwa` MUST apply only for the
  remote’s **standalone entry**, not as the federated suppression mechanism.
- Detection MUST NOT use undocumented globals or Module Federation container
  sniffing.

## Shell sample slot

| Field | Contract |
|-------|----------|
| Count | One in v1 |
| Target | `./Demo` |
| URL | Config placeholder |
| Mount | Pass `embedded={true}` |
| Failure | User-visible `RemoteFallback` for missing, unreachable, **empty/invalid URL**, or missing remotes map entry |

## Source layout

Demo and shell sample assets both live under `src/` permanently. Init does not
prune demo source when the role is shell (webpack/routes select the active
surface). Prefer one role per clone.

## Compose smoke (FR-023 / SC-015 / SC-019)

Harness MUST:

1. Create **two temporary workspaces** (copy/clone of this starter).
2. `init --role=shell` in one; `init --role=remote` in the other.
3. Start both; run Playwright asserting shell-owned PWA + `data-theme` and no
   remote takeover (`embedded={true}` on Demo).

Not a single-tree dual-role build.

## Rename guidance

Document updating Webpack `exposes`, shell remotes map, docs, types,
`embedded?: boolean`, and contract version notes.
