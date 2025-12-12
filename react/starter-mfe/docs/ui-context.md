# UI context

<!--
  PURPOSE
  Evergreen UI / visual / component guidance for humans and agents
  (IDE-agnostic). Fill sections below; remove guidance comments as you go.

  RELATED DOCS (do not duplicate their jobs)
  - docs/coding-conventions.md        → code structure, data fetching, features
  - docs/project-overview.md          → product what/who/flows/scope
  - specs/.../contracts/theming.md    → normative theme/token requirements
  - specs/.../contracts/a11y-wcag.md  → WCAG AA CI requirements
  - .specify/memory/constitution.md   → composition-first UI, responsive/PWA

  AFTER A SESSION that locks visual or component decisions, update this file
  (same habit as coding-conventions.md / AGENTS.md).
-->

## Design language / brand

<!--
  Optional but useful for agents generating UI.
  Tone (calm, dense, playful), brand colors if any, reference sites,
  what to avoid (e.g. generic purple gradients, default system fonts only).
  If none yet, say “starter tokens only — no external brand.”
-->

_TODO: Brand / visual direction (or “tokens only for now”)._

## Design tokens

<!--
  Where tokens live, naming scheme, and how to extend them.
  Current starter: src/styles/tokens.css (CSS variables).
  Document categories you use: color, space, type, radius, shadow, z-index…
  Rule: components consume var(--…) — do not hardcode hex/px for themeable values.
-->

**Location:** `src/styles/tokens.css` (+ global base in `src/styles/global.scss`)

_TODO: Token naming rules, how to add a token, light vs dark overrides._

### Token inventory (optional table)

<!--
  Keep a short inventory or point agents at tokens.css.
  Example rows: --color-bg, --color-accent, --space-4, --font-sans, --radius
-->

| Token / group | Purpose | Notes |
|---------------|---------|-------|
| _TODO_ | | |

## Theming

<!--
  Document ThemeProvider behavior and federated ownership.
  Align with contracts/theming.md — this file can summarize for UI work;
  the contract remains the testable source of truth.
-->

**Mechanism:** `data-theme="light|dark"` on `document.documentElement` via
`src/app/providers/ThemeProvider.tsx`. Demo control: `ThemeToggle`.

_TODO: Confirm first-visit / persist / “Use system theme” rules for authors._

### Theme ownership (federation)

<!--
  shell → owns document theme when composing
  remote standalone → full ThemeProvider
  remote embedded (embedded={true}) → must NOT take over document theme
-->

_TODO: Any product-specific theme UX beyond the starter contract._

## Component conventions

<!--
  How UI building blocks are structured and when to add one.
-->

**Location:** `src/components/` (shared) vs `src/features/<name>/` (feature UI)

_TODO: Rules such as:_
<!--
  - Flat, composition-first components (constitution)
  - Co-locate Component.tsx, Component.module.scss, types.ts, Component.test.tsx
  - Prefer CSS modules + tokens; avoid inline styles for themeable surfaces
  - No third-party component library required in v1 (or document if/when allowed)
  - Shared primitives (Button, banners) vs feature-only UI
  - Props: keep public MF props in features/*/types and index.ts
-->

### Shared primitives inventory (optional)

| Component | Path | Role |
|-----------|------|------|
| Button | `src/components/Button/` | _TODO_ |
| ThemeToggle | `src/components/ThemeToggle/` | _TODO_ |
| ConnectionRequired | `src/components/ConnectionRequired/` | Offline banner |
| RemoteFallback | `src/components/RemoteFallback/` | Shell remote failure |

## Layout & composition

<!--
  Page vs layout vs feature: MainLayout, pages/*, features/*.
  Responsive: phone-width (~375px) primary flows; no primary horizontal scroll.
  Cards / density / spacing rules if you have them.
-->

_TODO: Layout patterns (chrome, max-width, breakpoints if any)._

## Typography & iconography

<!--
  Fonts (loaded where?), type scale if not only tokens, icon approach
  (inline SVG, sprite, none yet).
-->

_TODO: Type and icons._

## Motion

<!--
  Preferred motion (subtle transitions only, reduced-motion respect, none yet).
  Agents often over-animate; document limits.
-->

_TODO: Motion / prefers-reduced-motion policy._

## Accessibility

<!--
  Point at WCAG 2.2 AA CI contract; add product-specific UI a11y rules:
  focus visible, labels on icon buttons, live regions for banners, etc.
-->

**CI:** WCAG 2.2 AA audits (`npm run test:a11y` / contract `a11y-wcag.md`).

_TODO: Extra UI a11y conventions beyond “pass axe AA”._

## Content & copy

<!--
  Tone of UI strings, capitalization, error message patterns
  (e.g. offline: “internet connection required”).
-->

_TODO: Microcopy guidelines (optional)._

## Do / don’t (for agents)

<!--
  High-signal bullets agents should not violate when generating UI.
-->

- Prefer tokens (`var(--…)`) over hardcoded colors/spacing.
- Do not introduce a UI kit unless product explicitly allows it.
- Do not apply document `data-theme` / SW from an embedded federated Demo.
- _TODO: Add more do/don’t as you lock decisions._

## Links

| Doc | Role |
|-----|------|
| [coding-conventions.md](./coding-conventions.md) | Code structure & data fetching |
| [project-overview.md](./project-overview.md) | Product framing |
| [theming contract](../specs/001-react-role-scaffold/contracts/theming.md) | Normative theme/token rules |
| [a11y contract](../specs/001-react-role-scaffold/contracts/a11y-wcag.md) | WCAG AA CI |
| [tokens.css](../src/styles/tokens.css) | Live token values |
| [ThemeProvider](../src/app/providers/ThemeProvider.tsx) | Theme implementation |
