/**
 * AuthProvider component
 * Provides auth state and actions throughout the tree.
 * Follows Dependency Inversion: components depend on the context interface,
 * not on the concrete useAuth hook directly.
 */

import React, { useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { useThemeContext } from '@/app/providers/theme';
import { AuthContext } from './useAuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, error, loadCurrentUser, login, logout } = useAuth();
  const { setTheme } = useThemeContext();

  useEffect(() => {
    loadCurrentUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user?.themePreference) {
      return;
    }
    setTheme(user.themePreference);
  }, [setTheme, user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
