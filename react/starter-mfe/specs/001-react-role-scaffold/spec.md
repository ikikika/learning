# Feature Specification: React Role Scaffold

**Feature Branch**: `001-react-role-scaffold`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "scaffold a react project, with options to set it as either a standalone, shell or remote"

## Clarifications

### Session 2026-07-30

- Q: Scaffold delivery model → A: In-repo starter (this repository or a clone is configured for one role at init; not a separate generator that emits a new project)
- Q: How repository role is chosen → A: Required CLI/script flag (e.g. `--role=standalone|shell|remote`); no interactive prompt fallback
- Q: Default remote public entry name → A: `./Demo` (sample/demo feature entry; rename rules documented in project guidance)
- Q: Shell sample remote slots → A: One sample remote slot aligned with `./Demo`, with user-visible fallback when unavailable
- Q: Where chosen role is persisted → A: Both a machine-readable role file and a README/project-guidance mention

### Session 2026-07-31

- Q: Scaffold scope for responsive + PWA → A: MUST ship mobile-responsive sample UI and PWA baseline (manifest, icons, offline app-shell caching) for all roles
- Q: PWA ownership when federated → A: Shell owns install/offline UX when federated; remote is fully PWA-capable in standalone mode only (no competing install/SW takeover when embedded)
- Q: Offline PWA depth / no-network UX → A: When no network is detected, show message "internet connection required" (demo content requires connectivity; not a full offline app)
- Q: Re-running init after role is set → A: Refuse by default; allow overwrite only with explicit `--force` (plus required `--role`)
- Q: Design tokens / theming / component libraries in scaffold v1 → A: MUST ship CSS-variable tokens + ThemeProvider with `data-theme="light|dark"`, a demo toggle, and no third-party component library in v1
- Q: First-visit theme default and persistence → A: On first visit follow `prefers-color-scheme` (fallback `light`); after toggle, persist choice and ignore system until cleared
- Q: Theme ownership when shell + remote are composed → A: Shell owns document `data-theme` when federated; remote ThemeProvider + toggle apply in standalone only (no competing document-theme takeover when embedded)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scaffold a standalone app (Priority: P1)

A developer needs a ready-to-run single application repository for a product that does not participate in a microfrontend host/remote topology yet. They choose the **standalone** role during scaffold and receive a complete app they can start locally, develop features in, and deploy as one unit.

**Why this priority**: Standalone is the simplest path and the default learning/MVP path for many teams; it must work without any shell or remote setup.

**Independent Test**: Run init with `--role=standalone`, start the app locally, and verify a sample home screen loads without requiring any other repositories.

**Acceptance Scenarios**:

1. **Given** the developer runs init with `--role=standalone`, **When** init completes successfully, **Then** the result is a single-app repository marked as standalone and runnable on its own.
2. **Given** a completed standalone scaffold, **When** the developer starts the app locally on a phone-width viewport, **Then** they see a working sample screen usable without horizontal scrolling for the primary demo content, without configuring remote locations or shell settings.
3. **Given** a completed standalone scaffold, **When** the developer inspects project guidance and the role metadata file, **Then** the role is recorded as standalone in both places, the layout matches the canonical application structure, and PWA baseline artifacts (manifest, icons, service worker / equivalent) are present.
4. **Given** a completed standalone scaffold with no network connectivity, **When** the developer opens the app, **Then** they see a clear "internet connection required" (or equivalent) message.
5. **Given** a completed standalone scaffold, **When** the developer uses the demo theme toggle, **Then** the document root reflects `data-theme="dark"` or `data-theme="light"` and primary demo surfaces update via CSS-variable tokens (no third-party component library).

---

### User Story 2 - Scaffold a shell app (Priority: P2)

A developer needs a host/shell repository that owns navigation and composition of remotes owned by other repositories. They choose the **shell** role and receive an app that runs on its own while loading remotes from configuration, with a defined fallback when a remote is unavailable.

**Why this priority**: Shell is required for multi-repo microfrontend products; it must not embed remote business logic.

**Independent Test**: Run init with `--role=shell`, start the shell locally with no remotes available, and verify the shell still loads and shows the configured fallback for a missing remote.

**Acceptance Scenarios**:

1. **Given** the developer runs init with `--role=shell`, **When** init completes successfully, **Then** the result is a single-app repository marked as shell with exactly one sample remote slot configured for a `./Demo` entry and a placeholder remote location.
2. **Given** a completed shell scaffold, **When** that sample remote is unavailable, **Then** the shell remains usable and shows a defined fallback for that slot instead of a blank or hard crash.
3. **Given** a completed shell scaffold, **When** the developer reviews the repository contents, **Then** there is no remote feature implementation source—only shell/chrome, routing, and remote loading adapters—and the shell owns install/offline PWA UX for the composed experience.

---

### User Story 3 - Scaffold a remote app (Priority: P3)

A developer needs a remote repository that can be developed and tested alone and later consumed by a shell. They choose the **remote** role and receive an app that runs standalone and also exposes a stable public entry for a shell to load.

**Why this priority**: Remotes complete the multi-repo topology; dual-mode (standalone + federated) is a constitutional requirement.

**Independent Test**: Run init with `--role=remote`, start the app standalone and verify the sample capability works; verify documentation (or checklist) states the public expose name and that the same capability is intended for shell consumption.

**Acceptance Scenarios**:

1. **Given** the developer runs init with `--role=remote`, **When** init completes successfully, **Then** the result is a single-app repository marked as remote with public entry `./Demo` documented for shell consumption.
2. **Given** a completed remote scaffold, **When** the developer starts it in standalone mode, **Then** the sample capability is usable without a shell and the remote’s installable PWA baseline is available.
3. **Given** a completed remote scaffold, **When** a compatible shell is configured to load that public entry, **Then** the same capability is available inside the shell without forked business logic in the remote, and the remote does not take over shell install/offline PWA UX or document-level `data-theme` ownership.

---

### Edge Cases

- Developer runs init without `--role` (or equivalent required flag) → init MUST fail with a clear message that `--role=standalone|shell|remote` is required.
- Developer provides an unrecognized `--role` value → init MUST reject it with a clear message listing `standalone`, `shell`, and `remote`.
- Developer runs init again when role metadata already exists, without `--force` → init MUST fail with a clear message that re-init requires `--force`.
- Developer runs init with `--force` and a valid `--role` when role metadata exists → init MAY overwrite role configuration for the new role.
- Shell starts with empty or invalid remote location configuration → shell MUST still boot and use fallbacks for affected remotes.
- Remote public entry naming → remote init MUST use default public entry `./Demo` and project guidance MUST state how to rename it safely for real products.
- Developer expects one repository to be shell and remote at once → out of scope; scaffold produces exactly one role per repository.
- Primary demo content overflows horizontally at phone-width → constitution/scaffold violation; layouts MUST adapt without device-forked business logic.
- PWA baseline artifacts missing after successful init → constitution/scaffold violation for all roles.
- Embedded remote registers a competing full-document PWA install/offline takeover → constitution/scaffold violation.
- Embedded remote applies competing document-level `data-theme` / ThemeProvider takeover against the shell → constitution/scaffold violation.
- No network detected and no "internet connection required" (or equivalent) message shown → scaffold violation; full offline demo content is out of scope.
- Theme toggle missing or `data-theme` not applied on the document root → scaffold violation for all roles.
- First visit ignores OS `prefers-color-scheme` when no persisted theme exists (or fails to fall back to `light`) → scaffold violation.
- After a theme toggle, subsequent visits do not restore the persisted choice → scaffold violation.
- Scaffold depends on a third-party component library (e.g. MUI, Chakra, Ant, shadcn as a required kit) for the sample UI → out of scope / violation for v1.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Scaffold MUST configure **this** application repository (or a clone of this starter) as exactly one independently buildable and deployable app—not generate a separate sibling project directory via an external generator.
- **FR-002**: Init MUST require an explicit CLI/script flag `--role` (or documented equivalent) whose value is exactly one of `standalone`, `shell`, or `remote`; interactive prompts and silent defaults MUST NOT be used to choose the role.
- **FR-003**: Init MUST persist the chosen role in (1) a dedicated machine-readable role metadata file at the repository root and (2) human-readable project guidance (README or equivalent) so contributors and scripts can both discover the role without guessing.
- **FR-004**: Regardless of role, the scaffolded application MUST use the starter’s canonical application layout (app shell areas, features, pages, layouts, shared components, core utilities, app-wide services, styles, and local test utilities).
- **FR-005**: A `standalone` scaffold MUST run as a complete single application without requiring shell or remote configuration.
- **FR-006**: A `shell` scaffold MUST include configuration for exactly one sample remote location targeting public entry `./Demo`, and MUST keep remote business logic out of the shell repository.
- **FR-007**: A `shell` scaffold MUST define user-visible fallback behavior when that sample remote fails to load or is missing.
- **FR-008**: A `remote` scaffold MUST run in standalone development/demo mode and MUST declare stable public entry `./Demo` for shell consumption (documented; rename guidance included).
- **FR-009**: A `remote` scaffold MUST keep feature/domain logic shared between standalone and federated use (no forked business implementations).
- **FR-010**: Scaffold MUST include a minimal sample capability sufficient to demonstrate the chosen role (home/demo screen for standalone; shell chrome + one `./Demo` remote slot/fallback for shell; exposable `./Demo` sample feature for remote).
- **FR-011**: Scaffold MUST provide clear local start instructions so a developer can verify the chosen role within one local session.
- **FR-012**: Dedicated role-migration tooling beyond init is out of scope. Changing role after first init MUST use init again with both `--role` and an explicit `--force` flag (or manual amend); init without `--force` MUST NOT overwrite an existing role metadata file.
- **FR-013**: A separate multi-project generator CLI (creating new repos from templates outside this tree) is out of scope for this feature.
- **FR-014**: Regardless of role, scaffold output MUST be mobile-responsive for primary demo flows (usable at phone-width without horizontal scrolling for primary content) and MUST NOT fork demo business logic by device.
- **FR-015**: Regardless of role, scaffold output MUST include Progressive Web App baseline capability: web app manifest, installable/display identity (name, icons, display mode), and a service worker (or equivalent) supporting app-shell asset handling as needed for installability.
- **FR-016**: When role is `shell`, the shell MUST own install/offline PWA UX for the composed experience. When role is `remote`, full installable PWA behavior MUST apply in standalone mode; when the remote is embedded in a shell, it MUST NOT register a competing full-document install/offline takeover that breaks the shell.
- **FR-017**: When the application detects no network connectivity, it MUST show a clear user-visible message exactly conveying that an internet connection is required (wording: "internet connection required" or equivalent clear phrasing). Full offline use of demo/product content is out of scope for v1.
- **FR-018**: If role metadata already exists, init MUST refuse to proceed unless `--force` is provided together with a valid `--role`.
- **FR-019**: Regardless of role, scaffold output MUST include design tokens as CSS variables (under the canonical styles area) and MUST NOT require a third-party component library for the sample UI in v1.
- **FR-020**: Regardless of role, scaffold output MUST include ThemeProvider machinery that applies `data-theme="light"` or `data-theme="dark"` on the document root and MUST expose a demo control to switch themes so the behavior is verifiable in a local session.
- **FR-021**: Theme selection MUST follow this lifecycle: on first visit (no persisted choice), use the OS `prefers-color-scheme` preference with fallback to `light`; after the user toggles theme, persist that choice and use it on subsequent visits (ignoring system preference until the persisted choice is cleared).
- **FR-022**: When role is `shell`, the shell MUST own document-level `data-theme` / ThemeProvider UX for the composed experience. When role is `remote`, full ThemeProvider + demo toggle behavior MUST apply in standalone mode; when the remote is embedded in a shell, it MUST NOT apply a competing document-level theme takeover that overrides the shell.

### Key Entities

- **Repository Role**: One of `standalone`, `shell`, or `remote`; selected only via required `--role` flag at init; exactly one per repository; persisted in a root role metadata file and in project guidance.
- **Scaffold Result**: This repository after role init—application contents, role metadata file, and guidance for the selected role (in-place configuration of the starter, not a newly emitted external project).
- **Role Metadata File**: Machine-readable record of the chosen repository role written at init for scripts/CI and contributor tooling.
- **Remote Public Entry**: Named, stable surface a shell can load from a remote repository (remote role only); default sample name is `./Demo`.
- **Remote Location Config**: Shell-side settings for where remotes load from (shell role only); v1 includes exactly one sample slot for `./Demo`.
- **Remote Fallback**: User-visible substitute when the sample remote cannot be loaded (shell role only).
- **Theme**: `light` or `dark`; applied via `data-theme` on the document root; driven by ThemeProvider and CSS-variable tokens; first visit uses `prefers-color-scheme` (fallback `light`); after toggle, choice is persisted and preferred over system until cleared; demo toggle required; when federated, shell owns document theme; remote theme machinery is for standalone; third-party UI kits out of scope for v1.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer who knows the intended role can complete scaffold and see a running sample screen for that role in under 15 minutes on a typical developer machine.
- **SC-002**: 100% of successful init runs write the selected role to both the role metadata file and project guidance.
- **SC-003**: For standalone scaffolds, local verification succeeds with no other repositories running.
- **SC-004**: For shell scaffolds, local verification succeeds even when no remotes are reachable, and the fallback is visible for the single sample `./Demo` remote slot.
- **SC-005**: For remote scaffolds, local standalone verification succeeds, and public entry `./Demo` is documented for shell wiring.
- **SC-006**: In a review of scaffold output against starter rules, reviewers find no remote business logic inside a shell scaffold and no missing dual-mode expectation for a remote scaffold.
- **SC-007**: For every role, primary demo content remains usable at phone-width without horizontal scrolling.
- **SC-008**: For every role, scaffold output includes a web app manifest, icons, and PWA baseline (service worker / equivalent) that can be verified in a local session.
- **SC-009**: In a composed shell+remote review, install/offline PWA UX is owned by the shell; the embedded remote does not present a competing install/offline takeover.
- **SC-010**: When network connectivity is unavailable, users see a clear "internet connection required" (or equivalent) message rather than a silent failure or blank screen.
- **SC-011**: Re-running init when role metadata exists fails without `--force`, and succeeds in overwriting role configuration when `--force` and a valid `--role` are provided.
- **SC-012**: For every role, a developer can toggle light/dark theme in the sample UI and observe `data-theme` change on the document root with token-driven visual update, without installing a third-party component library.
- **SC-013**: With no persisted theme, first load respects `prefers-color-scheme` (or `light` if unavailable); after a toggle, a reload restores the persisted theme rather than reverting to system preference.
- **SC-014**: In a composed shell+remote review, document-level `data-theme` is owned by the shell; the embedded remote does not present a competing theme takeover.

## Assumptions

- This feature is an **in-repo starter**: developers clone or open this repository and choose a role at init so **this** tree becomes the shell, remote, or standalone app.
- This feature configures **one application repository per init** in a multi-repository topology (separate repos for shell and each remote over time; each repo runs its own role init).
- Role selection happens **only via a required `--role` CLI/script flag** at init (not interactive prompts, config-first edit, or silent defaults).
- After successful init, the chosen role is persisted in **both** a root machine-readable role metadata file and human-readable project guidance (README or equivalent).
- The scaffold targets a **React** single-page application experience consistent with this starter’s constitution; detailed tooling choices are deferred to planning.
- For remote role, the default public entry name is **`./Demo`** (demo-grade; rename guidance ships with the scaffold).
- Shared UI/config/contract packages may be referenced later; v1 scaffold MAY ship without mandatory external shared packages.
- Scaffold v1 MUST ship **mobile-responsive** sample UI and **PWA baseline** (manifest, icons, service worker / equivalent) for all roles, consistent with the project constitution.
- When federated, **shell owns install/offline PWA UX**; remotes are fully PWA-capable in standalone mode and MUST NOT take over the shell’s install/offline experience when embedded.
- When offline / no network is detected, the app MUST show **"internet connection required"** (or equivalent clear phrasing); full offline demo/product content is out of scope for v1.
- For shell role, v1 includes **exactly one** sample remote slot wired for `./Demo` (additional remotes are developer-added later).
- Developers using the shell role will replace the sample remote location with real remote URLs when integrating real remotes.
- Mobile-native apps, backend APIs, and auth product features are out of scope unless needed as thin placeholders for demo screens.
- Post-scaffold dedicated migration tooling is out of scope; changing role uses `init --role=… --force` (or manual amend) (FR-012, FR-018).
- External generator CLIs that emit new projects outside this repository are out of scope (FR-013).
- Exact on-disk name of the role metadata file is deferred to planning (must be root-level and machine-readable).
- Scaffold v1 MUST ship **CSS-variable design tokens**, **ThemeProvider** with **`data-theme="light|dark"`**, and a **demo theme toggle**; **no third-party component library** is required or shipped as the sample UI foundation in v1.
- Theme default: first visit follows **`prefers-color-scheme`** (fallback **`light`**); after toggle, the choice is **persisted** and used on later visits until cleared.
- When federated, **shell owns document-level `data-theme` / ThemeProvider UX**; remotes provide full theme toggle behavior in standalone mode and MUST NOT take over the shell’s document theme when embedded.
- Cross-repo shared theme-sync packages are out of scope for v1.
