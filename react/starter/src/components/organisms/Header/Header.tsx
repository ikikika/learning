/**
 * Header Organism Component
 * Reads auth state from AuthContext — no prop drilling required.
 */

import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useAuthContext } from '@/app/providers/auth';
import { useThemeContext } from '@/app/providers/theme';
import { ROUTES } from '@/app/routes/routes';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { resolvedTheme, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [logout, navigate]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          React Starter
        </Link>

        {user ? (
          <div className={styles.userMenu}>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode
            </Button>
            <span className={styles.userName}>{user.displayName || user.name}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.PROFILE)}>
              Profile
            </Button>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className={styles.authButtons}>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>
              Sign In
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
