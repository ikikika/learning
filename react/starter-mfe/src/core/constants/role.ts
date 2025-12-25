export type AppRole = 'standalone' | 'host' | 'remote';

declare global {
  interface Window {
    __STARTER_ROLE__?: AppRole;
  }
}

/**
 * Role is baked at build time via starter.role.json → DefinePlugin,
 * with a runtime fallback for tests.
 */
export function getAppRole(): AppRole {
  if (typeof window !== 'undefined' && window.__STARTER_ROLE__) {
    return window.__STARTER_ROLE__;
  }
  const injected =
    typeof __STARTER_ROLE__ !== 'undefined' ? __STARTER_ROLE__ : undefined;
  if (
    injected === 'standalone' ||
    injected === 'host' ||
    injected === 'remote'
  ) {
    return injected;
  }
  return 'standalone';
}

declare const __STARTER_ROLE__: AppRole | undefined;
