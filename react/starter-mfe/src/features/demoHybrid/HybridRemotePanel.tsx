import { useParams } from 'react-router';
import { LoadRemote } from '../../app/remotes/loadRemote';

/**
 * Hybrid panel route: load a federated leaf module by `:alias`.
 * Reuses the shared `LoadRemote` composer, so children get `embedded={true}`
 * and a defined `RemoteFallback` on failure (same contract as `demoHost`).
 */
export function HybridRemotePanel() {
  const { alias } = useParams<{ alias: string }>();

  if (!alias) {
    return null;
  }

  return <LoadRemote key={alias} alias={alias} />;
}
