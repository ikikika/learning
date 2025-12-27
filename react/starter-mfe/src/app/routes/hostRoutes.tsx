import { RouteObject } from 'react-router';
import { routePaths } from '../../core/constants/routePaths';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { DemoHostHomePage } from '../../pages/DemoHostHomePage/DemoHostHomePage';
import { HostWelcome, RemotePanel } from '../../features/demoHost';

export const routes: RouteObject[] = [
  {
    path: routePaths.root,
    element: <MainLayout />,
    children: [
      {
        element: <DemoHostHomePage />,
        children: [
          { index: true, element: <HostWelcome /> },
          { path: routePaths.compose.mount, element: <RemotePanel /> },
        ],
      },
    ],
  },
];

export const hostRoutes = routes;
