# Contract: Hybrid public federated entry

**Feature**: `005-hybrid-role-scaffold`  
**Module**: `src/app/FederatedHybridApp.tsx` (default + named export)  
**Expose key**: PascalCase of init `--name` (e.g. `my-hybrid` → `./MyHybrid`)

## Props

| Prop               | Type         | Required | Behavior                                                                                                                                                                                                                                                                                      |
| ------------------ | ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `embedded`         | `boolean`    | No       | Shell MUST pass `true` when nesting. When `true`: no document theme/PWA takeover; **suppress hybrid theme toggle**; still render hybrid chrome (layout, tokens, nav) inside mount. When omit/`false`: own-app-style controls may apply only on own-app entry—not via this module’s bootstrap. |
| (optional display) | serializable | No       | Additive sample props only; MUST NOT override `embedded`                                                                                                                                                                                                                                      |

## Version

Export or document `CONTRACT_VERSION = '1.0.0'` (in-repo; published package deferred).

## Routing

- Federated path nests under shell `app/:alias/*` using the shell router—same nesting idea as `FederatedRemoteApp`. Nested leaf under hybrid: `/app/<hybrid>/<leaf>/…` (hybrid child mount is bare `:alias/*`).
- Own-app hybrid uses `App.tsx` + `hybridRoutes` (BrowserRouter via providers)—**not** this module.

## Composer duties when mounting hybrid

- Pass `embedded={true}` (authoritative; props bag cannot clear it)—existing `LoadRemote` behavior.
- On failure/missing entry: show defined fallback; shell stays up.

## Consumer duties when hybrid mounts children

- Hybrid `LoadRemote` MUST pass `embedded={true}` to leaf remotes.
- On child failure: hybrid fallback; hybrid chrome stays up.
