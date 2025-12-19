import { RouteObject } from 'react-router';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { DemoShellHomePage } from '../../pages/DemoShellHomePage/DemoShellHomePage';
import { ShellWelcome, RemotePanel } from '../../features/demoShell';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <DemoShellHomePage />,
        children: [
          { index: true, element: <ShellWelcome /> },
          { path: 'remote/:alias', element: <RemotePanel /> },
        ],
      },
    ],
  },
];

export const shellRoutes = routes;
