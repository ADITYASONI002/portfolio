import { describe, expect, it } from 'vitest';
import type { Profile, SiteConfig } from '../src/types/content';
import { buildFaviconSvg, buildHeadTags, buildRobotsTxt, buildSitemapXml, normalizeSiteUrl } from './seo-plugin';

const site: SiteConfig = {
  siteUrl: 'https://me.dev/',
  title: 'Ada "The" <Engineer>',
  description: 'Builds & ships',
  ogImage: { src: '/images/og.png', alt: 'Preview' },
};
const profile: Profile = { name: 'Ada</script><script>alert(1)</script>', title: 'Engineer', headline: 'h', summary: 's' };

describe('seo plugin', () => {
  it('escapes JSON values in meta tags and JSON-LD', () => {
    const html = buildHeadTags({ site, profile, social: [] });
    expect(html).toContain('<title>Ada &quot;The&quot; &lt;Engineer&gt;</title>');
    expect(html).toContain('content="Builds &amp; ships"');
    // Only the two scripts we emit may close; the name must not break out of JSON-LD.
    expect(html.match(/<\/script>/g)).toHaveLength(2);
    expect(html).not.toContain('<script>alert(1)');
  });

  it('builds absolute canonical and Open Graph URLs', () => {
    const html = buildHeadTags({ site, profile, social: [] });
    expect(html).toContain('<link rel="canonical" href="https://me.dev/" />');
    expect(html).toContain('content="https://me.dev/images/og.png"');
    expect(html).toContain('summary_large_image');
  });

  it('only lists http(s) links in sameAs', () => {
    const html = buildHeadTags({
      site,
      profile,
      social: [
        { id: 'gh', platform: 'github', label: 'GitHub', url: 'https://github.com/a' },
        { id: 'm', platform: 'email', label: 'Email', url: 'mailto:a@b.co' },
      ],
    });
    expect(html).toContain('"sameAs":["https://github.com/a"]');
  });

  it('normalises the site URL and rejects non-http values', () => {
    expect(normalizeSiteUrl('https://me.dev/')).toBe('https://me.dev');
    expect(normalizeSiteUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeSiteUrl('')).toBeNull();
  });

  it('produces robots.txt, sitemap.xml and an escaped favicon', () => {
    expect(buildRobotsTxt('https://me.dev')).toContain('Sitemap: https://me.dev/sitemap.xml');
    expect(buildRobotsTxt(null)).not.toContain('Sitemap');
    expect(buildSitemapXml('https://me.dev', new Date('2026-01-02T00:00:00Z'))).toContain('<lastmod>2026-01-02</lastmod>');
    expect(buildFaviconSvg({ ...profile, initials: '<&>' })).toContain('&lt;&amp;&gt;');
  });
});
