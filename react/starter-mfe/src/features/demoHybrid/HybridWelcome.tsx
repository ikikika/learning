import { REMOTE_SLOTS } from '../../core/constants/remotes';
import styles from './HybridWelcome.module.scss';

/**
 * Sample hybrid home content for the Hybrid nav item (no module load).
 * Renders a usable empty state when no leaf modules are registered yet.
 */
export function HybridWelcome() {
  const hasModules = REMOTE_SLOTS.length > 0;

  return (
    <div className={styles.welcome} data-testid="hybrid-welcome">
      <h1 className={styles.title}>Hybrid</h1>
      {hasModules ? (
        <p className={styles.copy}>
          Hybrid chrome sample. Select a module in the left nav to load a
          federated leaf remote into this panel.
        </p>
      ) : (
        <p
          className={styles.copy}
          data-testid="demo-hybrid-empty-state"
        >
          No module remotes are registered yet. Run{' '}
          <code className={styles.code}>npm run add-remote</code> to register
          a leaf module, then restart to see it in the nav above.
        </p>
      )}
    </div>
  );
}
