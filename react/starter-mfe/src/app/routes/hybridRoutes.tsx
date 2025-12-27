import { RouteObject } from 'react-router';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { DemoHybridHomePage } from '../../pages/DemoHybridHomePage/DemoHybridHomePage';
import {
  DemoHybridHome,
  HybridWelcome,
  HybridRemotePanel,
} from '../../features/demoHybrid';

const hybridPageChildren: RouteObject[] = [
  { index: true, element: <HybridWelcome /> },
  // Bare `:alias/*` so under shell `/app/<hybrid>/…` leaf URLs are
  // `/app/<hybrid>/<leaf>/route-1` (no repeated mount keyword).
  { path: ':alias/*', element: <HybridRemotePanel /> },
];

/**
 * Own-app hybrid routes — `MainLayout` owns document theme/PWA chrome
 * (same pattern as `hostRoutes`).
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <DemoHybridHomePage />,
        children: hybridPageChildren,
      },
    ],
  },
];

export const hybridRoutes = routes;

/**
 * Relative routes for federated embed under the shell's `app/:alias/*`.
 * Participates in the composer's BrowserRouter so the address bar updates
 * (same nesting idea as `remoteRoutes`' `embeddedRoutes`).
 *
 * Built dynamically (not a static array) because `embedded`/`title` come
 * from `FederatedHybridApp` props at mount time and must flow into
 * `DemoHybridHome` to suppress the hybrid theme toggle authoritatively.
 */
export function buildEmbeddedHybridRoutes(
  embedded: boolean,
  title?: string,
): RouteObject[] {
  // Pathless layout (same idea as remote `embeddedRoutes`) so nested
  // `useRoutes` matches the remaining splat under the composer's
  // `app/:alias/*` instead of resetting to absolute `/`.
  return [
    {
      element: (
        <DemoHybridHome
          embedded={embedded}
          showThemeToggle={false}
          title={title}
        />
      ),
      children: hybridPageChildren,
    },
  ];
}
