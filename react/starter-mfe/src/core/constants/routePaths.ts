/**
 * App URL path segments for RouteObjects and nav Links.
 * Same idea as `apiRoutes`: do not hardcode compose/leaf path strings in UI.
 *
 * Shape: `/app/<alias>/…` — nested hybrid→leaf is `/app/<hybrid>/<leaf>/route-1`
 * (hybrid child mount is a bare `:alias/*` under the shell mount).
 */
export const routePaths = {
  root: '/',
  compose: {
    segment: 'app',
    /** Shell RouteObject path (`app/:alias/*`). */
    mount: 'app/:alias/*',
  },
  hybrid: {
    /** Child mount under hybrid (bare alias → `/app/<hybrid>/<leaf>/…`). */
    childMount: ':alias/*',
  },
  remote: {
    route1: 'route-1',
    route2: 'route-2',
  },
} as const;

export type RemoteRouteSegment =
  typeof routePaths.remote.route1 | typeof routePaths.remote.route2;

/** Absolute path to open a composed child on the shell. */
export function composeChildPath(alias: string): string {
  return `/${routePaths.compose.segment}/${alias}`;
}

/** Sibling link between leaf routes when nested under a composer mount. */
export function remoteSiblingPath(target: RemoteRouteSegment): string {
  return `../${target}`;
}
