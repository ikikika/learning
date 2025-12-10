import {
  Component,
  Suspense,
  lazy,
  useMemo,
  type ReactNode,
} from 'react';
import {
  DEMO_REMOTE_SLOT,
  isValidRemoteUrl,
} from '../../core/constants/remotes';
import { RemoteFallback } from '../../components/RemoteFallback';

type DemoComponent = React.ComponentType<{ embedded?: boolean }>;

type DemoModule = {
  default?: DemoComponent;
  Demo?: DemoComponent;
};

async function loadRemoteModule(): Promise<{ default: DemoComponent }> {
  // @ts-expect-error Module Federation remote — resolved at runtime for shell role
  const mod = (await import('demoRemote/Demo')) as DemoModule;
  const Comp = mod.Demo ?? mod.default;
  if (!Comp) {
    throw new Error('Remote ./Demo export missing');
  }
  return { default: Comp };
}

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

export function LoadDemoRemote() {
  const url = DEMO_REMOTE_SLOT.url;
  const urlOk = isValidRemoteUrl(url);

  const LazyDemo = useMemo(() => {
    if (!urlOk) return null;
    return lazy(() => loadRemoteModule());
  }, [urlOk, url]);

  if (!urlOk) {
    return (
      <RemoteFallback
        reason="Remote URL is empty or invalid. Configure a valid remoteEntry URL."
      />
    );
  }

  if (!LazyDemo) {
    return <RemoteFallback reason="Remote configuration is missing." />;
  }

  return (
    <Suspense
      fallback={
        <RemoteFallback title="Loading remote…" reason="Fetching ./Demo…" />
      }
    >
      <RemoteErrorBoundary>
        <LazyDemo embedded={true} />
      </RemoteErrorBoundary>
    </Suspense>
  );
}
