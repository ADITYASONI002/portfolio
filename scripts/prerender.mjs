/**
 * Injects the server-rendered app into dist/index.html, then removes the temporary SSR bundle.
 * Run by `npm run build` after the client and SSR builds.
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT_MARKUP = '<div id="root"></div>';
const ssrDir = resolve('dist-ssr');
const indexPath = resolve('dist/index.html');

try {
  const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);
  const template = readFileSync(indexPath, 'utf-8');
  if (!template.includes(ROOT_MARKUP)) throw new Error(`dist/index.html does not contain ${ROOT_MARKUP}`);
  const appHtml = render();
  writeFileSync(indexPath, template.replace(ROOT_MARKUP, `<div id="root">${appHtml}</div>`));
  console.log(`prerender: injected ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`);
} finally {
  rmSync(ssrDir, { recursive: true, force: true });
}
