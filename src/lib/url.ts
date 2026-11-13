/**
 * URLs come from editable JSON and are rendered into `href`/`src` attributes.
 * Only allow schemes that cannot execute script (blocks `javascript:`, `data:`, `vbscript:` …).
 */
const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function safeUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  // Same-site paths and in-page anchors, e.g. "/resume/resume.pdf" or "#contact".
  // Reject protocol-relative URLs ("//evil.com") which would leave the site.
  if ((trimmed.startsWith('/') && !trimmed.startsWith('//')) || trimmed.startsWith('#')) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    return SAFE_PROTOCOLS.has(url.protocol) ? trimmed : undefined;
  } catch {
    return undefined;
  }
}

export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
