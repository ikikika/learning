import { useEffect, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './ThemeProvider';
import { registerPwa } from './registerPwa';

/**
 * Standalone-entry providers only.
 * Federated Demo uses embedded={true} and does not mount these.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerPwa();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  );
}
