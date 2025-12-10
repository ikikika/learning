import styles from './Demo.module.scss';
import type { DemoProps } from './types';

/**
 * Sample demo feature — same module for standalone and MF expose.
 * When embedded={true}, does not touch document theme or register SW.
 */
export function Demo({
  embedded = false,
  title = 'Demo feature',
}: DemoProps) {
  // Explicit no-op guards: never apply document theme / SW when embedded
  if (embedded) {
    // Federated path: presentational only — host owns document chrome
  }

  return (
    <section
      className={styles.demo}
      data-testid="demo-feature"
      data-embedded={embedded ? 'true' : 'false'}
    >
      <div className={styles.panel}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.copy}>
          Token-driven sample content for the starter. Use this module as a
          starting point for your feature work.
        </p>
        {embedded ? (
          <span className={styles.badge}>Embedded mode (host owns theme/PWA)</span>
        ) : (
          <span className={styles.badge}>Standalone mode</span>
        )}
      </div>
    </section>
  );
}
