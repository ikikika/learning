import { NavLink, Outlet } from 'react-router';
import { REMOTE_SLOTS } from '@/core/constants/remotes';
import { ThemeToggle } from '@/components/ThemeToggle';
import styles from './DemoHybridHome.module.scss';

export type DemoHybridHomeProps = {
  /** Composer (shell) passes `true` when nesting under a parent router. */
  embedded?: boolean;
  /** Render the hybrid-owned theme toggle in the header band. Ignored (forced off) when `embedded`. */
  showThemeToggle?: boolean;
  /** Optional composer-provided display title; additive only, never overrides `embedded`. */
  title?: string;
};

function navClassName({ isActive }: { isActive: boolean }): string {
  return isActive
    ? `${styles.navLink} ${styles.navLinkActive}`
    : styles.navLink;
}

/**
 * Hybrid chrome: header band (distinct layout cue) + nav+panel, same
 * composition pattern as `demoHost` but with hybrid-only tokens/branding.
 * `embedded` is authoritative and suppresses the header-band theme toggle.
 */
export function DemoHybridHome({
  embedded = false,
  showThemeToggle = true,
  title,
}: DemoHybridHomeProps) {
  const canShowToggle = showThemeToggle && !embedded;

  return (
    <div className={styles.root} data-testid="demo-hybrid-home-page">
      <header
        className={styles.headerBand}
        data-testid="demo-hybrid-header-band"
      >
        <div className={styles.headerText}>
          <span className={styles.headerTitle}>Hybrid</span>
          <span className={styles.headerTag}>
            Shell-composed chrome for nested module remotes
          </span>
          {title ? (
            <span
              className={styles.headerHostTitle}
              data-testid="demo-hybrid-host-title"
            >
              {title}
            </span>
          ) : null}
        </div>
        {canShowToggle ? (
          <ThemeToggle className={styles.headerToggle} />
        ) : null}
      </header>
      <div className={styles.body}>
        <nav className={styles.nav} aria-label="Hybrid">
          <ul className={styles.navList}>
            <li>
              {/* Relative so shell→hybrid keep the hybrid mount path */}
              <NavLink to="." end className={navClassName}>
                Hybrid
              </NavLink>
            </li>
            {REMOTE_SLOTS.map((slot) => (
              <li key={slot.alias}>
                {/* Bare alias → `/app/<hybrid>/<leaf>/…` when embedded */}
                <NavLink to={slot.alias} className={navClassName}>
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
    </div>
  );
}
