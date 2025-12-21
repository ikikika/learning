import { MemoryRouter, useRoutes } from 'react-router';
import { embeddedRoutes } from './routes/remoteRoutes';

export type FederatedRemoteAppProps = {
  /** Shell passes `embedded={true}` when mounting the federated expose. */
  embedded?: boolean;
};

/**
 * Remote-only Module Federation entry.
 * Isolates remote routing in MemoryRouter so shell BrowserRouter / URLs
 * are unaffected. Does not replace App.tsx for shell or standalone.
 */
function EmbeddedRemoteRoutes() {
  return useRoutes(embeddedRoutes);
}

export function FederatedRemoteApp({ embedded }: FederatedRemoteAppProps) {
  void embedded;
  return (
    <MemoryRouter initialEntries={['/route-1']}>
      <EmbeddedRemoteRoutes />
    </MemoryRouter>
  );
}

export default FederatedRemoteApp;
