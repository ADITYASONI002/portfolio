/**
 * Generates everything a crawler or link preview needs from the same JSON that drives the UI,
 * so SEO metadata is never duplicated by hand:
 *   - <title>, description, keywords, canonical, Open Graph, Twitter card, JSON-LD (index.html)
 *   - theme-color metas and a pre-paint theme script (prevents a light/dark flash)
 *   - favicon.svg built from the profile initials
 *   - sitemap.xml and robots.txt (production build only)
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { THEME_STORAGE_KEY } from '../src/lib/theme-constants.ts';
import type { Profile, SiteConfig, SocialLink } from '../src/types/content.ts';

const HEAD_MARKER = '<!--portfolio:head-->';

interface SeoData {
  site: SiteConfig;
  profile: Profile;
  social: SocialLink[];
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** JSON safe to embed inside <script>: `<` is escaped so `</script>` cannot close the tag. */
function scriptJson(value: unknown): string {
  const BACKSLASH = String.fromCharCode(92);
  const LINE_SEPARATOR = String.fromCharCode(0x2028);
  const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);
  return JSON.stringify(value)
    .split('<')
    .join(`${BACKSLASH}u003c`)
    .split(LINE_SEPARATOR)
    .join(`${BACKSLASH}u2028`)
    .split(PARAGRAPH_SEPARATOR)
    .join(`${BACKSLASH}u2029`);
}

/** The site URL without a trailing slash, or `null` if it is not a valid http(s) URL. */
export function normalizeSiteUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString().replace(/\/+$/, '');
  } catch {
    return null;
  }
}

function initialsOf(profile: Profile): string {
  if (profile.initials?.trim()) return profile.initials.trim().slice(0, 3).toUpperCase();
  const parts = profile.name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '·';
}

export function buildFaviconSvg(profile: Profile): string {
  const initials = escapeHtml(initialsOf(profile));
  const fontSize = initials.length > 2 ? 22 : 28;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0d0f12"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="${fontSize}" font-weight="600" fill="#f4f5f7">${initials}</text></svg>`;
}

export function buildHeadTags({ site, profile, social }: SeoData): string {
  const siteUrl = normalizeSiteUrl(site.siteUrl);
  const tags: string[] = [];
  const meta = (attr: 'name' | 'property', key: string, value: string | undefined) => {
    if (value) tags.push(`<meta ${attr}="${key}" content="${escapeHtml(value)}" />`);
  };

  tags.push(`<title>${escapeHtml(site.title)}</title>`);
  meta('name', 'description', site.description);
  if (site.keywords?.length) meta('name', 'keywords', site.keywords.join(', '));
  meta('name', 'author', profile.name);
  tags.push('<meta name="robots" content="index, follow" />');
  tags.push('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
  if (site.themeColor) {
    tags.push(`<meta name="theme-color" media="(prefers-color-scheme: light)" content="${escapeHtml(site.themeColor.light)}" />`);
    tags.push(`<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${escapeHtml(site.themeColor.dark)}" />`);
  }
  if (siteUrl) tags.push(`<link rel="canonical" href="${escapeHtml(`${siteUrl}/`)}" />`);

  // Open Graph / Twitter
  meta('property', 'og:type', 'profile');
  meta('property', 'og:title', site.title);
  meta('property', 'og:description', site.description);
  meta('property', 'og:site_name', profile.name);
  if (site.locale) meta('property', 'og:locale', site.locale.replace('-', '_'));
  if (siteUrl) meta('property', 'og:url', `${siteUrl}/`);

  const ogImage = site.ogImage?.src?.trim();
  const ogImageUrl = ogImage && siteUrl ? new URL(ogImage, `${siteUrl}/`).toString() : undefined;
  if (ogImageUrl) {
    meta('property', 'og:image', ogImageUrl);
    meta('property', 'og:image:alt', site.ogImage?.alt);
    meta('property', 'og:image:width', String(site.ogImage?.width ?? 1200));
    meta('property', 'og:image:height', String(site.ogImage?.height ?? 630));
  }
  meta('name', 'twitter:card', ogImageUrl ? 'summary_large_image' : 'summary');
  meta('name', 'twitter:title', site.title);
  meta('name', 'twitter:description', site.description);
  if (ogImageUrl) meta('name', 'twitter:image', ogImageUrl);
  if (site.twitterHandle) meta('name', 'twitter:site', site.twitterHandle);

  // Structured data (schema.org Person)
  const sameAs = social
    .map((link) => link.url)
    .filter((url) => /^https?:\/\//i.test(url));
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary,
    ...(siteUrl ? { url: `${siteUrl}/` } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(profile.coreStack?.length ? { knowsAbout: profile.coreStack } : {}),
  };
  tags.push(`<script type="application/ld+json">${scriptJson(person)}</script>`);

  // Apply the saved/system theme before first paint to avoid a flash of the wrong theme.
  const defaultTheme = ['light', 'dark', 'system'].includes(site.defaultTheme ?? '') ? site.defaultTheme : 'system';
  tags.push(
    `<script>(function(){try{var k=${scriptJson(THEME_STORAGE_KEY)},d=${scriptJson(defaultTheme)},t=localStorage.getItem(k)||d;if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.colorScheme=t}catch(e){}})();</script>`,
  );

  return tags.join('\n    ');
}

export function buildRobotsTxt(siteUrl: string | null): string {
  return ['User-agent: *', 'Allow: /', ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : []), ''].join('\n');
}

export function buildSitemapXml(siteUrl: string, lastModified: Date): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeHtml(`${siteUrl}/`)}</loc>
    <lastmod>${lastModified.toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

export function portfolioSeo(options: { dataDir: string; publicDir: string }): Plugin {
  const read = <T,>(file: string): T => JSON.parse(readFileSync(resolve(options.dataDir, file), 'utf-8')) as T;
  // Re-read on every call so edits to JSON show up in dev without restarting the server.
  const load = (): SeoData => ({
    site: read<SiteConfig>('site-config.json'),
    profile: read<Profile>('profile.json'),
    social: read<SocialLink[]>('social-links.json'),
  });

  return {
    name: 'portfolio-seo',
    // The SSR prerender pass has no index.html and must not emit duplicate assets.
    apply: (_config, env) => !env.isSsrBuild,

    configureServer(server) {
      server.middlewares.use('/favicon.svg', (_req, res) => {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(buildFaviconSvg(load().profile));
      });
    },

    transformIndexHtml(html) {
      const data = load();
      const lang = escapeHtml(data.site.locale || 'en');
      return html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`).replace(HEAD_MARKER, buildHeadTags(data));
    },

    generateBundle() {
      const data = load();
      const siteUrl = normalizeSiteUrl(data.site.siteUrl);
      if (!siteUrl) {
        this.warn('site-config.json "siteUrl" is not a valid http(s) URL: canonical, og:url and sitemap.xml are skipped.');
      }
      const ogImage = data.site.ogImage?.src?.trim();
      if (ogImage?.startsWith('/') && !existsSync(resolve(options.publicDir, `.${ogImage}`))) {
        this.warn(`site-config.json "ogImage.src" points to ${ogImage}, which does not exist in public/.`);
      }

      this.emitFile({ type: 'asset', fileName: 'favicon.svg', source: buildFaviconSvg(data.profile) });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt(siteUrl) });
      if (siteUrl) {
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemapXml(siteUrl, new Date()) });
      }
    },
  };
}
