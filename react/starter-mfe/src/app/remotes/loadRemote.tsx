import { Component, Suspense, lazy, useMemo, type ReactNode } from 'react';
import {
  getRemoteProps,
  getRemoteSlot,
  isValidRemoteUrl,
  mergeRemoteMountProps,
} from '@/core/constants/remotes';
import { RemoteFallback } from '@/components/RemoteFallback';
import { remoteLoaders } from './loaders.generated';

type DemoComponent = React.ComponentType<
  Record<string, unknown> & { embedded?: boolean }
>;

type EBState = { error: Error | null };

class RemoteErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null };

  static getDerivedStateFromError(error: Error): EBState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <RemoteFallback
          reason={
            this.state.error.message ||
            'The remote module is unreachable or failed to load.'
          }
        />
      );
    }
    return this.props.children;
  }
}

type LoadRemoteProps = {
  /** Webpack remotes map key (e.g. demoRemote). */
  alias: string;
};

/**
 * Load a federated remote by alias from starter.role.json remotes[].
 * Spreads per-alias remoteProps with embedded={true} authoritative.
 */
export function LoadRemote({ alias }: LoadRemoteProps) {
  const slot = getRemoteSlot(alias);
  const loader = remoteLoaders[alias];
  const url = slot?.url ?? '';
  const urlOk = isValidRemoteUrl(url);
  const mountProps = mergeRemoteMountProps(getRemoteProps(alias));

  const LazyRemote = useMemo(() => {
    if (!slot || !urlOk || !loader) return null;
    const expose = slot.expose;
    return lazy(async () => {
      const mod = await loader();
      const exposeName = expose.startsWith('./') ? expose.slice(2) : expose;
      const Comp = (mod.default ?? mod[exposeName] ?? mod.App ?? mod.Demo) as
        DemoComponent | undefined;
      if (!Comp) {
        throw new Error(`Remote ${alias} export missing`);
      }
      return { default: Comp };
    });
  }, [alias, loader, slot, urlOk]);

  if (!slot) {
    return (
      <RemoteFallback
        reason={`Remote alias "${alias}" is not configured in starter.role.json remotes[].`}
      />
    );
  }

  if (!loader) {
    return (
      <RemoteFallback
        reason={`No generated loader for "${alias}". Re-run init or add-remote for the host role.`}
      />
    );
  }

  if (!urlOk) {
    return (
      <RemoteFallback reason="Remote URL is empty or invalid. Configure a valid remoteEntry URL." />
    );
  }

  if (!LazyRemote) {
    return <RemoteFallback reason="Remote configuration is missing." />;
  }

  return (
    <Suspense
      fallback={
        <RemoteFallback
          title="Loading remote…"
          reason={`Fetching ${slot.expose}…`}
        />
      }
    >
      <RemoteErrorBoundary>
        <LazyRemote {...mountProps} />
      </RemoteErrorBoundary>
    </Suspense>
  );
}
