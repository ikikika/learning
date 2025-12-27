import { RouteObject } from 'react-router';
import { COMPOSE_MOUNT_ROUTE } from '../../core/constants/composeRoutes';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { DemoHostHomePage } from '../../pages/DemoHostHomePage/DemoHostHomePage';
import { HostWelcome, RemotePanel } from '../../features/demoHost';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <DemoHostHomePage />,
        children: [
          { index: true, element: <HostWelcome /> },
          { path: COMPOSE_MOUNT_ROUTE, element: <RemotePanel /> },
        ],
      },
    ],
  },
];

export const hostRoutes = routes;
