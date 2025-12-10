import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { ShellHomePage } from '../../pages/ShellHomePage/ShellHomePage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [{ index: true, element: <ShellHomePage /> }],
  },
];

export const shellRoutes = routes;
