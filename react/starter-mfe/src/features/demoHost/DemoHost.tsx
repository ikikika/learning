import { NavLink, Outlet } from 'react-router';
import { composeChildPath } from '../../core/constants/composeRoutes';
import { REMOTE_SLOTS } from '../../core/constants/remotes';
import styles from './DemoHost.module.scss';

function navClassName({ isActive }: { isActive: boolean }): string {
  return isActive
    ? `${styles.navLink} ${styles.navLinkActive}`
    : styles.navLink;
}

/**
 * Two-pane host chrome: left nav from REMOTE_SLOTS + right panel Outlet.
 * Composed children live under `/app/:alias/*`.
 */
export function DemoHost() {
  return (
    <div className={styles.root} data-testid="demo-host-home-page">
      <nav className={styles.nav} aria-label="Host">
        <ul className={styles.navList}>
          <li>
            <NavLink to="/" end className={navClassName}>
              Host
            </NavLink>
          </li>
          {REMOTE_SLOTS.map((slot) => (
            <li key={slot.alias}>
              <NavLink
                to={composeChildPath(slot.alias)}
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
