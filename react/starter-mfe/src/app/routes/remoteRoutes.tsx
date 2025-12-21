import { Navigate, Outlet, RouteObject } from 'react-router';
import { DemoRemoteRoute1Page } from '../../pages/DemoRemoteRoute1Page/DemoRemoteRoute1Page';
import { DemoRemoteRoute2Page } from '../../pages/DemoRemoteRoute2Page/DemoRemoteRoute2Page';

const remotePageChildren: RouteObject[] = [
  { index: true, element: <Navigate to="route-1" replace /> },
  { path: 'route-1', element: <DemoRemoteRoute1Page /> },
  { path: 'route-2', element: <DemoRemoteRoute2Page /> },
];

/**
 * Remote routes — no MainLayout (shell/standalone only).
 * Own-app entry via `@active-routes`; same tree for FederatedRemoteApp.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Outlet />,
    children: remotePageChildren,
  },
];

/** Alias for federated embed (identical — host owns document chrome). */
export const embeddedRoutes = routes;

export const remoteRoutes = routes;
