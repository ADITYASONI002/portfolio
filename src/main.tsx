import { StrictMode, startTransition } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found in index.html.');

const root = createRoot(container);
// The prerendered HTML is already on screen, so render as a transition: React splits the work
// into small chunks instead of one long task, keeping the page responsive while it mounts.
startTransition(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
