import { Navigate, Outlet, RouteObject } from 'react-router';
import { routePaths } from '@/core/constants/routePaths';
import { DemoRemoteRoute1Page } from '@/pages/DemoRemoteRoute1Page/DemoRemoteRoute1Page';
import { DemoRemoteRoute2Page } from '@/pages/DemoRemoteRoute2Page/DemoRemoteRoute2Page';

const remotePageChildren: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={routePaths.remote.route1} replace />,
  },
  { path: routePaths.remote.route1, element: <DemoRemoteRoute1Page /> },
  { path: routePaths.remote.route2, element: <DemoRemoteRoute2Page /> },
];

/**
 * Remote routes — no MainLayout (host/standalone only).
 * Own-app entry via `@active-routes`.
 */
export const routes: RouteObject[] = [
  {
    path: routePaths.root,
    element: <Outlet />,
    children: remotePageChildren,
  },
];

/**
 * Relative routes for federated embed under shell compose mount
 * (or hybrid `routePaths.hybrid.childMount`). Participates in the composer
 * BrowserRouter so the address bar updates.
 */
export const embeddedRoutes: RouteObject[] = remotePageChildren;

export const remoteRoutes = routes;
