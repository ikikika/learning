import { MemoryRouter, useRoutes } from 'react-router';
import { embeddedRoutes } from './routes/remoteRoutes';
import { HostPropsProvider } from '../features/demoRemote/HostPropsContext';

export type FederatedRemoteAppProps = {
  /** Shell passes `embedded={true}` when mounting the federated expose. */
  embedded?: boolean;
  /** Optional host title shown on sample Route 1 when non-empty. */
  title?: string;
};

/**
 * Remote-only Module Federation entry.
 * Isolates remote routing in MemoryRouter so shell BrowserRouter / URLs
 * are unaffected. Does not replace App.tsx for shell or standalone.
 */
function EmbeddedRemoteRoutes() {
  return useRoutes(embeddedRoutes);
}

export function FederatedRemoteApp({
  embedded,
  title,
}: FederatedRemoteAppProps) {
  void embedded;
  const hostTitle =
    typeof title === 'string' && title.trim() ? title.trim() : undefined;

  return (
    <HostPropsProvider value={{ title: hostTitle }}>
      <MemoryRouter initialEntries={['/route-1']}>
        <EmbeddedRemoteRoutes />
      </MemoryRouter>
    </HostPropsProvider>
  );
}

export default FederatedRemoteApp;
