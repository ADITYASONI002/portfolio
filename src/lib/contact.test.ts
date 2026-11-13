import { describe, expect, it, vi } from 'vitest';
import { buildMailtoUrl, hasErrors, submitToEndpoint, validateContactForm } from './contact';

const valid = { name: 'Ada', email: 'ada@example.com', subject: '', message: 'Hello, I would like to talk about a role.' };

describe('validateContactForm', () => {
  it('accepts a valid form', () => {
    expect(hasErrors(validateContactForm(valid))).toBe(false);
  });

  it('requires name, a valid email and a message of minimum length', () => {
    const errors = validateContactForm({ name: ' ', email: 'nope', subject: '', message: 'short' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name']);
  });

  it('enforces maximum lengths', () => {
    const errors = validateContactForm({ ...valid, subject: 'x'.repeat(151), message: 'x'.repeat(3001) });
    expect(errors.subject).toBeDefined();
    expect(errors.message).toBeDefined();
  });
});

describe('buildMailtoUrl', () => {
  it('encodes subject and body so user input cannot inject extra headers', () => {
    const url = buildMailtoUrl('me@example.com', { ...valid, subject: 'Role&cc=attacker@x.com' }, '[Portfolio]');
    expect(url.startsWith('mailto:me%40example.com?subject=')).toBe(true);
    const params = new URLSearchParams(url.split('?')[1]);
    expect([...params.keys()]).toEqual(['subject', 'body']);
    expect(params.get('subject')).toBe('[Portfolio] Role&cc=attacker@x.com');
    expect(params.get('body')).toContain('ada@example.com');
    expect(url).not.toContain('+');
  });

  it('falls back to a generated subject', () => {
    const params = new URLSearchParams(buildMailtoUrl('me@example.com', valid).split('?')[1]);
    expect(params.get('subject')).toBe('Message from Ada');
  });
});

describe('submitToEndpoint', () => {
  it('posts trimmed JSON to an HTTPS endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    await submitToEndpoint('https://formspree.io/f/abc', { ...valid, name: '  Ada ' }, fetchMock);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://formspree.io/f/abc');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body).name).toBe('Ada');
  });

  it('refuses non-HTTPS endpoints and surfaces HTTP errors', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    await expect(submitToEndpoint('http://insecure.example.com', valid, fetchMock)).rejects.toThrow(/HTTPS/);
    await expect(submitToEndpoint('https://ok.example.com', valid, fetchMock)).rejects.toThrow(/500/);
  });
});
