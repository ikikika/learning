/**
 * Federated remote slot config for the shell role.
 * Config is injected at build time from starter.role.json remotes[].
 */

export type RemoteSlotConfig = {
  /** Webpack remotes map key / import alias */
  alias: string;
  /** App / package name of the remote repo */
  name: string;
  /** Module Federation container name */
  federationName: string;
  /** Exposed module path (e.g. ./Demo) */
  expose: string;
  /** Env key used for the remoteEntry URL */
  urlEnv: string;
  /** Resolved remoteEntry URL */
  url: string;
};

type RemoteSlotStatic = Omit<RemoteSlotConfig, 'url'>;

declare global {
  interface Window {
    /** Per-alias URL overrides (preferred for multiple remotes). */
    __STARTER_REMOTE_URLS__?: Record<string, string>;
    /** Legacy single-URL override for demoRemote. */
    __STARTER_DEMO_REMOTE_URL__?: string;
  }
}

declare const __STARTER_REMOTES_CONFIG__: RemoteSlotStatic[] | undefined;
declare const __STARTER_REMOTES_URLS__: Record<string, string> | undefined;
declare const __STARTER_DEMO_REMOTE_URL_DEFAULT__: string | undefined;

function bakedConfig(): RemoteSlotStatic[] {
  if (
    typeof __STARTER_REMOTES_CONFIG__ !== 'undefined' &&
    Array.isArray(__STARTER_REMOTES_CONFIG__)
  ) {
    return __STARTER_REMOTES_CONFIG__;
  }
  return [];
}

function bakedUrls(): Record<string, string> {
  if (
    typeof __STARTER_REMOTES_URLS__ !== 'undefined' &&
    __STARTER_REMOTES_URLS__ &&
    typeof __STARTER_REMOTES_URLS__ === 'object'
  ) {
    return __STARTER_REMOTES_URLS__;
  }
  return {};
}

function resolveRemoteUrl(alias: string, urlEnv: string): string {
  if (typeof window !== 'undefined') {
    const map = window.__STARTER_REMOTE_URLS__;
    if (map && typeof map[alias] === 'string') return map[alias];

    if (alias === 'demoRemote') {
      const legacy = window.__STARTER_DEMO_REMOTE_URL__;
      if (typeof legacy === 'string') return legacy;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const keyed = params.get(`remoteUrl.${alias}`);
      if (keyed !== null) return keyed;
      // Legacy: ?remoteUrl= overrides demoRemote only
      if (alias === 'demoRemote' && params.has('remoteUrl')) {
        return params.get('remoteUrl') ?? '';
      }
    } catch {
      /* ignore */
    }
  }

  const fromBake = bakedUrls()[alias];
  if (typeof fromBake === 'string') return fromBake;

  if (
    alias === 'demoRemote' &&
    typeof __STARTER_DEMO_REMOTE_URL_DEFAULT__ !== 'undefined' &&
    __STARTER_DEMO_REMOTE_URL_DEFAULT__
  ) {
    return __STARTER_DEMO_REMOTE_URL_DEFAULT__;
  }

  void urlEnv;
  return '';
}

function toSlot(entry: RemoteSlotStatic): RemoteSlotConfig {
  return {
    ...entry,
    get url() {
      return resolveRemoteUrl(entry.alias, entry.urlEnv);
    },
  };
}

/** All configured remote slots (shell). Empty when not a shell build. */
export const REMOTE_SLOTS: RemoteSlotConfig[] = bakedConfig().map(toSlot);

/** @deprecated Prefer REMOTE_SLOTS / getRemoteSlot — sample demo alias */
export const DEMO_REMOTE_SLOT: RemoteSlotConfig = REMOTE_SLOTS.find(
  (s) => s.alias === 'demoRemote',
) ??
  toSlot({
    alias: 'demoRemote',
    name: 'demoRemote',
    federationName: 'demoRemote',
    expose: './Demo',
    urlEnv: 'DEMO_REMOTE_URL',
  });

export function getRemoteSlot(alias: string): RemoteSlotConfig | undefined {
  return REMOTE_SLOTS.find((s) => s.alias === alias);
}

export function isValidRemoteUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
