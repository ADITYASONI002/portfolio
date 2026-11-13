import { describe, expect, it } from 'vitest';
import { isExternalUrl, safeUrl } from './url';

describe('safeUrl', () => {
  it.each([
    'https://github.com/user',
    'http://example.com',
    'mailto:me@example.com',
    'tel:+10000000000',
    '/resume/resume.pdf',
    '#contact',
  ])('allows %s', (url) => {
    expect(safeUrl(url)).toBe(url);
  });

  it.each([
    'javascript:alert(1)',
    ' JaVaScRiPt:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    '//evil.example.com',
    'not a url',
    '',
    undefined,
  ])('rejects %s', (url) => {
    expect(safeUrl(url)).toBeUndefined();
  });

  it('detects external URLs', () => {
    expect(isExternalUrl('https://x.com')).toBe(true);
    expect(isExternalUrl('/resume.pdf')).toBe(false);
    expect(isExternalUrl('mailto:a@b.co')).toBe(false);
  });
});
