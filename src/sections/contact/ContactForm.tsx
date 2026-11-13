import { CheckCircle2, Send } from 'lucide-react';
import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';
import {
  CONTACT_LIMITS,
  buildMailtoUrl,
  hasErrors,
  submitToEndpoint,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from '../../lib/contact';

const EMPTY: ContactFormValues = { name: '', email: '', subject: '', message: '' };

type Status = 'idle' | 'submitting' | 'sent' | 'mailto' | 'error';

interface ContactFormProps {
  /** Recipient for the mailto fallback. */
  email?: string;
  /** HTTPS endpoint (e.g. Formspree). When absent the form opens the visitor's mail client. */
  endpoint?: string;
  subjectPrefix?: string;
  /** Injected for tests. */
  navigate?: (url: string) => void;
}

export function ContactForm({
  email,
  endpoint,
  subjectPrefix,
  navigate = (url) => window.location.assign(url),
}: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(EMPTY);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [honeypot, setHoneypot] = useState('');
  const formId = useId();
  const usesEndpoint = Boolean(endpoint);

  const update = (field: keyof ContactFormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Re-validate live only after the first submit attempt, so users are not nagged while typing.
    if (submitted) setErrors(validateContactForm(next));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validateContactForm(values);
    setErrors(found);
    if (hasErrors(found)) {
      const firstInvalid = (Object.keys(found) as Array<keyof ContactFormValues>)[0];
      document.getElementById(`${formId}-${firstInvalid}`)?.focus();
      return;
    }

    // Bots fill hidden fields; silently accept without sending.
    if (honeypot) {
      setStatus('sent');
      return;
    }

    if (endpoint) {
      setStatus('submitting');
      try {
        await submitToEndpoint(endpoint, values);
        setStatus('sent');
        setValues(EMPTY);
        setSubmitted(false);
      } catch {
        setStatus('error');
      }
      return;
    }

    if (email) {
      navigate(buildMailtoUrl(email, values, subjectPrefix));
      setStatus('mailto');
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="flex flex-col items-start gap-3 py-6">
        <CheckCircle2 aria-hidden="true" className="size-8 text-success" />
        <p className="text-lg font-semibold text-fg">Thanks — your message has been sent.</p>
        <p className="text-fg-muted">I will get back to you at the email address you provided.</p>
        <Button variant="secondary" size="sm" className="mt-2" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={`${formId}-mode`}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-name`}
          label="Name"
          error={errors.name}
          input={
            <input
              id={`${formId}-name`}
              name="name"
              autoComplete="name"
              maxLength={CONTACT_LIMITS.name}
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${formId}-name-error` : undefined}
              className={inputClasses(Boolean(errors.name))}
              required
            />
          }
        />
        <Field
          id={`${formId}-email`}
          label="Email"
          error={errors.email}
          input={
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={CONTACT_LIMITS.email}
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${formId}-email-error` : undefined}
              className={inputClasses(Boolean(errors.email))}
              required
            />
          }
        />
        <Field
          id={`${formId}-subject`}
          label="Subject"
          optional
          error={errors.subject}
          className="sm:col-span-2"
          input={
            <input
              id={`${formId}-subject`}
              name="subject"
              maxLength={CONTACT_LIMITS.subject}
              value={values.subject}
              onChange={(e) => update('subject', e.target.value)}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? `${formId}-subject-error` : undefined}
              className={inputClasses(Boolean(errors.subject))}
            />
          }
        />
        <Field
          id={`${formId}-message`}
          label="Message"
          error={errors.message}
          className="sm:col-span-2"
          input={
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={5}
              maxLength={CONTACT_LIMITS.message}
              value={values.message}
              onChange={(e) => update('message', e.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${formId}-message-error` : undefined}
              className={cn(inputClasses(Boolean(errors.message)), 'h-auto min-h-32 resize-y py-3')}
              required
            />
          }
        />
      </div>

      {/* Honeypot: hidden from people and assistive tech, attractive to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input
          id={`${formId}-company`}
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${formId}-mode`} className="text-sm text-fg-subtle sm:max-w-xs">
          {usesEndpoint
            ? 'Your message is sent securely; I reply by email.'
            : 'Sending opens your email app with this message pre-filled — nothing is stored on this site.'}
        </p>
        <Button type="submit" disabled={status === 'submitting'} className="sm:self-start">
          <Send aria-hidden="true" className="size-4" />
          {status === 'submitting' ? 'Sending…' : usesEndpoint ? 'Send message' : 'Open in email app'}
        </Button>
      </div>

      <div aria-live="polite" className="mt-4 empty:hidden">
        {status === 'mailto' && (
          <p className="rounded-lg border border-border bg-surface-muted p-3.5 text-sm text-fg-muted">
            Your email app should now be open with the message ready to send. If nothing happened, email me directly
            at{' '}
            <a className="font-medium text-accent underline underline-offset-4" href={`mailto:${email}`}>
              {email}
            </a>
            .
          </p>
        )}
        {status === 'error' && (
          <p role="alert" className="rounded-lg border border-danger/40 bg-surface-muted p-3.5 text-sm text-fg">
            Sorry, the message could not be sent.
            {email && (
              <>
                {' '}
                Please email me directly at{' '}
                <a className="font-medium text-accent underline underline-offset-4" href={`mailto:${email}`}>
                  {email}
                </a>
                .
              </>
            )}
          </p>
        )}
      </div>
    </form>
  );
}

function inputClasses(invalid: boolean) {
  return cn(
    'block h-11 w-full rounded-[var(--radius-control)] border bg-bg px-3.5 text-[0.9375rem] text-fg placeholder:text-fg-subtle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none',
    invalid ? 'border-danger focus-visible:border-danger' : 'border-border-strong focus-visible:border-accent',
  );
}

interface FieldProps {
  id: string;
  label: string;
  input: ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
}

function Field({ id, label, input, error, optional, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-fg">
        {label}
        {optional && <span className="text-xs font-normal text-fg-subtle">Optional</span>}
      </label>
      {input}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
