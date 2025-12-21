import styles from './DemoRemoteRoute1.module.scss';

/**
 * Sample remote content for Route 1 (no in-remote nav).
 */
export function DemoRemoteRoute1() {
  return (
    <div className={styles.panel} data-testid="demo-remote-route-1">
      <h1 className={styles.title}>Route 1</h1>
      <p className={styles.copy}>
        Sample remote page. This is the default entry when the remote runs on
        its own or is loaded into a shell panel.
      </p>
    </div>
  );
}
