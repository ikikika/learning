import { LoadDemoRemote } from '../../app/remotes/loadDemoRemote';
import styles from './ShellHomePage.module.scss';

/**
 * Shell home — hosts one ./Demo slot. Does not import features/demo.
 */
export function ShellHomePage() {
  return (
    <div className={styles.page} data-testid="shell-home-page">
      <h1 className={styles.title}>Shell host</h1>
      <p className={styles.copy}>
        Federated demo slot (mounted with embedded={true}).
      </p>
      <div className={styles.slot}>
        <LoadDemoRemote />
      </div>
    </div>
  );
}
