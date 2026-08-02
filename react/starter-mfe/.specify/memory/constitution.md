<!--
Sync Impact Report
- Version change: 2.1.0 → 2.2.0
- Modified principles:
  - I. Dual-Mode Portability (expanded: fourth role `hybrid`)
  - III. Explicit Host/Remote Contracts (nested hybrid composition /
    degrade-safely clarified)
  - VI. Responsive Experience & PWA Readiness (hybrid embed + team chrome)
- Added sections / material expansions:
  - Hybrid role obligations under I, Technology Constraints, Quality Gates
- Removed sections: none
- Clarifications:
  - One role per clone remains mandatory (including hybrid)
  - React singleton sharing and typed contracts unchanged; nested
    composition MUST degrade safely
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅
  - .specify/templates/spec-template.md ✅
  - .specify/templates/tasks-template.md ✅
  - .cursor/skills/speckit-* ✅ reviewed (no skill edits required)
- Runtime guidance:
  - AGENTS.md ✅ (role list + hybrid pointer)
  - README.md ✅ (constitutional role list; scaffold deferred note)
- Follow-up TODOs: hybrid init/scaffold/add-remote implementation is
  out of scope for this amendment (governance only)
-->

# Starter MFE Constitution

## Core Principles

### I. Dual-Mode Portability

Each generated repository MUST contain one independently buildable and
deployable React application with an explicit role: host, remote,
standalone, or hybrid.

- Exactly one role per clone. Init and tooling MUST NOT mix roles in a
  single repository.
- A remote repository MUST run in standalone development/test mode and as a
  federated remote without forking feature or domain logic.
- A host repository MUST run independently while loading remotes through
  configuration; it MUST NOT contain remote implementation code.
- A standalone repository MAY omit federation configuration, while preserving
  the canonical application structure so it can evolve into a host, remote,
  or hybrid.
- A hybrid repository (intermediate host / team shell) MUST:
  - Expose a stable federated entry for consumption by a parent host
    (remote-like expose contract).
  - Consume child remotes via configuration and host-style add-remote
    tooling (MUST NOT embed child remote source trees).
  - Run standalone for local team development without requiring a parent
    host.
  - Own team layout, theme tokens, and navigation when running standalone
    and when embedding child remotes inside its mount boundary.
  - When embedded in a parent shell, respect parent PWA/theme ownership via
    the public `embedded={true}` contract (no competing document-level
    PWA/theme takeover); still apply team visual chrome (layout, tokens,
    nav) inside its own mount boundary.
- Feature UI and domain logic MUST live in modules that do not assume a
  specific host or sole ownership of the page.
- Host-only, remote-only, and hybrid edge wiring (bootstrap, Module
  Federation config, routing mount points, add-remote registration) MUST
  stay in thin adapters at the edges.
- A remote or hybrid change that breaks standalone OR federated operation
  is a constitution violation unless documented and justified in Complexity
  Tracking.
- Nested composition (parent host → hybrid → child remote) MUST degrade
  safely: missing or failing child remotes MUST NOT take down the hybrid;
  a missing or failing hybrid MUST NOT take down the parent host.

Rationale: One app per repository gives independent ownership and
deployment. Hybrid enables team shells that are both composees and
composers without forking dual-mode portability.

### II. Shared Runtime Singletons

Framework and peer runtimes that must be unique in the browser (at minimum
`react` and `react-dom`) MUST be shared as singletons across host, hybrid,
and remotes.

- Shared dependency versions MUST be declared explicitly and negotiated;
  silent duplication of React (or equivalent) is forbidden.
- New shared peers require a documented ownership decision (who provides them,
  version range, and upgrade policy).
- Remotes and hybrids MUST NOT bundle a second copy of a singleton-shared
  package for convenience.

Rationale: Duplicate React instances cause broken hooks, context loss, and
bloated bundles—the classic MFE failure mode. Nested hybrid composition
amplifies the cost of duplication.

### III. Explicit Host/Remote Contracts

Boundaries between hosts, hybrids, and remotes MUST be typed, versioned, and
documented before implementation.

- Each exposed module (remote or hybrid federated entry) MUST have a
  declared public contract (props/events or equivalent) and a stable export
  name.
- Contract changes that break consumers are MAJOR; additive compatible
  changes are MINOR; clarifications are PATCH.
- Runtime loading MUST degrade safely: missing or failing remotes (including
  children of a hybrid) MUST show a defined fallback; uncaught remote
  failures MUST NOT take down the composing shell (host or hybrid).
- Cross-app communication MUST use explicit contracts (props, custom events,
  or a documented shared bus)—not undocumented globals.
- Nested composition MUST use the same contract discipline at every level
  (parent↔hybrid and hybrid↔child); undocumented globals for nest detection
  are forbidden. Prefer `embedded?: boolean` (or an equivalent documented
  prop) for embed-mode suppression of document-level ownership.

Rationale: Implicit coupling is the main source of production MFE incidents;
nested shells multiply the blast radius without typed boundaries.

### IV. Composition-First UI

UI MUST prefer composition over configuration and boolean-prop sprawl.

- Build flexible APIs with compound components, slots/children, and focused
  hooks rather than large prop matrices.
- Presentational surfaces SHOULD remain free of host/remote transport details.
- Shared UI used in both modes MUST not hard-depend on a specific host layout
  or router instance without an injectable adapter.
- Do NOT require Atomic Design folder taxonomies (`atoms` / `molecules` /
  `organisms`) or a nested `components/ui/` layer; place shared components at
  `components/[Component]/` and keep feature-local UI under `features/`.

Rationale: Composition scales for humans and agents; prop flags and rigid
visual taxonomies do not.

### V. Verifiable Isolation

Behavior MUST be independently testable at unit, contract, and mode levels.

- Domain and UI logic MUST be unit-testable without a running federation host.
- Host/hybrid/remote contracts MUST have contract or integration coverage when
  federation is in scope for the feature.
- Standalone smoke paths and federated load paths MUST both be exercisable in
  CI (or an explicitly deferred equivalent with a tracked follow-up). Hybrid
  MUST cover standalone, parent-embedded, and child-remote composition paths
  when those modes are in scope.
- Tests that only pass in one mode are insufficient for dual-mode or
  multi-mode features.

Rationale: Isolation that cannot be verified will regress under independent
remote deploys and nested shells.

### VI. Responsive Experience & PWA Readiness

Frontend experiences MUST be mobile-responsive and Progressive Web App (PWA)
capable across repository roles (host, remote, standalone, and hybrid).

- Layouts and shared UI MUST remain usable on small viewports (phone-width)
  without requiring horizontal scrolling for primary tasks, unless a Complexity
  Tracking entry justifies an exception (e.g., dense data grids with an
  explicit alternate mobile flow).
- Touch targets and spacing MUST remain operable on touch devices for primary
  actions.
- Responsive behavior MUST not fork business logic by device; adapt presentation
  through layout/CSS (or equivalent), not duplicated feature implementations.
- Applications MUST ship PWA baseline capability: a web app manifest, an
  installable/display identity (name, icons, display mode), and a service worker
  (or equivalent) that enables at least offline shell/caching for the app shell
  assets appropriate to the repository role.
- Host, hybrid, and remote PWAs MUST NOT assume exclusive control of the
  browser when composed. Prefer outermost-shell-owned install/offline UX when
  federated (parent host over hybrid; hybrid over child remotes when the hybrid
  is the standalone entry). Remotes and hybrids MUST remain safe when embedded
  (`embedded={true}`): no conflicting full-document PWA or document-theme
  takeovers. Hybrids MAY still own team theme tokens and chrome inside their
  mount boundary while embedded.
- Remotes and hybrids MAY still be fully PWA-capable in standalone mode.
- New UI work MUST state responsive and PWA impact in plans/PRs (verified,
  deferred with follow-up, or N/A with justification).

Rationale: This starter targets real-world multi-repo frontends used on phones
and desktops; installability and resilient loading are part of product quality,
not optional polish. Nested shells need clear document-ownership rules.

## Technology Constraints

- **Primary UI**: React with TypeScript for application and shared package code.
- **Packaging**: Federation MUST use Webpack Module Federation (not alternate
  federation runtimes unless Complexity Tracking justifies an exception).
  The production topology MUST be multi-repository:
  - one repository for the host (or hybrid acting as a team shell);
  - one repository for each remote (and each nested hybrid);
  - one root `src/` per application repository;
  - no required `apps/host`, `apps/remote-*`, or workspace `packages/` wrapper.
  Shared UI, configuration, and typed remote contracts MUST be published and
  consumed as explicitly versioned packages (normally through a package
  registry), not copied between repositories.
- **Application Layout**: Every application repository MUST place its React
  code in root `src/` using this canonical structure:

```text
src/
├── main.tsx              # MF-safe async entry (import bootstrap)
├── bootstrap.tsx         # createRoot + top-level providers
├── app/                  # host/hybrid: App, providers, routes
├── features/             # domain modules (public index.ts per feature)
├── pages/                # route-level screens
├── layouts/              # page chrome
├── components/           # shared UI; one folder per component (no ui/ taxonomy)
├── core/                 # shared constants, hooks, types, utils
├── services/             # app-wide infra (e.g. httpClient) only
├── styles/               # global styles / tokens entry
└── test/                 # test utils / setup for this app
```

  Rules for that layout:
  - Domain logic and feature UI MUST live under `features/<name>/` with a
    public `index.ts` (the natural unit for remote/hybrid `exposes`).
  - Feature-specific api/hooks/services/types MUST stay inside that feature.
  - Host and hybrid shell concerns (providers, route tables, remote
    registration) MUST stay under `app/`.
  - Shared helpers MUST live under `core/` — do not add a parallel `lib/` for
    the same role.
  - Root `services/` is for cross-feature infra only, not domain services.
- **Styling, a11y & responsive**: UI MUST meet baseline accessibility
  expectations (keyboard reachability, semantic structure, discernible names)
  and MUST be mobile-responsive for primary flows. Visual systems SHOULD avoid
  one-off snowflake patterns that cannot be shared across remotes. Hybrid
  team tokens/layout/nav are owned by the hybrid within its mount boundary.
- **PWA**: Each application repository MUST include manifest + icons + service
  worker (or equivalent) baseline as required by Principle VI; federated
  composition MUST prefer outermost-shell-owned install/offline UX.
- **Performance**: Avoid unnecessary waterfalls and duplicate framework weight;
  measure remote load cost when adding new federated surfaces (including
  hybrid→child and parent→hybrid).
- **Secrets & config**: No secrets in client bundles; environment-specific host,
  hybrid, and remote URLs MUST be configuration, not hard-coded production
  hosts in shared packages.

## Quality Gates & Workflow

- Spec Kit flow (`specify` → `plan` → `tasks` → `implement`, with `clarify` /
  `checklist` / `converge` as needed) is the default change process for
  non-trivial work.
- Every implementation plan MUST pass the Constitution Check gates before
  Phase 0 research is treated as complete, and again after Phase 1 design.
- Plans, PRs, and agent implementations MUST state the repository role
  (host, remote, standalone, or hybrid). Remote and hybrid changes MUST state
  standalone and federated impact and MUST NOT silently drop either mode.
  Hybrid changes MUST also state child-remote composition impact and
  parent-embed behavior (`embedded={true}` / team chrome boundary).
- Plans, PRs, and agent implementations MUST state responsive and PWA impact
  (verified, deferred with tracked follow-up, or justified N/A).
- Complexity beyond these principles MUST be recorded in the plan's Complexity
  Tracking table with a simpler alternative that was rejected and why.

## Governance

This constitution supersedes informal conventions and ad-hoc starter shortcuts.
Amendments REQUIRE:

1. An explicit edit to this file with semantic version bump:
   - **MAJOR**: Remove or redefine a principle in a backward-incompatible way.
   - **MINOR**: Add a principle/section or materially expand mandatory guidance.
   - **PATCH**: Clarifications, typos, non-semantic wording.
2. Propagation review of dependent Spec Kit templates and agent skills when
   gates or mandatory sections change.
3. A Sync Impact Report (HTML comment at top of this file) for each amendment.

Compliance:

- `/speckit-plan` Constitution Check is the primary gate.
- `/speckit-converge` treats MUST principles as authority for remediation tasks.
- Reviewers and agents MUST reject changes that violate MUST rules without an
  approved Complexity Tracking entry.
- Runtime guidance may live in README or agent skills; those documents MUST NOT
  contradict this constitution. On conflict, this file wins.

**Version**: 2.2.0 | **Ratified**: 2026-07-30 | **Last Amended**: 2026-08-02
