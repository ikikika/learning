# Contract: Theming & design tokens

## Tokens (all roles)

| Artifact | Requirement |
|----------|-------------|
| CSS variables | `src/styles/tokens.css` (or equivalent) |
| Light | `:root` / `data-theme="light"` |
| Dark | `[data-theme="dark"]` |
| UI kit | No required third-party component library in v1 |

## ThemeProvider + `data-theme`

| Behavior | Requirement |
|----------|-------------|
| Attribute | `data-theme="light"\|"dark"` on `document.documentElement` |
| Light/dark control | Demo toggle |
| First visit | `prefers-color-scheme`; fallback `light` |
| After toggle | Persist; restore on reload |
| Clear | **“Use system theme”** clears persistence |
| Per-role smoke (SC-012) | Assert theme toggle/`data-theme` for **standalone, shell, and remote-standalone** |
| Per-role smoke (SC-013) | Assert **first visit (cleared storage) → system/`light`** and **toggle → reload → same `data-theme`** for those three roles (unit tests alone insufficient); use-system clear is **SC-017** |

## Ownership when federated

| Role | Document theme |
|------|----------------|
| shell | Owns composed experience (entry ThemeProvider) |
| remote (standalone) | Full ThemeProvider + controls on standalone entry |
| remote (embedded) | `./Demo` with `embedded={true}` MUST NOT take over document theme |
| standalone | Owns own ThemeProvider |

## Compose smoke

Assert shell-owned `data-theme` with no remote takeover
([remote-demo.md](./remote-demo.md)).
