/**
 * ProtectedRoute — redirects unauthenticated users to /login.
 * Wrap any route element with this to require authentication.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/app/providers/auth';
import { ROUTES } from '@/app/routes/routes';
import { ProtectedLayout } from '@/components/organisms/ProtectedLayout/ProtectedLayout';
import { Loading } from '@/components/molecules/Loading/Loading';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    // Preserve the intended destination so we can redirect back after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <ProtectedLayout />;
};
