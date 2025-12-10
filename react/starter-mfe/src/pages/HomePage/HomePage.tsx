import { Demo } from '../../features/demo';
import styles from './HomePage.module.scss';

export function HomePage() {
  return (
    <div className={styles.page} data-testid="home-page">
      <Demo />
    </div>
  );
}
