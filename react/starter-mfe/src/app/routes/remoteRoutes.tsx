import { Navigate, Outlet, RouteObject } from 'react-router';
import { DemoRemoteRoute1Page } from '../../pages/DemoRemoteRoute1Page/DemoRemoteRoute1Page';
import { DemoRemoteRoute2Page } from '../../pages/DemoRemoteRoute2Page/DemoRemoteRoute2Page';

const remotePageChildren: RouteObject[] = [
  { index: true, element: <Navigate to="route-1" replace /> },
  { path: 'route-1', element: <DemoRemoteRoute1Page /> },
  { path: 'route-2', element: <DemoRemoteRoute2Page /> },
];

/**
 * Remote routes — no MainLayout (host/standalone only).
 * Own-app entry via `@active-routes`.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Outlet />,
    children: remotePageChildren,
  },
];

/**
 * Relative routes for federated embed under host `remote/:alias/*`.
 * Participates in the host BrowserRouter so the address bar updates.
 */
export const embeddedRoutes: RouteObject[] = remotePageChildren;

export const remoteRoutes = routes;
