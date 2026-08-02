import styles from './RemoteFallback.module.scss';
import type { RemoteFallbackProps } from './types';

export function RemoteFallback({
  reason = 'The remote module could not be loaded.',
  title = 'Remote unavailable',
}: RemoteFallbackProps) {
  return (
    <div
      className={styles.fallback}
      role="alert"
      data-testid="remote-fallback"
    >
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.reason}>{reason}</p>
    </div>
  );
}
