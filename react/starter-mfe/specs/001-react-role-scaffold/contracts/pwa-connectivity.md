# Contract: PWA & connectivity UX

## PWA baseline (all roles after init)

| Artifact | Requirement |
|----------|-------------|
| Web app manifest | Present (name, icons, display mode) |
| Icons | Present under `public/icons/` (or equivalent) |
| Service worker | Workbox (or equivalent) registered for installability / app-shell assets |

## Ownership when federated

| Role | Install / offline UX |
|------|----------------------|
| shell | Owns install/offline PWA UX for composed experience |
| remote (standalone) | Full installable PWA baseline |
| remote (embedded) | MUST NOT take over shell install/offline (no competing full-document SW registration) |
| standalone | Owns its own PWA baseline |

## Connectivity message

When no network is detected:

- Show a clear user-visible message: **"internet connection required"** (or
  equivalent clear phrasing).
- Full offline use of demo/product content is **out of contract** for v1.
- Silent failure / blank screen on offline is a contract violation.
