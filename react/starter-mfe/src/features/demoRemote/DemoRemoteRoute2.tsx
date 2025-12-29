import { Link } from 'react-router';
import { remoteSiblingPath, routePaths } from '@/core/constants/routePaths';
import styles from './DemoRemoteRoute2.module.scss';

/**
 * Sample remote content for Route 2.
 * Reachable via in-remote link from Route 1 or own-app URL.
 * Sibling links stay relative so nested shell→hybrid→leaf URLs keep their prefix.
 */
export function DemoRemoteRoute2() {
  return (
    <div className={styles.panel} data-testid="demo-remote-route-2">
      <h1 className={styles.title}>Route 2</h1>
      <p className={styles.copy}>
        Second sample remote page. Reachable by URL when the remote runs as its
        own app (for example <code>/{routePaths.remote.route2}</code>), or via
        the Route 1 link when embedded (composer address becomes{' '}
        <code>/{routePaths.compose.segment}/…/{routePaths.remote.route2}</code>,
        including nested hybrid mounts).
      </p>
      <p className={styles.nav}>
        <Link
          to={remoteSiblingPath(routePaths.remote.route1)}
          data-testid="demo-remote-to-route-1"
        >
          Back to Route 1
        </Link>
      </p>
    </div>
  );
}
