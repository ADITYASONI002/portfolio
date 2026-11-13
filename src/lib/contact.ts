export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  subject: 150,
  message: 3000,
  minMessage: 20,
} as const;

// Pragmatic check (something@something.tld); the mail server is the final authority.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > CONTACT_LIMITS.name) errors.name = `Name must be ${CONTACT_LIMITS.name} characters or fewer.`;

  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (subject.length > CONTACT_LIMITS.subject) {
    errors.subject = `Subject must be ${CONTACT_LIMITS.subject} characters or fewer.`;
  }

  if (!message) errors.message = 'Please enter a message.';
  else if (message.length < CONTACT_LIMITS.minMessage) {
    errors.message = `Please write at least ${CONTACT_LIMITS.minMessage} characters.`;
  } else if (message.length > CONTACT_LIMITS.message) {
    errors.message = `Message must be ${CONTACT_LIMITS.message} characters or fewer.`;
  }

  return errors;
}

export function hasErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Builds a `mailto:` URL with an encoded subject and body. */
export function buildMailtoUrl(recipient: string, values: ContactFormValues, subjectPrefix = ''): string {
  const subject = [subjectPrefix.trim(), values.subject.trim() || `Message from ${values.name.trim()}`]
    .filter(Boolean)
    .join(' ');
  const body = `${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`;
  const params = new URLSearchParams({ subject, body });
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${encodeURIComponent(recipient)}?${params.toString().replace(/\+/g, '%20')}`;
}

/**
 * Posts the form to a configured endpoint (e.g. Formspree). Only HTTPS endpoints are used so
 * visitor data is never sent in clear text.
 */
export async function submitToEndpoint(
  endpoint: string,
  values: ContactFormValues,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const url = new URL(endpoint);
  if (url.protocol !== 'https:') throw new Error('Contact endpoint must use HTTPS.');

  const response = await fetchImpl(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    }),
  });
  if (!response.ok) throw new Error(`Contact endpoint responded with ${response.status}.`);
}
