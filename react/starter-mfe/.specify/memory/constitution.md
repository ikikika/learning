<!--
Sync Impact Report
- Version change: 2.0.1 → 2.1.0
- Modified principles: none renamed
- Added sections / material expansions:
  - VI. Responsive Experience & PWA Readiness (new principle)
  - Technology Constraints → Styling & a11y expanded for responsive layouts
- Removed sections: none
- Clarifications: none
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (Constitution Check + Technical Context)
  - .specify/templates/spec-template.md ✅ (Assumptions guidance)
  - .specify/templates/tasks-template.md ✅ (polish / verification path note)
  - .cursor/skills/speckit-* ✅ reviewed (no skill edits required)
- Follow-up TODOs: none deferred
-->

# Starter MFE Constitution

## Core Principles

### I. Dual-Mode Portability

Each generated repository MUST contain one independently buildable and
deployable React application with an explicit role: host, remote, or
standalone.

- A remote repository MUST run in standalone development/test mode and as a
  federated remote without forking feature or domain logic.
- A host repository MUST run independently while loading remotes through
  configuration; it MUST NOT contain remote implementation code.
- A standalone repository MAY omit federation configuration, while preserving
  the canonical application structure so it can evolve into a host or remote.
- Feature UI and domain logic MUST live in modules that do not assume a
  specific host or sole ownership of the page.
- Host-only and remote-only wiring (bootstrap, Module Federation config,
  routing mount points) MUST stay in thin adapters at the edges.
- A remote change that breaks standalone OR federated operation is a
  constitution violation unless documented and justified in Complexity
  Tracking.

Rationale: One app per repository gives hosts and remotes independent
ownership and deployment while dual-mode remotes remain locally operable.

### II. Shared Runtime Singletons

Framework and peer runtimes that must be unique in the browser (at minimum
`react` and `react-dom`) MUST be shared as singletons across host and remotes.

- Shared dependency versions MUST be declared explicitly and negotiated;
  silent duplication of React (or equivalent) is forbidden.
- New shared peers require a documented ownership decision (who provides them,
  version range, and upgrade policy).
- Remotes MUST NOT bundle a second copy of a singleton-shared package for
  convenience.

Rationale: Duplicate React instances cause broken hooks, context loss, and
bloated bundles—the classic MFE failure mode.

### III. Explicit Host/Remote Contracts

Boundaries between host and remotes MUST be typed, versioned, and documented
before implementation.

- Each exposed remote module MUST have a declared public contract (props/events
  or equivalent) and a stable export name.
- Contract changes that break consumers are MAJOR; additive compatible changes
  are MINOR; clarifications are PATCH.
- Runtime loading MUST degrade safely: missing or failing remotes MUST show a
  defined fallback; uncaught remote failures MUST NOT take down the host.
- Cross-app communication MUST use explicit contracts (props, custom events,
  or a documented shared bus)—not undocumented globals.

Rationale: Implicit coupling is the main source of production MFE incidents.

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
- Host/remote contracts MUST have contract or integration coverage when
  federation is in scope for the feature.
- Standalone smoke paths and federated load paths MUST both be exercisable in
  CI (or an explicitly deferred equivalent with a tracked follow-up).
- Tests that only pass in one mode are insufficient for dual-mode features.

Rationale: Isolation that cannot be verified will regress under independent
remote deploys.

### VI. Responsive Experience & PWA Readiness

Frontend experiences MUST be mobile-responsive and Progressive Web App (PWA)
capable across repository roles (host, remote, and standalone).

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
- Host and remote PWAs MUST NOT assume exclusive control of the browser when
  composed; remotes MUST remain safe when embedded (no conflicting
  full-document PWA takeovers that break the host). Prefer host-owned
  install/offline UX when federated; remotes MAY still be PWA-capable in
  standalone mode.
- New UI work MUST state responsive and PWA impact in plans/PRs (verified,
  deferred with follow-up, or N/A with justification).

Rationale: This starter targets real-world multi-repo frontends used on phones
and desktops; installability and resilient loading are part of product quality,
not optional polish.

## Technology Constraints

- **Primary UI**: React with TypeScript for application and shared package code.
- **Packaging**: Federation MUST use Webpack Module Federation (not alternate
  federation runtimes unless Complexity Tracking justifies an exception).
  The production topology MUST be multi-repository:
  - one repository for the host;
  - one repository for each remote;
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
├── app/                  # host: App, providers, routes
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
    public `index.ts` (the natural unit for remote `exposes`).
  - Feature-specific api/hooks/services/types MUST stay inside that feature.
  - Host concerns (providers, route tables) MUST stay under `app/`.
  - Shared helpers MUST live under `core/` — do not add a parallel `lib/` for
    the same role.
  - Root `services/` is for cross-feature infra only, not domain services.
- **Styling, a11y & responsive**: UI MUST meet baseline accessibility
  expectations (keyboard reachability, semantic structure, discernible names)
  and MUST be mobile-responsive for primary flows. Visual systems SHOULD avoid
  one-off snowflake patterns that cannot be shared across remotes.
- **PWA**: Each application repository MUST include manifest + icons + service
  worker (or equivalent) baseline as required by Principle VI; federated
  composition MUST prefer host-owned install/offline UX.
- **Performance**: Avoid unnecessary waterfalls and duplicate framework weight;
  measure remote load cost when adding new federated surfaces.
- **Secrets & config**: No secrets in client bundles; environment-specific host
  and remote URLs MUST be configuration, not hard-coded production hosts in
  shared packages.

## Quality Gates & Workflow

- Spec Kit flow (`specify` → `plan` → `tasks` → `implement`, with `clarify` /
  `checklist` / `converge` as needed) is the default change process for
  non-trivial work.
- Every implementation plan MUST pass the Constitution Check gates before
  Phase 0 research is treated as complete, and again after Phase 1 design.
- Plans, PRs, and agent implementations MUST state the repository role
  (host, remote, or standalone). Remote changes MUST state standalone and
  federated impact and MUST NOT silently drop either mode.
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

**Version**: 2.1.0 | **Ratified**: 2026-07-30 | **Last Amended**: 2026-07-31
