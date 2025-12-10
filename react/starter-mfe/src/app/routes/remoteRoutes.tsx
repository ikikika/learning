import { RouteObject } from 'react-router';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { HomePage } from '../../pages/HomePage/HomePage';

/** Remote dual-mode: standalone entry reuses HomePage / demo (without embedded). */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
];

export const remoteRoutes = routes;
