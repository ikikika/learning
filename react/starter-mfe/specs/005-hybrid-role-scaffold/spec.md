# Feature Specification: Hybrid Role Scaffold

**Feature Branch**: `005-hybrid-role-scaffold`

**Created**: 2026-08-02

**Status**: Draft

**Input**: User description: "Add a hybrid repository role for nested Module Federation: shell (host) loads hybrids; each hybrid has its own layout/colors and loads that hybrid's module remotes; modules are leaf remotes only. Hybrid init (--role=hybrid): remotes map + exposes (hybrid public entry); can run add-remote for child modules; sample hybrid chrome distinct from shell; embedded prop when loaded by shell; standalone hybrid UX with hybrid theme. Out of scope: changing leaf remote dual-mode behavior beyond contracts needed by hybrid; auth; monorepo packaging. Must not break existing standalone | host | remote."

## Clarifications

### Session 2026-08-02

- Q: Hybrid `add-remote` child eligibility → A: Allow any valid federated entry as a hybrid child (same as host); docs/sample stay leaf-focused; no role-sniffing refusals in v1
- Q: Theme controls when hybrid is embedded in the shell → A: Suppress hybrid theme toggle when embedded; shell owns theme UX; hybrid chrome/tokens still apply in-boundary
- Q: How “distinct hybrid chrome” differs from shell/host → A: Same nav+panel composition as host; distinct tokens/branding + one clear layout cue (not a visual clone of host)
- Q: Automated compose verification depth for v1 → A: Pair covers required in CI (hybrid+leaf and shell+hybrid); full three-tier shell→hybrid→leaf optional/deferred
- Q: Concrete hybrid layout cue for distinct-chrome tests → A: Hybrid sample MUST render a header band with `data-testid="demo-hybrid-header-band"` (distinct from host sample)
- Q: How pair compose tests enter CI → A: Wire hybrid+leaf and shell+hybrid into `npm run test:compose` / `scripts/compose-harness.mjs` (or sibling scripts invoked by that entry) so FR-016 is gated
- Q: Hybrid accessibility gate → A: Hybrid primary own-app route MUST be included in existing WCAG 2.2 AA `test:a11y` coverage (same AA fail-on-violations policy as other roles)
- Q: Init CLI contract source of truth for hybrid → A: Update `specs/001-react-role-scaffold/contracts/init-cli.md` additively for hybrid; keep `specs/005-hybrid-role-scaffold/contracts/hybrid-init-cli.md` as hybrid-detail companion
- Q: Where layout cue / theme-toggle ownership lives → A: `demoHybrid` owns the header-band cue; `FederatedHybridApp` owns embed-time theme-toggle suppression (no required new shared layout fork)
- Q: Hybrid own-app PWA smoke depth → A: Same PWA/offline assertions as other own-app roles (not optional/as-applicable)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Initialize a hybrid shell for local development (Priority: P1)

Developers need a hybrid clone that runs without the platform shell. After hybrid init, they start the hybrid app alone, see hybrid-distinct layout and colors (not the shell chrome), and can navigate the hybrid home even when no module remotes are registered yet. Init also prints a copy-paste `npm run add-remote` command so they can register this hybrid on a higher-level host/shell (same DX as remote init).

**Why this priority**: Daily hybrid development depends on a standalone hybrid entry; without it the nested topology cannot be exercised locally.

**Independent Test**: Init `--role=hybrid`, confirm the CLI prints a ready-to-run host `add-remote` command, start only that app, confirm role metadata says hybrid, hybrid chrome is visually distinct from shell/host sample chrome, and primary hybrid UX works at phone-width with hybrid theme controls.

**Acceptance Scenarios**:

1. **Given** a developer runs init with `--role=hybrid` (required name and port), **When** init succeeds, **Then** role metadata and project guidance record `hybrid`, and the app starts without a shell or any module remotes.
2. **Given** a successful hybrid init, **When** the developer reads the CLI output, **Then** it includes a copy-paste `npm run add-remote` command for a higher-level host clone (alias, name, port, expose, federation name, and url env derived like remote init), ready to register this hybrid as a shell slot.
3. **Given** a hybrid with zero child modules registered, **When** the developer opens the hybrid app, **Then** they see hybrid layout, hybrid colors/theme tokens, and hybrid navigation in a usable empty state (not a crash).
4. **Given** hybrid standalone, **When** compared to a host/shell sample, **Then** hybrid chrome is not a visual clone of host: it may share nav+panel composition, but MUST use distinct tokens/branding and MUST show the hybrid header band (`data-testid="demo-hybrid-header-band"`) that host sample does not use.
5. **Given** hybrid standalone, **When** the developer uses hybrid theme controls, **Then** document-level theme applies for this own-app entry (first-visit / persist / use-system behavior consistent with other own-app roles).
6. **Given** hybrid standalone at phone-width (~375px), **When** primary hybrid flows are exercised, **Then** they are usable without horizontal scrolling for primary hybrid chrome.
7. **Given** a completed hybrid scaffold, **When** PWA baseline is checked for the own-app entry, **Then** installable identity and offline app-shell baseline are present, with the same offline/connectivity messaging expectations used for other own-app roles.
8. **Given** CI a11y tooling, **When** the hybrid primary own-app route is audited, **Then** WCAG 2.2 AA violations fail the job (same policy as other roles).

---

### User Story 2 - Add and load leaf module remotes from the hybrid (Priority: P2)

The hybrid shell loads child federated modules via configuration. The **sample topology and docs** focus on leaf module remotes (not hybrid-as-child-of-hybrid). Developers register children with `npm run add-remote`, restart as required, pick a module from hybrid nav, and see it inside hybrid chrome. If a module is down, the hybrid shell stays up with a clear fallback.

**Why this priority**: Hybrid’s composer role is the path to nest modules under hybrid chrome.

**Independent Test**: On a hybrid clone, add one leaf remote via add-remote; start hybrid + module; open the module from hybrid nav inside hybrid chrome; stop the module and confirm fallback without losing the hybrid shell.

**Acceptance Scenarios**:

1. **Given** a hybrid repository, **When** the developer runs add-remote with valid leaf-module details, **Then** registration updates and the module appears as a selectable hybrid-nav slot after the required restart.
2. **Given** a registered leaf module that is available, **When** the developer selects it, **Then** it mounts inside the hybrid mount boundary with hybrid layout/colors/nav still visible, and the hybrid passes embed-mode so the leaf does not take over document theme or PWA.
3. **Given** a registered leaf module that is missing or fails, **When** the developer selects it, **Then** the hybrid shows a defined fallback and remains interactive (hybrid nav and other slots still work).
4. **Given** standalone or remote role, **When** add-remote is run, **Then** it fails with a clear role error and does not mutate host/hybrid registration.
5. **Given** host role, **When** add-remote is run as today, **Then** existing host behavior is unchanged.
6. **Given** hybrid registration, **When** child entries are reviewed against project guidance, **Then** the documented sample topology is shell → hybrid → leaf modules; hybrid `add-remote` itself does not refuse a non-leaf federated entry (same acceptance rules as host).

---

### User Story 3 - Shell loads the hybrid as a nested composee (Priority: P3)

The platform shell (host) loads hybrids the same way it loads remotes today: configuration / add-remote toward the hybrid’s public entry. With embed-mode set by the shell, the shell keeps document theme and PWA ownership and the hybrid’s own-app theme toggle is suppressed; the hybrid still shows its layout, colors/tokens, and navigation inside its mount area. If the hybrid is down, the shell shows a fallback and stays up.

**Why this priority**: Completes shell → hybrid → module nesting; developers can still deliver US1–US2 without a shell.

**Independent Test**: Configure a host/shell to load the hybrid public entry with embed-mode; confirm shell document ownership, suppressed hybrid theme toggle, and hybrid chrome inside the mount; stop the hybrid and confirm shell fallback. Full shell→hybrid→leaf in one harness is optional/deferred; leaf failure under hybrid is covered by the hybrid+leaf pair tests (US2).

**Acceptance Scenarios**:

1. **Given** a hybrid scaffold, **When** a shell/host is configured to load the hybrid’s public entry, **Then** that entry is stable, typed, and documented (embed-mode flag + contract version).
2. **Given** the shell mounts the hybrid with embed-mode enabled, **When** the composed view loads, **Then** the shell owns document theme and install/offline PWA UX; the hybrid does not perform competing document takeovers; and the hybrid’s own-app theme toggle is not available (suppressed).
3. **Given** the same composed view, **When** the hybrid is visible, **Then** hybrid layout, colors/tokens, and navigation still apply inside the hybrid mount boundary (distinct hybrid chrome without a competing theme toggle).
4. **Given** the hybrid is unavailable or fails while selected in the shell, **When** that slot loads, **Then** the shell shows a defined fallback and remains usable.
5. **Given** hybrid → leaf module nesting (hybrid+leaf pair), **When** a leaf fails, **Then** the hybrid shows module fallback and remains up. (Full three-process shell→hybrid→leaf CI path is optional/deferred; shell remains covered by shell+hybrid pair degrade checks.)

---

### User Story 4 - Preserve standalone, host, and remote (Priority: P4)

Adding hybrid must not break existing roles. Leaf remotes keep their current dual-mode behavior except for any minimal contract adjustments required so a hybrid can embed them safely.

**Why this priority**: Shared starter; regressions block adoption of the fourth role.

**Independent Test**: Re-run standalone, host, and remote primary smokes (and host add-remote) after hybrid lands; confirm leaf remote dual-mode samples still pass aside from documented embed-contract compatibility.

**Acceptance Scenarios**:

1. **Given** hybrid is implemented in the shared tree, **When** standalone, host, and remote primary flows run, **Then** they behave as before (backward-compatible shared helpers only).
2. **Given** init for standalone, host, or remote, **When** those roles start, **Then** hybrid-only sample surfaces are not required for them to run.
3. **Given** one role per clone, **When** init sets hybrid, **Then** the clone is hybrid only (not mixed with host/remote/standalone in one repo).

### Edge Cases

- Re-init when role metadata exists: refuse unless `--force`, consistent with current init.
- add-remote duplicate alias on hybrid: clear error; no partial corrupt registration.
- Empty/invalid leaf module URL: hybrid slot shows defined fallback.
- Shell mounts hybrid without embed-mode: only own-app / non-embedded path may own document theme/PWA and show the hybrid theme toggle; shell compose path MUST pass embed-mode when nesting (suppresses hybrid theme toggle).
- Hybrid with zero modules under shell: hybrid empty state inside mount; shell still stable; hybrid theme toggle remains suppressed while embedded.
- Phone-width hybrid nav + module panel: primary chrome remains usable without horizontal scroll.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Init MUST accept `--role=hybrid` and persist `hybrid` in role metadata and project guidance.
- **FR-002**: Hybrid init MUST configure the app both to publish a stable hybrid public entry (for the shell) and to load child module locations from configuration (remotes map + exposes at the product level).
- **FR-003**: After successful hybrid init, the CLI MUST print a ready-to-run `npm run add-remote` command for a higher-level host clone (alias, name, port, expose, federation name, url env), mirroring remote-init DX, so the developer can register this hybrid as a shell slot without hand-building the flags.
- **FR-004**: A hybrid clone MUST run standalone for local hybrid UX with hybrid-owned layout, colors/theme tokens, and navigation—visually distinct from shell/host sample chrome: same nav+panel composition pattern as host is allowed, but tokens/branding MUST differ and the sample MUST include header band `data-testid="demo-hybrid-header-band"` (owned by `demoHybrid`).
- **FR-005**: When the shell loads the hybrid, the public entry MUST accept an embed-mode prop; with embed-mode enabled, the hybrid MUST NOT take over document theme or install/offline PWA, MUST suppress its own-app theme toggle (owned by `FederatedHybridApp` embed path), and MUST still apply hybrid chrome (layout, colors/tokens, nav, header band) inside its mount boundary.
- **FR-006**: Hybrid MUST compose child remotes via configuration only (no child source trees in the hybrid repo). Sample topology and docs MUST present shell → hybrid → leaf modules; hybrid `add-remote` MUST NOT role-sniff or refuse another hybrid in v1 (same eligibility as host `add-remote`).
- **FR-007**: `npm run add-remote` MUST succeed for hybrid (child remotes) and continue to succeed for host (including registering a hybrid as a shell slot); it MUST refuse standalone and remote with a clear error and no registration writes.
- **FR-008**: Hybrid MUST pass embed-mode into leaf modules it mounts so leaves do not take over document theme/PWA while nested.
- **FR-009**: Missing/failing leaf modules MUST show a defined fallback and MUST NOT take down the hybrid; missing/failing hybrid MUST show a defined fallback and MUST NOT take down the shell.
- **FR-010**: Exactly one role per clone among standalone | host | remote | hybrid.
- **FR-011**: Existing standalone, host, and remote behavior MUST NOT regress; leaf remote dual-mode behavior MUST NOT change beyond contracts required for hybrid embedding.
- **FR-012**: Hybrid MUST meet mobile-responsive primary flows and PWA baseline for its own-app entry with the **same** PWA/offline smoke expectations as other own-app roles; when nested under a shell, outermost-shell install/offline ownership applies. Hybrid primary own-app route MUST be included in WCAG 2.2 AA `test:a11y` coverage.
- **FR-013**: Parent↔hybrid and hybrid↔leaf communication MUST use explicit documented contracts (props or equivalent)—not undocumented globals.
- **FR-014**: Hybrid init MUST allow zero or more child module registrations at init (empty hybrid valid), consistent with host init patterns.
- **FR-015**: README / agent guidance MUST document the topology (shell / hybrid / leaf modules), hybrid init (including the printed host `add-remote` snippet), add-remote for modules, distinct hybrid chrome (`demo-hybrid-header-band`), and embed-mode rules. Init CLI contract in `specs/001-react-role-scaffold/contracts/init-cli.md` MUST be updated additively for hybrid (005 `hybrid-init-cli.md` remains the hybrid-detail companion).
- **FR-016**: Automated verification MUST cover: hybrid standalone; hybrid init prints host `add-remote` snippet; **pair** compose (hybrid + leaf with fallback; shell + hybrid embed ownership, theme-toggle suppression, and in-boundary hybrid chrome) **wired into `npm run test:compose` / compose harness entrypoints**; and non-regression for standalone | host | remote. Full three-process shell→hybrid→leaf CI compose MAY be deferred with a tracked follow-up (not a v1 hard gate).

### Key Entities

- **Shell (host)**: Outermost app that loads hybrids; owns document theme/PWA when composing.
- **Hybrid**: Intermediate app with hybrid layout/colors/nav; exposes a public entry to the shell; loads leaf modules.
- **Module (leaf remote)**: Innermost federated remote; not a composer of further remotes in this feature’s topology.
- **Hybrid public entry contract**: Stable export identity, embed-mode flag, optional display props, contract version.
- **Module registration**: Alias, URL/location, expose name, optional per-alias props—owned by hybrid (or shell) configuration.
- **Fallback surface**: User-visible placeholder when a hybrid or leaf module is missing/fails.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Developer initializes hybrid and reaches usable hybrid home with distinct hybrid chrome in under 5 minutes (install + init + start) without a shell.
- **SC-002**: After hybrid init, 100% of successful runs under test print a copy-paste host `add-remote` command whose flags match the initialized hybrid name/port/expose conventions (same shape as remote init).
- **SC-003**: 100% of hybrid standalone primary flows under test remain usable at phone-width without horizontal scrolling for primary hybrid chrome; hybrid primary route passes WCAG 2.2 AA automated audit with zero violations.
- **SC-004**: Stopping a selected leaf module yields a visible fallback within 3 seconds while hybrid nav remains interactive.
- **SC-005**: Shell + hybrid compose checks confirm shell document theme ownership, suppressed hybrid theme toggle, and visible hybrid chrome inside the hybrid mount when embed-mode is set.
- **SC-006**: Stopping a selected hybrid under the shell yields a visible fallback while shell navigation remains interactive.
- **SC-007**: Existing standalone, host, and remote primary automated smokes pass after hybrid lands.
- **SC-008**: add-remote refuses standalone/remote in 100% of automated refusal checks; succeeds for valid hybrid and host inputs.
- **SC-009**: A reader can identify shell vs hybrid vs leaf module roles from README/role metadata without reading application source.

## Assumptions

- **Topology**: shell (host) → hybrid → modules (leaf remotes in the sample). Hybrids are what the shell loads; sample docs do not require hybrid-as-child-of-hybrid.
- **Repository role for this feature**: scaffolds **hybrid**; shell remains **host**; modules remain **remote**.
- **Embed contract**: Reuse existing embed-mode semantics (`embedded` prop) for shell→hybrid and hybrid→leaf. When hybrid is embedded: suppress hybrid theme toggle; shell owns theme UX; hybrid layout/colors/tokens/nav still apply in-boundary.
- **add-remote**: Allowed for `host` and `hybrid`; host may register a hybrid entry; hybrid may register any valid federated child entry (same as host)—no role-sniffing refusal in v1; sample guidance still recommends leaf modules.
- **Empty hybrid**: Valid (zero modules).
- **Host add-remote snippet**: Hybrid init prints the same style of copy-paste `npm run add-remote` command remote init already prints for the host; flag derivation follows existing name/port/expose conventions.
- **Sample chrome**: Same nav+panel composition as host is fine; distinct tokens/branding plus header band `data-testid="demo-hybrid-header-band"` owned by `demoHybrid`; embed toggle suppression owned by `FederatedHybridApp`.
- **Leaf remotes**: Existing dual-mode remote behavior preserved except minimal contract tweaks required for safe embedding by hybrid.
- **Out of scope**: Auth; monorepo / workspace packaging; changing leaf remote dual-mode product UX beyond those contracts; hybrid-as-child-of-hybrid sample harnesses; enforcing leaf-only children in `add-remote`; network auto-discovery of modules; full three-process shell→hybrid→leaf as a hard CI gate in v1 (pair covers required via `test:compose`; three-tier optional/deferred).
- **Verification**: CI requires hybrid+leaf and shell+hybrid pair covers **invoked via `npm run test:compose` / harness**; three-tier path is optional/deferred with tracked follow-up if not shipped. Hybrid primary route is in `test:a11y`.
- **Init contracts**: `specs/001-react-role-scaffold/contracts/init-cli.md` updated additively for hybrid; `specs/005-hybrid-role-scaffold/contracts/hybrid-init-cli.md` holds hybrid-specific detail.
- **Shared packages**: Published npm contract packages remain deferred; in-repo typed contract + version is enough for v1.
- **Responsive / PWA**: Constitution MUST rules; outermost shell owns install/offline UX when federated.
- **Target users**: Developers already using init and add-remote for host/remote.
- **Environment**: Shell, hybrid, and modules run as separate clones/ports; compose harness may use temp workspaces as in prior compose tests.
