/**
 * URL mount for composed children under the shell (host).
 *
 * Shape: `/app/<alias>/…` — and when that child is a hybrid that mounts a leaf,
 * `/app/<hybrid>/<leaf>/route-1` (hybrid uses a bare `:alias/*` under the mount).
 */
export const COMPOSE_MOUNT_SEGMENT = 'app';

/** Host / shell route path segment pattern (`app/:alias/*`). */
export const COMPOSE_MOUNT_ROUTE = `${COMPOSE_MOUNT_SEGMENT}/:alias/*`;

/** Absolute path to open a composed child on the shell. */
export function composeChildPath(alias: string): string {
  return `/${COMPOSE_MOUNT_SEGMENT}/${alias}`;
}
