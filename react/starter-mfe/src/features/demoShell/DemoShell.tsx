import { NavLink, Outlet } from 'react-router';
import { REMOTE_SLOTS } from '../../core/constants/remotes';
import styles from './DemoShell.module.scss';

function navClassName({ isActive }: { isActive: boolean }): string {
  return isActive
    ? `${styles.navLink} ${styles.navLinkActive}`
    : styles.navLink;
}

/**
 * Two-pane shell chrome: left nav from REMOTE_SLOTS + right panel Outlet.
 */
export function DemoShell() {
  return (
    <div className={styles.root} data-testid="demo-shell-home-page">
      <nav className={styles.nav} aria-label="Shell">
        <ul className={styles.navList}>
          <li>
            <NavLink to="/" end className={navClassName}>
              Shell
            </NavLink>
          </li>
          {REMOTE_SLOTS.map((slot) => (
            <li key={slot.alias}>
              <NavLink
                to={`/remote/${slot.alias}`}
                className={navClassName}
              >
                {slot.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.panel}>
        <Outlet />
      </div>
    </div>
  );
}
