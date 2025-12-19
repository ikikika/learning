import styles from './ShellWelcome.module.scss';

/**
 * Sample host content for the Shell nav item (no remote load).
 */
export function ShellWelcome() {
  return (
    <div className={styles.welcome} data-testid="shell-welcome">
      <h1 className={styles.title}>Shell</h1>
      <p className={styles.copy}>
        Host chrome sample. When remotes are configured, select one in the left
        nav to load a federated module into this panel.
      </p>
    </div>
  );
}
