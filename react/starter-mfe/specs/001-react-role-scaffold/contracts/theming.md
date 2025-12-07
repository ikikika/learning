# Contract: Theming & design tokens

## Tokens (all roles)

| Artifact | Requirement |
|----------|-------------|
| CSS variables | Present under `src/styles/tokens.css` (or equivalent styles entry) |
| Light baseline | `:root` (or `data-theme="light"`) defines the light token set |
| Dark overrides | `[data-theme="dark"]` defines dark token overrides |
| Component library | **No** required third-party UI kit (MUI/Chakra/Ant/shadcn/etc.) for sample UI in v1 |

## ThemeProvider + `data-theme`

| Behavior | Requirement |
|----------|-------------|
| Attribute | `data-theme="light"` or `data-theme="dark"` on `document.documentElement` |
| Demo control | Theme toggle present so behavior is verifiable locally |
| First visit | If no persisted choice: follow `prefers-color-scheme`; fallback `light` |
| After toggle | Persist choice; subsequent visits use persisted value (ignore system until cleared) |

## Ownership when federated

| Role | Document theme UX |
|------|-------------------|
| shell | Owns `data-theme` / ThemeProvider for the composed experience |
| remote (standalone) | Full ThemeProvider + toggle |
| remote (embedded) | MUST NOT apply competing document-level theme takeover |
| standalone | Owns its own ThemeProvider + toggle |

Cross-repo theme-sync packages are **out of contract** for v1.
