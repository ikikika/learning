# Feature Specification: React Role Scaffold

**Feature Branch**: `001-react-role-scaffold`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "scaffold a react project, with options to set it as either a standalone, host or remote"

## Clarifications

### Session 2026-07-30

- Q: Scaffold delivery model → A: In-repo starter (this repository or a clone is configured for one role at init; not a separate generator that emits a new project)
- Q: How repository role is chosen → A: Required CLI/script flag (e.g. `--role=standalone|host|remote`); no interactive prompt fallback
- Q: Default remote public entry name → A: `./Demo` (sample/demo feature entry; rename rules documented in project guidance)
- Q: Host sample remote slots → A: One sample remote slot aligned with `./Demo`, with user-visible fallback when unavailable
- Q: Where chosen role is persisted → A: Both a machine-readable role file and a README/project-guidance mention

### Session 2026-07-31

- Q: Scaffold scope for responsive + PWA → A: MUST ship mobile-responsive sample UI and PWA baseline (manifest, icons, offline app-shell caching) for all roles
- Q: PWA ownership when federated → A: Host owns install/offline UX when federated; remote is fully PWA-capable in standalone mode only (no competing install/SW takeover when embedded)
- Q: Offline PWA depth / no-network UX → A: When no network is detected, show message "internet connection required" (demo content requires connectivity; not a full offline app)
- Q: Re-running init after role is set → A: Refuse by default; allow overwrite only with explicit `--force` (plus required `--role`)
- Q: Design tokens / theming / component libraries in scaffold v1 → A: MUST ship CSS-variable tokens + ThemeProvider with `data-theme="light|dark"`, a demo toggle, and no third-party component library in v1
- Q: First-visit theme default and persistence → A: On first visit follow `prefers-color-scheme` (fallback `light`); after toggle, persist choice and ignore system until cleared
- Q: Theme ownership when host + remote are composed → A: Host owns document `data-theme` when federated; remote ThemeProvider + toggle apply in standalone only (no competing document-theme takeover when embedded)
- Q: Host init vs sample demo feature source on disk → A: Init prunes remote-only source for host (removes `src/features/demo` and demo-only pages), leaving host chrome, routes, and remote loader adapters
- Q: Composed host+remote PWA/theme ownership verification → A: v1 MUST include an automated compose smoke (host + remote) that asserts host owns PWA install/offline and document `data-theme`; remote does not take over
- Q: Typed/versioned `./Demo` public contract in v1 → A: Ship in-repo typed public API for `./Demo` (exported props/types in `features/demo`) plus a documented contract version (e.g. `1.0.0`) in project guidance / contracts artifact
- Q: How persisted theme is cleared → A: Demo includes an explicit “Use system theme” (or equivalent) control that clears the persisted choice and re-applies `prefers-color-scheme` (fallback `light`)
- Q: How demo source is restored after host prune → A: Init copies from pristine templates kept in-repo (e.g. `templates/role-assets/demo/`); prune deletes only the live `src/` copy
- Q: How automated compose smoke produces host + remote → A: Compose harness copies/clones the repo into two temp workspaces, runs `init --role=host` and `init --role=remote` in each, starts both, then Playwright asserts ownership
- Q: What happens to HomePage on host init → A: Host init always removes `src/pages/HomePage`; host uses only `HostHomePage`. Restore from templates with demo assets when forcing standalone/remote
- Q: Baseline a11y / touch for demo controls in v1 → A: Require full WCAG 2.2 AA audit tooling in v1 CI
- Q: Remaining LOW findings (FR duplication / per-role theme smoke / ~2s perf) → A: FR-012 = scope-only “no migration tool”; FR-018 = `--force` behavior; per-role automated smoke MUST assert theme toggle/`data-theme` for standalone, host, and remote-standalone; ~2s interactive goal aspirational (no hard CI perf gate in v1)
- Q: How an embedded remote detects it is inside a host (prop name/shape) → A: Optional boolean prop `embedded?: boolean` on the `./Demo` public contract — host passes `embedded={true}`; omit or `false` means standalone; no undocumented globals or runtime container sniffing
- Q: Fate of host-only assets on `--force` to standalone/remote → A: Symmetric prune: delete live host-only assets (`HostHomePage`, host routes, remote loader adapters); keep pristine copies under `templates/role-assets/host/` and restore them on host init
- Q: Exact layout under role-asset templates → A: Each templates bucket mirrors live `src/` relative paths (e.g. `templates/role-assets/demo/features/demo/`, `…/pages/HomePage/`; host bucket mirrors `pages/HostHomePage/`, `app/remotes/loadDemoRemote.tsx`, `app/routes/hostRoutes.tsx`); restore is a straight copy into matching `src/` paths
- Q: Constitution published-contract packaging MUST in v1 → A: Defer published npm contract package; v1 ships in-repo typed `./Demo` + version `1.0.0` only; record as Complexity Tracking exception (Principle III still met via typed/versioned in-repo contract)
- Q: SC-013 theme first-visit + reload in automated smoke → A: Per-role Playwright MUST assert (1) first visit with cleared storage → `prefers-color-scheme`/`light` and (2) toggle → reload → same `data-theme` for standalone, host, and remote-standalone (not unit tests alone); use-system clear is SC-017
- Q: Empty/invalid host remote-location config verification → A: Host automated smoke MUST also cover empty/invalid remote URL (or missing remotes map entry) and still show `RemoteFallback` (unreachable remote alone is not sufficient)
- Q: Where `embedded={true}` suppresses PWA/theme takeover → A: Suppression lives on the `./Demo` module when `embedded={true}`; remote bootstrap ThemeProvider/`registerPwa` only run for standalone entry (federated path does not rely on remote bootstrap)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scaffold a standalone app (Priority: P1)

A developer needs a ready-to-run single application repository for a product that does not participate in a microfrontend host/remote topology yet. They choose the **standalone** role during scaffold and receive a complete app they can start locally, develop features in, and deploy as one unit.

**Why this priority**: Standalone is the simplest path and the default learning/MVP path for many teams; it must work without any host or remote setup.

**Independent Test**: Run init with `--role=standalone`, start the app locally, and verify a sample home screen loads without requiring any other repositories.

**Acceptance Scenarios**:

1. **Given** the developer runs init with `--role=standalone`, **When** init completes successfully, **Then** the result is a single-app repository marked as standalone and runnable on its own.
2. **Given** a completed standalone scaffold, **When** the developer starts the app locally on a phone-width viewport, **Then** they see a working sample screen usable without horizontal scrolling for the primary demo content, without configuring remote locations or host settings.
3. **Given** a completed standalone scaffold, **When** the developer inspects project guidance and the role metadata file, **Then** the role is recorded as standalone in both places, the layout matches the canonical application structure, and PWA baseline artifacts (manifest, icons, service worker / equivalent) are present.
4. **Given** a completed standalone scaffold with no network connectivity, **When** the developer opens the app, **Then** they see a clear "internet connection required" (or equivalent) message.
5. **Given** a completed standalone scaffold, **When** the developer uses the demo theme toggle, **Then** the document root reflects `data-theme="dark"` or `data-theme="light"` and primary demo surfaces update via CSS-variable tokens (no third-party component library).
6. **Given** a completed standalone scaffold, **When** the developer chooses “Use system theme” (or equivalent), **Then** the persisted choice is cleared and the app re-applies `prefers-color-scheme` (fallback `light`).
7. **Given** CI for a completed scaffold, **When** WCAG 2.2 AA audit tooling runs against the primary demo route, **Then** the job fails if AA violations are reported.
---

### User Story 2 - Scaffold a host app (Priority: P2)

A developer needs a host/host repository that owns navigation and composition of remotes owned by other repositories. They choose the **host** role and receive an app that runs on its own while loading remotes from configuration, with a defined fallback when a remote is unavailable.

**Why this priority**: Host is required for multi-repo microfrontend products; it must not embed remote business logic.

**Independent Test**: Run init with `--role=host`, start the host locally with no remotes available, and verify the host still loads and shows the configured fallback for a missing remote.

**Acceptance Scenarios**:

1. **Given** the developer runs init with `--role=host`, **When** init completes successfully, **Then** the result is a single-app repository marked as host with exactly one sample remote slot configured for a `./Demo` entry and a placeholder remote location.
2. **Given** a completed host scaffold, **When** that sample remote is unavailable, **Then** the host remains usable and shows a defined fallback for that slot instead of a blank or hard crash.
3. **Given** a completed host scaffold, **When** the developer reviews the repository contents, **Then** remote-only sample source is absent—including `src/features/demo` and `src/pages/HomePage`—and only host/chrome, routing, remote loading adapters, and `HostHomePage` remain; the host owns install/offline PWA UX for the composed experience.
4. **Given** a completed host scaffold, **When** CI WCAG 2.2 AA audit tooling runs against the host primary route, **Then** the job fails if AA violations are reported.

---

### User Story 3 - Scaffold a remote app (Priority: P3)

A developer needs a remote repository that can be developed and tested alone and later consumed by a host. They choose the **remote** role and receive an app that runs standalone and also exposes a stable public entry for a host to load.

**Why this priority**: Remotes complete the multi-repo topology; dual-mode (standalone + federated) is a constitutional requirement.

**Independent Test**: Run init with `--role=remote`, start the app standalone and verify the sample capability works; verify documentation (or checklist) states the public expose name and that the same capability is intended for host consumption.

**Acceptance Scenarios**:

1. **Given** the developer runs init with `--role=remote`, **When** init completes successfully, **Then** the result is a single-app repository marked as remote with public entry `./Demo` documented for host consumption, including exported public types/props and a documented contract version.
2. **Given** a completed remote scaffold, **When** the developer starts it in standalone mode, **Then** the sample capability is usable without a host and the remote’s installable PWA baseline is available.
3. **Given** a completed remote scaffold, **When** a compatible host is configured to load that public entry, **Then** the same capability is available inside the host without forked business logic in the remote, and the remote does not take over host install/offline PWA UX or document-level `data-theme` ownership.
4. **Given** host and remote scaffolds from this starter, **When** the automated compose smoke runs, **Then** it verifies host-owned PWA install/offline UX and document `data-theme`, and that the embedded remote does not take over either.
5. **Given** the compose harness, **When** it prepares the smoke, **Then** it uses two temporary workspaces (copy/clone), initializes one as host and one as remote, starts both, and only then runs the ownership assertions.

---

### Edge Cases

- Developer runs init without `--role` (or equivalent required flag) → init MUST fail with a clear message that `--role=standalone|host|remote` is required.
- Developer provides an unrecognized `--role` value → init MUST reject it with a clear message listing `standalone`, `host`, and `remote`.
- Developer runs init again when role metadata already exists, without `--force` → init MUST fail with a clear message that re-init requires `--force`.
- Developer runs init with `--force` and a valid `--role` when role metadata exists → init MAY overwrite role configuration for the new role.
- After host prune, `--force --role=standalone|remote` cannot restore demo source → scaffold violation; init MUST copy from pristine in-repo templates (not rely on git checkout alone).
- Host starts with empty or invalid remote location configuration → host MUST still boot and use fallbacks for affected remotes; automated host smoke MUST cover this case (not only unreachable remotes).
- Remote public entry naming → remote init MUST use default public entry `./Demo` and project guidance MUST state how to rename it safely for real products.
- Developer expects one repository to be host and remote at once → out of scope; scaffold produces exactly one role per repository.
- Primary demo content overflows horizontally at phone-width → constitution/scaffold violation; layouts MUST adapt without device-forked business logic.
- WCAG 2.2 AA audit tooling missing from CI, or CI ignores AA failures on primary demo routes → scaffold violation for v1.
- PWA baseline artifacts missing after successful init → constitution/scaffold violation for all roles.
- Embedded remote registers a competing full-document PWA install/offline takeover → constitution/scaffold violation.
- Remote infers embedded mode from an undocumented global or container sniffing instead of the **`embedded?: boolean`** prop → scaffold violation.
- Host mounts `./Demo` without passing `embedded={true}` (or remote ignores `embedded={true}`) → scaffold violation for composed ownership.
- Embedded remote applies competing document-level `data-theme` / ThemeProvider takeover against the host → constitution/scaffold violation.
- No network detected and no "internet connection required" (or equivalent) message shown → scaffold violation; full offline demo content is out of scope.
- Theme toggle missing or `data-theme` not applied on the document root → scaffold violation for all roles.
- First visit ignores OS `prefers-color-scheme` when no persisted theme exists (or fails to fall back to `light`) → scaffold violation.
- After a theme toggle, subsequent visits do not restore the persisted choice → scaffold violation.
- Persisted theme cannot be cleared via an explicit “Use system theme” (or equivalent) demo control → scaffold violation.
- Scaffold depends on a third-party component library (e.g. MUI, Chakra, Ant, shadcn as a required kit) for the sample UI → out of scope / violation for v1.
- Host init leaves remote-only sample feature source (e.g. `src/features/demo`) on disk → constitution/scaffold violation; init MUST prune that source for host.
- Host init leaves `src/pages/HomePage` on disk → scaffold violation; host MUST use only `HostHomePage` (HomePage restored from templates when forcing standalone/remote).
- Init to `standalone` or `remote` leaves live host-only sample assets (`HostHomePage`, host routes, remote loader adapters) on disk → scaffold violation; those paths MUST be pruned from live `src/` and restored from `templates/role-assets/host/` only when initializing as host.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Scaffold MUST configure **this** application repository (or a clone of this starter) as exactly one independently buildable and deployable app—not generate a separate sibling project directory via an external generator.
- **FR-002**: Init MUST require an explicit CLI/script flag `--role` (or documented equivalent) whose value is exactly one of `standalone`, `host`, or `remote`; interactive prompts and silent defaults MUST NOT be used to choose the role.
- **FR-003**: Init MUST persist the chosen role in (1) a dedicated machine-readable role metadata file at the repository root and (2) human-readable project guidance (README or equivalent) so contributors and scripts can both discover the role without guessing.
- **FR-004**: Regardless of role, the scaffolded application MUST use the starter’s canonical application layout (app shell areas, features, pages, layouts, shared components, core utilities, app-wide services, styles, and local test utilities).
- **FR-005**: A `standalone` scaffold MUST run as a complete single application without requiring host or remote configuration.
- **FR-006**: A `host` scaffold MUST include configuration for exactly one sample remote location targeting public entry `./Demo`, and MUST keep remote business logic out of the host repository. Init for `host` MUST prune remote-only sample source from the tree—at minimum `src/features/demo` and **`src/pages/HomePage`**—leaving host chrome, routes, remote loading adapters, and **`HostHomePage` only** (no live `HomePage`).
- **FR-007**: A `host` scaffold MUST define user-visible fallback behavior when that sample remote fails to load or is missing. Fallback MUST also apply when the sample remote location is empty or invalid (e.g. empty URL or missing remotes map entry), not only when a configured remote is unreachable.
- **FR-008**: A `remote` scaffold MUST run in standalone development/demo mode and MUST declare stable public entry `./Demo` for host consumption (documented; rename guidance included).
- **FR-009**: A `remote` scaffold MUST keep feature/domain logic shared between standalone and federated use (no forked business implementations).
- **FR-010**: Scaffold MUST include a minimal sample capability sufficient to demonstrate the chosen role (home/demo screen for standalone; host chrome + one `./Demo` remote slot/fallback for host; exposable `./Demo` sample feature for remote).
- **FR-011**: Scaffold MUST provide clear local start instructions so a developer can verify the chosen role within one local session.
- **FR-012**: Dedicated role-migration tooling beyond init is out of scope for this feature (no separate migrate/role-switch CLI). Role changes use init again with `--role` and `--force` as specified in FR-018.
- **FR-013**: A separate multi-project generator CLI (creating new repos from templates outside this tree) is out of scope for this feature.
- **FR-014**: Regardless of role, scaffold output MUST be mobile-responsive for primary demo flows (usable at phone-width without horizontal scrolling for primary content) and MUST NOT fork demo business logic by device.
- **FR-015**: Regardless of role, scaffold output MUST include Progressive Web App baseline capability: web app manifest, installable/display identity (name, icons, display mode), and a service worker (or equivalent) supporting app-shell asset handling as needed for installability.
- **FR-016**: When role is `host`, the host MUST own install/offline PWA UX for the composed experience. When role is `remote`, full installable PWA behavior MUST apply in standalone mode; when the remote is embedded in a host, it MUST NOT register a competing full-document install/offline takeover that breaks the host. Embedded mode MUST be detected only via the optional boolean prop **`embedded?: boolean`** on `./Demo` (FR-024): host passes `embedded={true}`; omit/`false` means standalone; undocumented globals or runtime container sniffing MUST NOT be used. Suppression MUST be enforced by the **`./Demo` module** when `embedded={true}`; remote standalone bootstrap PWA registration is not the federated-path control point.
- **FR-017**: When the application detects no network connectivity, it MUST show a clear user-visible message exactly conveying that an internet connection is required (wording: "internet connection required" or equivalent clear phrasing). Full offline use of demo/product content is out of scope for v1.
- **FR-018**: If role metadata already exists, init MUST refuse to proceed unless `--force` is provided together with a valid `--role`.
- **FR-019**: Regardless of role, scaffold output MUST include design tokens as CSS variables (under the canonical styles area) and MUST NOT require a third-party component library for the sample UI in v1.
- **FR-020**: Regardless of role, scaffold output MUST include ThemeProvider machinery that applies `data-theme="light"` or `data-theme="dark"` on the document root and MUST expose a demo control to switch themes so the behavior is verifiable in a local session.
- **FR-021**: Theme selection MUST follow this lifecycle: on first visit (no persisted choice), use the OS `prefers-color-scheme` preference with fallback to `light`; after the user toggles theme, persist that choice and use it on subsequent visits (ignoring system preference until the persisted choice is cleared). The demo MUST include an explicit “Use system theme” (or equivalent) control that clears the persisted choice and re-applies `prefers-color-scheme` (fallback `light`).
- **FR-022**: When role is `host`, the host MUST own document-level `data-theme` / ThemeProvider UX for the composed experience. When role is `remote`, full ThemeProvider + demo toggle behavior MUST apply in standalone mode; when the remote is embedded in a host, it MUST NOT apply a competing document-level theme takeover that overrides the host. Embedded mode MUST be detected via the same **`embedded?: boolean`** prop as FR-016/FR-024; suppression MUST be enforced by the **`./Demo` module** when `embedded={true}` (remote standalone ThemeProvider is for standalone entry only).
- **FR-023**: v1 MUST include an automated compose smoke path that runs a host against a remote from this starter and asserts (1) host owns install/offline PWA UX, (2) host owns document-level `data-theme`, and (3) the embedded remote does not take over either. The harness MUST prepare two temporary workspaces (copy/clone of this starter), run `init --role=host` in one and `init --role=remote` in the other, start both, then execute the assertions (not a single-tree dual-role build).
- **FR-024**: The `./Demo` public entry MUST expose an in-repo typed public API (exported props/types from the demo feature module) and MUST document a contract version (e.g. `1.0.0`) in project guidance and/or the feature contracts artifact; a published shared npm contract package is not required in v1. That typed contract MUST include an optional boolean prop **`embedded?: boolean`**: the host MUST pass `embedded={true}` when mounting the entry; when the prop is omitted or `false`, the remote MUST behave as standalone. When `embedded` is `true`, the **`./Demo` module itself** MUST suppress full-document PWA and `data-theme` ownership (federated consumption may load only this expose). Remote bootstrap ThemeProvider and PWA registration MUST apply only for the remote’s **standalone entry**, not as the mechanism for embedded suppression.
- **FR-025**: Role-specific sample assets MUST use symmetric prune/restore via in-repo templates (git checkout alone is not sufficient). Each templates bucket MUST mirror live `src/` relative paths so restore is a straight copy into the matching `src/` destinations (no remap table):
  - **Demo templates** under `templates/role-assets/demo/` (e.g. `features/demo/`, `pages/HomePage/`): host init MUST delete only the live `src/` copies; init with `--force` to `standalone` or `remote` MUST restore those live paths by copying from demo templates.
  - **Host templates** under `templates/role-assets/host/` with these mirrored paths: `pages/HostHomePage/`, `app/remotes/loadDemoRemote.tsx`, `app/routes/hostRoutes.tsx`: init for `standalone` or `remote` MUST delete only the live host-only `src/` copies; init for `host` (including `--force`) MUST restore those live paths by copying from host templates.
- **FR-026**: v1 MUST include automated WCAG 2.2 AA audit tooling in CI (e.g. axe or equivalent against primary demo routes for each role under test) and MUST fail the pipeline when AA violations are reported for those routes.

### Key Entities

- **Repository Role**: One of `standalone`, `host`, or `remote`; selected only via required `--role` flag at init; exactly one per repository; persisted in a root role metadata file and in project guidance.
- **Scaffold Result**: This repository after role init—application contents, role metadata file, and guidance for the selected role (in-place configuration of the starter, not a newly emitted external project).
- **Role Metadata File**: Machine-readable record of the chosen repository role written at init for scripts/CI and contributor tooling.
- **Role Asset Templates**: Pristine in-repo trees under `templates/role-assets/demo/` and `templates/role-assets/host/` that mirror live `src/` relative paths (demo: `features/demo/`, `pages/HomePage/`; host: `pages/HostHomePage/`, `app/remotes/loadDemoRemote.tsx`, `app/routes/hostRoutes.tsx`) and are copied straight into matching `src/` destinations on role restore.
- **Remote Public Entry**: Named, stable surface a host can load from a remote repository (remote role only); default sample name is `./Demo`; includes in-repo exported public types/props and a documented contract version (e.g. `1.0.0`); carries optional boolean prop **`embedded?: boolean`** (`true` = host-mounted; omit/`false` = standalone) that switches off remote document-level PWA/theme ownership; published shared contract package not required in v1.
- **Remote Location Config**: Host-side settings for where remotes load from (host role only); v1 includes exactly one sample slot for `./Demo`.
- **Remote Fallback**: User-visible substitute when the sample remote cannot be loaded (host role only).
- **Theme**: `light` or `dark`; applied via `data-theme` on the document root; driven by ThemeProvider and CSS-variable tokens; first visit uses `prefers-color-scheme` (fallback `light`); after toggle, choice is persisted and preferred over system until cleared via an explicit “Use system theme” (or equivalent) demo control; demo light/dark toggle required; when federated, host owns document theme; remote theme machinery is for standalone; third-party UI kits out of scope for v1.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer who knows the intended role can complete scaffold and see a running sample screen for that role in under 15 minutes on a typical developer machine.
- **SC-002**: 100% of successful init runs write the selected role to both the role metadata file and project guidance.
- **SC-003**: For standalone scaffolds, local verification succeeds with no other repositories running.
- **SC-004**: For host scaffolds, local verification succeeds even when no remotes are reachable, and the fallback is visible for the single sample `./Demo` remote slot. Automated host smoke MUST also cover empty/invalid remote location config (empty URL or missing remotes map entry) and still show the fallback.
- **SC-005**: For remote scaffolds, local standalone verification succeeds, and public entry `./Demo` is documented for host wiring with exported public types and a documented contract version.
- **SC-006**: In a review of scaffold output against starter rules, reviewers find no `src/features/demo` and no `src/pages/HomePage` inside a host scaffold (only `HostHomePage` for home), and no missing dual-mode expectation for a remote scaffold.
- **SC-007**: For every role, primary demo content remains usable at phone-width without horizontal scrolling.
- **SC-008**: For every role, scaffold output includes a web app manifest, icons, and PWA baseline (service worker / equivalent) that can be verified in a local session.
- **SC-009**: In a composed host+remote review, install/offline PWA UX is owned by the host; the embedded remote does not present a competing install/offline takeover.
- **SC-010**: When network connectivity is unavailable, users see a clear "internet connection required" (or equivalent) message rather than a silent failure or blank screen.
- **SC-011**: Re-running init when role metadata exists fails without `--force`, and succeeds in overwriting role configuration when `--force` and a valid `--role` are provided.
- **SC-012**: For every role (standalone, host, and remote-standalone), automated per-role smoke MUST assert that the developer can toggle light/dark theme and observe `data-theme` change on the document root with token-driven visual update, without installing a third-party component library.
- **SC-013**: With no persisted theme, first load respects `prefers-color-scheme` (or `light` if unavailable); after a toggle, a reload restores the persisted theme rather than reverting to system preference. Automated per-role Playwright smoke for standalone, host, and remote-standalone MUST assert (1) **first visit with cleared storage** → system preference or `light`, and (2) **toggle → reload → same `data-theme`** (unit tests alone are not sufficient). Clearing persistence via “Use system theme” is covered by **SC-017**.
- **SC-014**: In a composed host+remote review, document-level `data-theme` is owned by the host; the embedded remote does not present a competing theme takeover.
- **SC-015**: An automated compose smoke (host + remote from this starter) passes asserting host-owned PWA and document theme ownership with no remote takeover.
- **SC-016**: For remote scaffolds, reviewers can locate the `./Demo` typed public API (exported props/types) and the documented contract version without a published shared npm package.
- **SC-017**: After a theme is persisted, choosing “Use system theme” (or equivalent) clears persistence and re-applies `prefers-color-scheme` (fallback `light`).
- **SC-018**: After a role switch with `--force`, live role-specific sample assets are restored from pristine in-repo templates (`templates/role-assets/demo/` for standalone/remote; `templates/role-assets/host/` for host) and the opposite role’s live sample assets are absent, so the app is runnable for the selected role.
- **SC-019**: The compose harness creates two temporary workspaces, initializes them as host and remote respectively, starts both, and only then runs ownership assertions (product tree remains one role per init).
- **SC-020**: CI runs WCAG 2.2 AA audit tooling against primary demo routes for roles under test and fails on reported AA violations.

## Assumptions

- This feature is an **in-repo starter**: developers clone or open this repository and choose a role at init so **this** tree becomes the host, remote, or standalone app.
- This feature configures **one application repository per init** in a multi-repository topology (separate repos for host and each remote over time; each repo runs its own role init).
- Role selection happens **only via a required `--role` CLI/script flag** at init (not interactive prompts, config-first edit, or silent defaults).
- After successful init, the chosen role is persisted in **both** a root machine-readable role metadata file and human-readable project guidance (README or equivalent).
- The scaffold targets a **React** single-page application experience consistent with this starter’s constitution; detailed tooling choices are deferred to planning.
- For remote role, the default public entry name is **`./Demo`** (demo-grade; rename guidance ships with the scaffold).
- Shared UI/config/contract packages may be referenced later; v1 scaffold MUST ship without a mandatory published shared contract package. This is an explicit **Complexity Tracking** exception to the constitution Technology Constraint that shared typed contracts are normally published packages: Principle III is still satisfied by an in-repo typed, versioned `./Demo` public API (FR-024 / SC-016).
- Scaffold v1 MUST ship **mobile-responsive** sample UI and **PWA baseline** (manifest, icons, service worker / equivalent) for all roles, consistent with the project constitution.
- When federated, **host owns install/offline PWA UX**; remotes are fully PWA-capable in standalone mode and MUST NOT take over the host’s install/offline experience when embedded.
- When offline / no network is detected, the app MUST show **"internet connection required"** (or equivalent clear phrasing); full offline demo/product content is out of scope for v1.
- For host role, v1 includes **exactly one** sample remote slot wired for `./Demo` (additional remotes are developer-added later).
- Developers using the host role will replace the sample remote location with real remote URLs when integrating real remotes.
- Mobile-native apps, backend APIs, and auth product features are out of scope unless needed as thin placeholders for demo screens.
- Post-scaffold dedicated migration tooling is out of scope (FR-012); changing role uses `init --role=… --force` per FR-018 (or manual amend).
- External generator CLIs that emit new projects outside this repository are out of scope (FR-013).
- Interactive-route “under ~2s on broadband” is an **aspirational** plan performance goal for v1—not a hard CI gate or success-criterion failure.
- Exact on-disk name of the role metadata file is **`starter.role.json`** (root-level, machine-readable).
- Per-role automated smoke MUST cover theme toggle/`data-theme` for **standalone, host, and remote-standalone** (SC-012), and MUST assert **first visit (cleared storage) → system/`light`**, **toggle → reload → same `data-theme`**, and use-system clear for those roles (SC-013 / SC-017).
- Scaffold v1 MUST ship **CSS-variable design tokens**, **ThemeProvider** with **`data-theme="light|dark"`**, and a **demo theme toggle**; **no third-party component library** is required or shipped as the sample UI foundation in v1.
- Theme default: first visit follows **`prefers-color-scheme`** (fallback **`light`**); after toggle, the choice is **persisted** and used on later visits until cleared via an explicit **“Use system theme”** (or equivalent) demo control.
- When federated, **host owns document-level `data-theme` / ThemeProvider UX**; remotes provide full theme toggle behavior in standalone mode and MUST NOT take over the host’s document theme when embedded. Federated suppression is via **`./Demo`** with `embedded={true}`; remote bootstrap ThemeProvider is standalone-entry only.
- Cross-repo shared theme-sync packages are out of scope for v1.
- For `host` init, remote-only sample source MUST be **pruned** from the tree: at minimum `src/features/demo` and **`src/pages/HomePage`**; host retains chrome, routes, remote loading adapters, and **`HostHomePage` only**.
- Pristine role sample assets MUST live under in-repo **templates** that **mirror `src/` relative paths**: `templates/role-assets/demo/` (e.g. `features/demo/`, `pages/HomePage/`) and `templates/role-assets/host/` (`pages/HostHomePage/`, `app/remotes/loadDemoRemote.tsx`, `app/routes/hostRoutes.tsx`). Role init MUST prune the opposite role’s live sample assets and restore the selected role’s live paths by straight-copying from the matching templates into `src/`.
- Composed PWA/theme ownership (SC-009, SC-014) MUST be proven by an **automated compose smoke** in v1 (not optional manual-only).
- Compose harness MUST use **two temporary workspaces** (copy/clone → init host + init remote → start both → assert); not a single-tree dual-role build.
- v1 MUST ship **WCAG 2.2 AA audit tooling in CI** that fails on AA violations for primary demo routes (not a deferred polish check).
- `./Demo` ships an **in-repo typed public API** plus a **documented contract version**; published `@scope/remote-contracts` (or equivalent) is out of scope for v1 and MUST be recorded in plan Complexity Tracking as a deferred constitution packaging exception.
