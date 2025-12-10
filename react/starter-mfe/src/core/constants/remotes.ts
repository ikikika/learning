/**
 * Sample remote slot for shell role.
 * Empty or invalid URL MUST trigger RemoteFallback (SC-004).
 */
export type RemoteSlotConfig = {
  name: string;
  expose: './Demo';
  /** Placeholder URL for remoteEntry.js; empty/invalid → fallback */
  url: string;
};

declare global {
  interface Window {
    __STARTER_DEMO_REMOTE_URL__?: string;
  }
}

function resolveRemoteUrl(): string {
  if (typeof window !== 'undefined') {
    const override = window.__STARTER_DEMO_REMOTE_URL__;
    if (typeof override === 'string') return override;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('remoteUrl')) {
        return params.get('remoteUrl') ?? '';
      }
    } catch {
      /* ignore */
    }
  }
  return (
    (typeof __STARTER_DEMO_REMOTE_URL_DEFAULT__ !== 'undefined' &&
      __STARTER_DEMO_REMOTE_URL_DEFAULT__) ||
    'http://127.0.0.1:3002/remoteEntry.js'
  );
}

export const DEMO_REMOTE_SLOT: RemoteSlotConfig = {
  name: 'demoRemote',
  expose: './Demo',
  get url() {
    return resolveRemoteUrl();
  },
};

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
