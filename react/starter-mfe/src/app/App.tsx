import { useRoutes } from 'react-router';
// Role-selected at build time via webpack alias `@active-routes`
import { routes } from '@active-routes';

export function App() {
  return useRoutes(routes);
}
