import { Outlet } from 'react-router';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ConnectionRequired } from '@/components/ConnectionRequired';
import { useOnlineStatus } from '@/core/hooks/useOnlineStatus';
import styles from './MainLayout.module.scss';

export function MainLayout() {
  const online = useOnlineStatus();

  return (
    <div className={styles.host}>
      <header className={styles.header}>
        <div className={styles.brand}>Starter MFE</div>
        <ThemeToggle />
      </header>
      <ConnectionRequired visible={!online} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
