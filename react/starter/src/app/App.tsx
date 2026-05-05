/**
 * App — sets up the router and top-level providers.
 */

import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/app/providers/auth';
import { ThemeProvider } from '@/app/providers/theme';
import { ProtectedRoute } from '@/app/routes/ProtectedRoute';
import { ROUTES } from '@/app/routes/routes';
import { Loading } from '@/components/molecules/Loading/Loading';
import '@/styles/tailwind.css';
import '@/styles/index.scss';

// Lazy-load pages for code splitting
const LandingPage = lazy(() =>
  import('@/pages/LandingPage/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const LoginPage = lazy(() =>
  import('@/pages/LoginPage/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  }))
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage/ProfilePage').then((m) => ({
    default: m.ProfilePage,
  }))
);

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <Suspense fallback={<Loading />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    // All protected pages live under this wrapper route
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: (
          <Suspense fallback={<Loading />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <Suspense fallback={<Loading />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },
  // Landing page at root
  {
    path: ROUTES.HOME,
    element: (
      <Suspense fallback={<Loading />}>
        <LandingPage />
      </Suspense>
    ),
  },
  { path: ROUTES.NOT_FOUND, element: <Navigate to={ROUTES.HOME} replace /> },
]);

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
