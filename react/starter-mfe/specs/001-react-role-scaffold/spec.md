# Feature Specification: React Role Scaffold

**Feature Branch**: `001-react-role-scaffold`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "scaffold a react project, with options to set it as either a standalone, shell or remote"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scaffold a standalone app (Priority: P1)

A developer needs a ready-to-run single application repository for a product that does not participate in a microfrontend host/remote topology yet. They choose the **standalone** role during scaffold and receive a complete app they can start locally, develop features in, and deploy as one unit.

**Why this priority**: Standalone is the simplest path and the default learning/MVP path for many teams; it must work without any shell or remote setup.

**Independent Test**: Choose standalone, scaffold, start the app locally, and verify a sample home screen loads without requiring any other repositories.

**Acceptance Scenarios**:

1. **Given** the developer starts scaffold, **When** they select role `standalone`, **Then** the result is a single-app repository marked as standalone and runnable on its own.
2. **Given** a completed standalone scaffold, **When** the developer starts the app locally, **Then** they see a working sample screen without configuring remote locations or shell settings.
3. **Given** a completed standalone scaffold, **When** the developer inspects project guidance, **Then** the role is documented as standalone and the layout matches the canonical application structure expected by this starter.

---

### User Story 2 - Scaffold a shell app (Priority: P2)

A developer needs a host/shell repository that owns navigation and composition of remotes owned by other repositories. They choose the **shell** role and receive an app that runs on its own while loading remotes from configuration, with a defined fallback when a remote is unavailable.

**Why this priority**: Shell is required for multi-repo microfrontend products; it must not embed remote business logic.

**Independent Test**: Choose shell, scaffold, start the shell locally with no remotes available, and verify the shell still loads and shows the configured fallback for a missing remote.

**Acceptance Scenarios**:

1. **Given** the developer starts scaffold, **When** they select role `shell`, **Then** the result is a single-app repository marked as shell with configuration placeholders for remote locations.
2. **Given** a completed shell scaffold, **When** a configured remote is unavailable, **Then** the shell remains usable and shows a defined fallback instead of a blank or hard crash.
3. **Given** a completed shell scaffold, **When** the developer reviews the repository contents, **Then** there is no remote feature implementation source—only shell/chrome, routing, and remote loading adapters.

---

### User Story 3 - Scaffold a remote app (Priority: P3)

A developer needs a remote repository that can be developed and tested alone and later consumed by a shell. They choose the **remote** role and receive an app that runs standalone and also exposes a stable public entry for a shell to load.

**Why this priority**: Remotes complete the multi-repo topology; dual-mode (standalone + federated) is a constitutional requirement.

**Independent Test**: Choose remote, scaffold, start the app standalone and verify the sample capability works; verify documentation (or checklist) states the public expose name and that the same capability is intended for shell consumption.

**Acceptance Scenarios**:

1. **Given** the developer starts scaffold, **When** they select role `remote`, **Then** the result is a single-app repository marked as remote with a documented public entry name for shell consumption.
2. **Given** a completed remote scaffold, **When** the developer starts it in standalone mode, **Then** the sample capability is usable without a shell.
3. **Given** a completed remote scaffold, **When** a compatible shell is configured to load that public entry, **Then** the same capability is available inside the shell without forked business logic in the remote.

---

### Edge Cases

- Developer attempts scaffold without choosing a role → scaffold MUST refuse to proceed until exactly one role is selected.
- Developer provides an unrecognized role value → scaffold MUST reject it with a clear message listing `standalone`, `shell`, and `remote`.
- Shell starts with empty or invalid remote location configuration → shell MUST still boot and use fallbacks for affected remotes.
- Remote public entry name conflicts with reserved/invalid naming → scaffold MUST use a documented default sample entry name and state rename rules in project guidance.
- Developer expects one repository to be shell and remote at once → out of scope; scaffold produces exactly one role per repository.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Scaffold MUST produce exactly one independently buildable and deployable application repository per run.
- **FR-002**: Scaffold MUST require the developer to choose exactly one repository role: `standalone`, `shell`, or `remote`.
- **FR-003**: Scaffold MUST persist the chosen role in project guidance so later contributors can see the repository role without guessing.
- **FR-004**: Regardless of role, the scaffolded application MUST use the starter’s canonical application layout (app shell areas, features, pages, layouts, shared components, core utilities, app-wide services, styles, and local test utilities).
- **FR-005**: A `standalone` scaffold MUST run as a complete single application without requiring shell or remote configuration.
- **FR-006**: A `shell` scaffold MUST include configuration for remote locations and MUST keep remote business logic out of the shell repository.
- **FR-007**: A `shell` scaffold MUST define user-visible fallback behavior when a configured remote fails to load or is missing.
- **FR-008**: A `remote` scaffold MUST run in standalone development/demo mode and MUST declare a stable public entry intended for shell consumption.
- **FR-009**: A `remote` scaffold MUST keep feature/domain logic shared between standalone and federated use (no forked business implementations).
- **FR-010**: Scaffold MUST include a minimal sample capability sufficient to demonstrate the chosen role (home/demo screen for standalone; shell chrome + remote slot/fallback for shell; exposable sample feature for remote).
- **FR-011**: Scaffold MUST provide clear local start instructions so a developer can verify the chosen role within one local session.
- **FR-012**: Changing an existing repository’s role after scaffold (e.g., standalone → remote migration tooling) is out of scope for this feature; developers MUST re-scaffold or amend manually.

### Key Entities

- **Repository Role**: One of `standalone`, `shell`, or `remote`; selected at scaffold time; exactly one per repository.
- **Scaffold Result**: The generated application repository contents and guidance for the selected role.
- **Remote Public Entry**: Named, stable surface a shell can load from a remote repository (remote role only).
- **Remote Location Config**: Shell-side settings that point to where remotes are loaded from (shell role only).
- **Remote Fallback**: User-visible substitute when a remote cannot be loaded (shell role only).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer who knows the intended role can complete scaffold and see a running sample screen for that role in under 15 minutes on a typical developer machine.
- **SC-002**: 100% of successful scaffold runs result in exactly one selected role recorded in project guidance.
- **SC-003**: For standalone scaffolds, local verification succeeds with no other repositories running.
- **SC-004**: For shell scaffolds, local verification succeeds even when no remotes are reachable, and the fallback is visible for the sample remote slot.
- **SC-005**: For remote scaffolds, local standalone verification succeeds, and the public entry name is documented for shell wiring.
- **SC-006**: In a review of scaffold output against starter rules, reviewers find no remote business logic inside a shell scaffold and no missing dual-mode expectation for a remote scaffold.

## Assumptions

- This feature scaffolds **one application repository per run** in a multi-repository topology (separate repos for shell and each remote over time).
- Role selection happens **at scaffold/init time** as a required explicit choice (not inferred silently).
- The scaffold targets a **React** single-page application experience consistent with this starter’s constitution; detailed tooling choices are deferred to planning.
- Sample content is **demo-grade** (enough to prove the role), not a full product domain.
- Shared UI/config/contract packages may be referenced later; v1 scaffold MAY ship without mandatory external shared packages.
- Developers using the shell role will supply real remote URLs/locations in configuration when integrating real remotes.
- Mobile-native apps, backend APIs, and auth product features are out of scope unless needed as thin placeholders for demo screens.
- Post-scaffold role migration tooling is out of scope (FR-012).
