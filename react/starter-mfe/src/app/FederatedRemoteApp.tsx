import { useRoutes } from 'react-router';
import { embeddedRoutes } from './routes/remoteRoutes';
import { HostPropsProvider } from '../features/demoRemote/HostPropsContext';

export type FederatedRemoteAppProps = {
  /** Host passes `embedded={true}` when mounting the federated expose. */
  embedded?: boolean;
  /** Optional host title shown on sample Route 1 when non-empty. */
  title?: string;
};

/**
 * Remote-only Module Federation entry.
 * Uses the host BrowserRouter (host `remote/:alias/*`) so in-remote
 * navigation updates the address bar. Does not replace App.tsx for
 * host or standalone own-app entry.
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
      <EmbeddedRemoteRoutes />
    </HostPropsProvider>
  );
}

export default FederatedRemoteApp;
