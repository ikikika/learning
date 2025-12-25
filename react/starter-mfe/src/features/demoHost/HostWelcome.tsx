import styles from './HostWelcome.module.scss';

/**
 * Sample host content for the Host nav item (no remote load).
 */
export function HostWelcome() {
  return (
    <div className={styles.welcome} data-testid="host-welcome">
      <h1 className={styles.title}>Host</h1>
      <p className={styles.copy}>
        Host chrome sample. When remotes are configured, select one in the left
        nav to load a federated module into this panel.
      </p>
    </div>
  );
}
