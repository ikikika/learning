import { useMemo } from 'react';
import { useRoutes } from 'react-router';
import { buildEmbeddedHybridRoutes } from './routes/hybridRoutes';
import { CONTRACT_VERSION } from '../features/demoHybrid';

export { CONTRACT_VERSION };

export type FederatedHybridAppProps = {
  /** Composer (shell) passes `embedded={true}` when mounting the federated expose. */
  embedded?: boolean;
  /** Optional composer-provided display title. Additive only — MUST NOT override `embedded`. */
  title?: string;
};

function EmbeddedHybridRoutes({
  embedded,
  title,
}: {
  embedded: boolean;
  title?: string;
}) {
  const routes = useMemo(
    () => buildEmbeddedHybridRoutes(embedded, title),
    [embedded, title],
  );
  return useRoutes(routes);
}

/**
 * Hybrid Module Federation entry (`FederatedHybridApp`, contract
 * v{@link CONTRACT_VERSION}).
 *
 * Uses the composer's router (host or another hybrid) so in-hybrid
 * navigation updates the address bar — same nesting idea as
 * `FederatedRemoteApp`. `embedded` is authoritative: it is treated as
 * `true` unless explicitly `false`, never takes over document theme/PWA,
 * and suppresses the hybrid header band's own theme toggle. Own-app-style
 * controls (document theme, PWA) are only available via `App.tsx` +
 * `hybridRoutes`, never through this bootstrap. Does not replace `App.tsx`
 * for hybrid own-app entry.
 */
export function FederatedHybridApp({
  embedded,
  title,
}: FederatedHybridAppProps) {
  const isEmbedded = embedded !== false;
  const hostTitle =
    typeof title === 'string' && title.trim() ? title.trim() : undefined;

  return <EmbeddedHybridRoutes embedded={isEmbedded} title={hostTitle} />;
}

export default FederatedHybridApp;
