import styles from './DemoRemoteRoute2.module.scss';

/**
 * Sample remote content for Route 2 (no in-remote nav).
 */
export function DemoRemoteRoute2() {
  return (
    <div className={styles.panel} data-testid="demo-remote-route-2">
      <h1 className={styles.title}>Route 2</h1>
      <p className={styles.copy}>
        Second sample remote page. Reachable by URL when the remote runs as its
        own app (for example <code>/route-2</code>).
      </p>
    </div>
  );
}
