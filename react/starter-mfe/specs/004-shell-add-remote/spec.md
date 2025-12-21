# Feature Specification: Shell add-remote command

**Feature Branch**: `004-shell-add-remote`

**Created**: 2026-08-02

**Status**: Draft

**Input**: User description: "after i init a shell, i want the ability to add several remotes to it, one at a time by running npm add remote. the remotes would already be running in separate ports. the script should amend the proper files in the shell repo to properly register the remote and make sure the internal routes in the remote works. any changes made by this spec should not affect the existing functionalities of standalone and remote. shell should be able to pass different props to different remotes."

## Clarifications

### Session 2026-08-02

- Q: How should developers supply per-remote host props? → A: Both — optional props on `add-remote`, plus later **hand-edit** of the same per-alias `remoteProps` association (no dedicated props-update CLI in v1)
- Q: What location input must add-remote accept for an already-running remote? → A: Either full federated entry URL or port (port expands via project conventions)
- Q: If per-remote props reference an unregistered alias, what should happen? → A: Ignore those props; registered remotes load normally
- Q: How should developers perform later edits to an existing alias’s props association? → A: Hand-edit shell config only in v1 (documented; no dedicated update CLI)
- Q: How should SC-006 (distinct props per remote) be made observable in this starter? → A: Sample remote MUST visibly reflect at least one host-supplied prop when embedded
- Q: (/speckit-analyze C1) Must composed smoke require reaching a second internal remote route? → A: Yes — automated smoke MUST assert default route and navigation to a second internal route (e.g. Route 2) inside the panel
- Q: (/speckit-analyze C2) How to verify mount with no custom props? → A: Explicit acceptance — registered remote with no `remoteProps` entry still mounts with composition defaults only
- Q: (/speckit-analyze C3) How to verify distinct props and stale props in CI? → A: Automated check MUST show two remotes with different visible host titles; orphan `remoteProps` alias MUST be ignored without failing shell load
- Q: (/speckit-analyze C4) Is documented hand-edit enough for FR-016 validation in v1? → A: Yes — README/quickstart hand-edit steps are the v1 validation path (no update CLI)
- Q: (/speckit-analyze U1) How does sample Route 1 receive host `title`? → A: Federated entry provides a React context (or equivalent in-remote provider) from mount props; Route 1 reads `title` from that context — not shell router coupling
- Q: (/speckit-analyze U2/I1) CLI flags and props reader location? → A: add-remote MUST honor full CLI contract flags (`--alias`, `--url`|`--port`, `--name`, `--expose`, `--federation-name`, `--url-env`, `--props`); bake reader lives in `remotes.ts` (`getRemoteProps`) — no separate `remoteProps.ts` module required

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register one running remote on a shell (Priority: P1)

A developer has initialized this repo as a **shell** and has one or more remote apps already running on their own ports. They run the project’s add-remote command once with enough identity and location details for that remote. The shell configuration is updated so the new remote appears as a selectable host entry and can be loaded into the shell panel without editing federation wiring by hand.

**Why this priority**: Without a repeatable add path, composing multiple remotes after shell init is manual and error-prone; this is the core value of the feature.

**Independent Test**: On a shell-initialized workspace with empty or existing remotes, run add-remote for one live remote URL; confirm metadata/env/nav registration and that opening that remote in the shell shows the remote’s default content.

**Acceptance Scenarios**:

1. **Given** a shell-initialized repository with no remotes configured, **When** the developer runs add-remote for a remote that is already serving its federated entry on a known URL/port, **Then** the shell persists that remote’s registration and the shell UI offers a nav entry for it.
2. **Given** the registration succeeded, **When** the developer opens that remote from the shell nav, **Then** the shell loads the remote into the panel (or shows the existing safe fallback if the remote becomes unreachable) without crashing the host.
3. **Given** a successful add-remote, **When** the developer inspects shell configuration artifacts the command owns, **Then** those artifacts include the new remote consistently (identity, expose, and URL/env wiring aligned).

---

### User Story 2 - Add several remotes one at a time (Priority: P1)

The same developer repeats add-remote for additional remotes, each already running on a different port. Each invocation adds exactly one remote and leaves previously registered remotes intact.

**Why this priority**: Multi-remote composition is an explicit goal; incremental registration must not wipe or corrupt prior entries.

**Independent Test**: Run add-remote twice with distinct remotes; confirm both appear in shell nav and both can be selected independently.

**Acceptance Scenarios**:

1. **Given** a shell already has remote A registered, **When** the developer runs add-remote for remote B, **Then** both A and B remain registered and both appear as selectable shell entries.
2. **Given** remotes A and B are registered, **When** the developer selects A then B in the shell nav, **Then** each selection loads the corresponding remote into the panel (subject to reachability).

---

### User Story 3 - Pass different props per remote (Priority: P1)

When the shell loads remotes into the panel, the host can supply **different props for different remotes**. Remote A can receive props tailored to A’s contract; remote B can receive a different set for B. Selecting another remote must not apply the previous remote’s props.

**Why this priority**: Multi-remote shells need distinct host→remote contracts per slot; a single shared props bag would couple remotes incorrectly.

**Independent Test**: Register (or configure) two remotes with distinct host-supplied props; open each in the shell panel and verify each remote’s sample UI reflects only its own prop(s).

**Acceptance Scenarios**:

1. **Given** remotes A and B are registered with distinct host-defined props for each, **When** the developer opens remote A, **Then** A is mounted with A’s props (and not B’s props) and A’s sample UI reflects A’s prop value.
2. **Given** the same configuration, **When** the developer then opens remote B, **Then** B is mounted with B’s props (and not A’s props) and B’s sample UI reflects B’s prop value.
3. **Given** a remote has no custom props configured (no `remoteProps` entry for its alias), **When** it is opened in the shell, **Then** it still loads with the host’s required composition defaults (including embedded/host-owned chrome behavior) and does not inherit another remote’s custom props; sample UI MUST NOT show a host title element.
4. **Given** a remote was registered with optional props via add-remote, **When** the developer later hand-edits that alias’s props in the documented shell configuration and restarts the shell as documented, **Then** the next mount of that remote in the shell uses the updated props (without requiring a full re-add of the remote).
5. **Given** `remoteProps` contains an orphan alias not present in `remotes[]`, **When** the shell starts and registered remotes are opened, **Then** the orphan entry is ignored and registered remotes still load normally.

---

### User Story 4 - Remote internal routes still work when composed (Priority: P1)

After a remote is registered and loaded in the shell, the remote’s own sample/internal routes remain usable inside the composed panel experience (default entry and additional routes the remote already exposes as its own app), including when host-supplied props are present.

**Why this priority**: Registration and per-remote props are insufficient if composing the remote breaks its internal navigation/content surfaces.

**Independent Test**: Register a remote that has more than one internal route and optional host props; load it in the shell; verify the default remote surface appears; navigate to the second internal route and verify its content appears (required, not optional).

**Acceptance Scenarios**:

1. **Given** a registered remote with a default route and at least one additional internal route, **When** that remote is opened in the shell panel, **Then** the remote’s default route content is visible (e.g. Route 1).
2. **Given** that remote is loaded in the shell panel, **When** the developer (or automated smoke) navigates to the remote’s second internal route (e.g. Route 2) using the remote’s own routing means, **Then** that route’s content is visible in the panel and the shell host does not crash.

---

### User Story 5 - Standalone and remote roles stay unchanged (Priority: P1)

Developers using standalone or remote clones (or the same repo initialized as those roles) must not lose existing behavior because of this feature. The add-remote command and per-remote host props are shell composition concerns only.

**Why this priority**: Explicit non-regression constraint from the request and constitution dual-mode isolation.

**Independent Test**: Run existing standalone and remote smoke/contract expectations after the feature lands; run add-remote on a non-shell role and confirm it refuses safely without mutating standalone/remote sample surfaces.

**Acceptance Scenarios**:

1. **Given** a repository initialized as standalone or remote, **When** the developer runs add-remote, **Then** the command fails with a clear role error and does not change shell-only registration files in a way that alters standalone/remote runtime behavior.
2. **Given** the feature is implemented in the shared starter tree, **When** standalone and remote primary flows are exercised, **Then** they behave as before (home/demo or remote sample routes unchanged by this feature’s shell tooling).
3. **Given** a remote running as its own app (not inside the shell), **When** no shell props are supplied, **Then** that remote’s own-app behavior remains unchanged.

---

### Edge Cases

- Duplicate alias or identity: command MUST reject or clearly refuse to overwrite without an explicit force/replace path (default: reject duplicate).
- Missing/invalid location (neither usable URL nor port, or invalid values): command MUST fail before writing a partial registration.
- Remote entry temporarily down at add time: registration of config MAY succeed if the developer supplied a valid URL shape; load-time MUST still use existing host fallback when unreachable.
- Non-shell role invocation: MUST error and write nothing material for remotes registration.
- Empty remotes list after shell init: first add-remote MUST work without requiring a prior `--remote` at init.
- Restart/rebuild of the shell may be required for new federation wiring to take effect; the command MUST tell the developer if a restart is needed.
- Missing props for one remote while others have props: that remote MUST load with composition defaults only; MUST NOT receive another remote’s props.
- Props configured for an unknown/unregistered alias: MUST be ignored; registered remotes MUST continue to load normally (stale props entries MUST NOT take down the host).
- Prop keys that overlap host-required composition flags: host-required composition behavior (e.g. embedded/host-owned chrome) MUST remain authoritative and MUST NOT be overridden by per-remote custom props.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST provide an npm script entry (documented as `npm run add-remote`) that registers exactly one remote per successful invocation on a shell-initialized repository.
- **FR-002**: add-remote MUST accept identity flags (`--alias` required; optional `--name`, `--expose`, `--federation-name`, `--url-env` with project defaults) and locate the federated entry via either `--url` (full http(s) entry URL) **or** `--port` (expanded with project host/path conventions). Exactly one of `--url` / `--port` is required.
- **FR-003**: On success, add-remote MUST amend all shell-owned registration artifacts required for the host to list, resolve, and load that remote (metadata remotes list, generated loaders if applicable, env/URL keys, and any other shell wiring this starter already uses for remotes).
- **FR-004**: add-remote MUST append the new remote without removing previously registered remotes.
- **FR-005**: After registration and a necessary shell reload/restart, the shell nav MUST include the new remote and selecting it MUST attempt to load that remote into the existing shell panel path.
- **FR-006**: Composed remotes MUST retain usable internal routes inside the shell panel (default route plus other remote-owned routes), without requiring changes to standalone or remote-as-own-app role behavior for those remotes’ source trees beyond what shell registration already expects of a federated expose.
- **FR-007**: add-remote MUST only succeed when the active repository role is `shell`; other roles MUST receive a clear error and no remotes registration mutation.
- **FR-008**: This feature MUST NOT change existing standalone home/demo behavior or existing remote-role sample routes/expose contract except as strictly required for shared helpers that remain backward compatible.
- **FR-009**: Invalid input (bad alias, missing URL, duplicate alias by default) MUST fail with a non-zero exit and leave registration artifacts unchanged.
- **FR-010**: Documentation (README or equivalent developer-facing note) MUST describe how to run add-remote after shell init for multiple remotes on separate ports, how to pass optional props at add time, and how to hand-edit per-alias props later.
- **FR-011**: The shell MUST support associating a distinct props set with each registered remote alias.
- **FR-012**: When mounting a remote in the shell panel, the host MUST pass that remote’s associated props (if any) together with required host composition defaults, and MUST NOT pass another remote’s custom props.
- **FR-013**: Remotes without a custom props association MUST still mount successfully with composition defaults only.
- **FR-014**: Per-remote props configuration is shell-owned; remote-as-own-app and standalone modes MUST NOT depend on shell props to function.
- **FR-015**: add-remote MUST allow optionally supplying an initial props set for the remote being registered; omitting props MUST leave that alias with no custom props (composition defaults only).
- **FR-016**: After registration, developers MUST be able to edit an existing alias’s props association by hand-editing the documented shell configuration (identity/URL unchanged unless they edit those fields too). v1 MUST NOT require a dedicated props-update CLI.
- **FR-017**: If a props association exists for an alias that is not in the registered remotes list, the host MUST ignore that association when composing; it MUST NOT fail shell startup or block loading of registered remotes solely because of the stale entry.
- **FR-018**: The starter’s sample remote (when loaded embedded in the shell with a host-supplied prop) MUST visibly reflect at least one of those props so reviewers and smokes can verify per-remote props (SC-006). Own-app mode without shell props MUST remain unchanged in primary behavior.
- **FR-019**: Sample host prop delivery MUST use an in-remote provider/context fed from federated mount props (canonical sample key `title`); shell MUST NOT couple sample route UI to the host router.
- **FR-020**: Automated verification for this feature MUST include: (a) default composed route visible; (b) navigation to a second internal remote route succeeds in-panel; (c) two configured remotes show different visible host titles; (d) orphan `remoteProps` keys do not break shell load of registered remotes.

### Key Entities

- **Shell remote registration**: One host-side record for a remote (stable alias, display/name identity, expose key, URL/env binding).
- **Running remote location**: Developer-supplied URL or port for an already-running remote federated entry.
- **Shell composition surface**: Host chrome that lists registered remotes and loads one at a time into the panel with existing fallback behavior.
- **Per-remote host props**: A props set keyed to a single remote alias; different aliases may have different props; used only when that remote is mounted in the shell.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can register a first remote on an empty shell in under 2 minutes using only the documented add-remote command and a known remote URL/port (no hand-editing of federation files).
- **SC-002**: A developer can register a second distinct remote the same way; afterward both remotes appear in the shell and can each be opened successfully when their processes are up (pass rate 100% in the project’s compose/smoke checks for this path).
- **SC-003**: When a registered remote is open in the shell, its default internal surface and a second internal route are both reachable inside the panel in automated smoke (no shell crash).
- **SC-004**: Standalone and remote role smoke/contract suites that already pass continue to pass after this feature lands (no intentional behavior change for those roles).
- **SC-005**: Invoking add-remote outside shell role fails clearly in under 5 seconds without writing a new remotes registration entry.
- **SC-006**: With two remotes configured with different host `title` props, automated or scripted review confirms each selected remote shows only its own title in the sample UI (e.g. `demo-remote-host-title`) within 5 minutes of setup; orphan props aliases do not prevent load.

## Assumptions

- This feature targets the **shell** role of this in-repo starter; remotes are separate running apps (often other clones initialized as `remote`) already serving a federated entry on distinct ports.
- The npm invocation is `npm run add-remote` (with flags after `--`); “npm add remote” in the request is interpreted as that project script, not the npm package registry `npm add` command.
- Shell init may still start with an empty remotes list; add-remote is the supported incremental path after init (init `--remote` flags remain valid and compatible).
- add-remote location input: developers MAY pass a full federated entry URL or a port; a port is expanded using existing project host/path conventions. Providing neither, or an invalid combination, fails before writing.
- Ensuring remote internal routes work in-panel builds on the starter’s existing dual-mode remote composition approach; this feature’s shell tooling must not break that, and must not require changing standalone or remote-as-own-app UX to complete registration.
- Per-remote props may be supplied optionally at add-remote time; later changes in v1 are by documented hand-edit of `starter.role.json` `remoteProps` (no dedicated props-update CLI). Props bake via shell webpack; runtime read via `getRemoteProps` in `remotes.ts` (no separate `remoteProps.ts` file required).
- Sample `title` is provided to Route 1 through an in-remote context/provider populated from federated mount props.
- Host-required composition defaults (including embedded/host-owned document chrome behavior) always apply when loading a remote in the shell and cannot be disabled by custom per-remote props.
- Sample remotes in the starter MUST visibly reflect at least one host-supplied prop when embedded (for SC-006); own-app without shell props keeps primary behavior. Production remotes define their own contracts.
- Primary flows remain usable at phone-width; PWA/install/offline ownership stays with the shell when composing.
- A shell rebuild/restart after add-remote may be required for webpack remotes map updates; the command documents that expectation.
- Replacing an existing alias requires an explicit future/opt-in force flag if implemented; v1 default is reject duplicates.
- Out of scope: discovering remotes on the network automatically, stopping/starting remote processes, a dedicated props-update CLI in v1, a shared global event bus between remotes, and altering standalone primary flows. Sample remote may accept an optional display prop when embedded only.
