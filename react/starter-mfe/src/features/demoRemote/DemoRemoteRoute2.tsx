import { Link } from 'react-router';
import styles from './DemoRemoteRoute2.module.scss';

/**
 * Sample remote content for Route 2.
 * Reachable via in-remote link from Route 1 (MemoryRouter) or own-app URL.
 */
export function DemoRemoteRoute2() {
  return (
    <div className={styles.panel} data-testid="demo-remote-route-2">
      <h1 className={styles.title}>Route 2</h1>
      <p className={styles.copy}>
        Second sample remote page. Reachable by URL when the remote runs as its
        own app (for example <code>/route-2</code>), or via the Route 1 link
        when embedded.
      </p>
      <p className={styles.nav}>
        <Link to="/route-1" data-testid="demo-remote-to-route-1">
          Back to Route 1
        </Link>
      </p>
    </div>
  );
}
