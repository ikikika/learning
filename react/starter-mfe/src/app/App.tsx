import { useRoutes } from 'react-router';
// Role-selected at build time via webpack alias `@active-routes`
import { routes } from '@active-routes';

export type AppProps = {
  /** Shell passes `embedded={true}` when mounting the federated expose. */
  embedded?: boolean;
};

export function App({ embedded }: AppProps) {
  void embedded;
  return useRoutes(routes);
}

export default App;
