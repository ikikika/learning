import { createRoot } from 'react-dom/client';
import { AppProviders } from './app/providers/AppProviders';
import { App } from './app/App';
import './styles/tokens.css';
import './styles/global.scss';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

createRoot(rootEl).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
