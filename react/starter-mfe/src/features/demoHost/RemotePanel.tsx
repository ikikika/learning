import { useParams } from 'react-router';
import { LoadRemote } from '@/app/remotes/loadRemote';

/**
 * Right-panel route: load a federated remote by `:alias`.
 */
export function RemotePanel() {
  const { alias } = useParams<{ alias: string }>();

  if (!alias) {
    return null;
  }

  return <LoadRemote key={alias} alias={alias} />;
}
