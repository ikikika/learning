import { RouteObject } from 'react-router';
import { routePaths } from '@/core/constants/routePaths';
import { MainLayout } from '@/layouts/MainLayout/MainLayout';
import { HomePage } from '@/pages/HomePage/HomePage';

export const routes: RouteObject[] = [
  {
    path: routePaths.root,
    element: <MainLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
];

export const standaloneRoutes = routes;
