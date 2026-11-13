/**
 * Build-time prerender entry (see scripts/prerender.mjs). Produces the initial HTML so the
 * page paints before JavaScript loads and crawlers see real content. The client then
 * mounts a fresh React root over it (no hydration, so build-time dates never mismatch).
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
