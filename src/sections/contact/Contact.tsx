import { Check, Copy, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Reveal } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { buttonClasses, cardClasses } from '../../components/ui/styles';
import { resolveSocialIcon } from '../../lib/icons';
import { isExternalUrl } from '../../lib/url';
import type { ContactConfig, SectionCopy, SocialLink } from '../../types/content';
import { ContactForm } from './ContactForm';

interface ContactProps {
  copy: SectionCopy;
  email?: string;
  location?: string;
  /** Sanitised links (see `getSocialLinks`). Email links are shown via `email` instead. */
  socialLinks: readonly SocialLink[];
  config?: ContactConfig;
}

export function Contact({ copy, email, location, socialLinks, config }: ContactProps) {
  const channels = socialLinks.filter((link) => link.platform !== 'email');
  const canUseForm = Boolean(config?.formEndpoint || email);

  return (
    <Section id="contact" copy={copy}>
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
        <Reveal className="space-y-3 lg:col-span-2">
          {email && <EmailCard email={email} />}
          {channels.map((link) => {
            const Icon = resolveSocialIcon(link.platform);
            const external = isExternalUrl(link.url);
            return (
              <a
                key={link.id}
                href={link.url}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={cardClasses(true, 'flex items-center gap-4 p-4')}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-surface-muted text-fg">
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-fg">{link.label}</span>
                  <span className="block truncate text-sm text-fg-muted">{link.handle ?? link.url}</span>
                </span>
                {external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            );
          })}
          {location && (
            <p className="flex items-center gap-2 px-1 pt-2 text-sm text-fg-muted">
              <MapPin aria-hidden="true" className="size-4" />
              {location}
            </p>
          )}
        </Reveal>

        {canUseForm && (
          <Reveal delay={0.08} className={cardClasses(false, 'relative p-6 sm:p-8 lg:col-span-3')}>
            <h3 className="mb-6 text-lg font-semibold text-fg">Send a message</h3>
            <ContactForm email={email} endpoint={config?.formEndpoint} subjectPrefix={config?.subjectPrefix} />
          </Reveal>
        )}
      </div>
    </Section>
  );
}

function EmailCard({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      /* Clipboard unavailable (insecure context / permissions); the mailto link still works. */
    }
  };

  return (
    <div className={cardClasses(false, 'flex items-center gap-4 p-4')}>
      <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-accent/30 bg-accent-soft text-accent">
        <Mail className="size-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-fg">Email</span>
        <a href={`mailto:${email}`} className="block truncate text-sm text-accent underline-offset-4 hover:underline">
          {email}
        </a>
      </span>
      <button
        type="button"
        onClick={copy}
        className={buttonClasses('ghost', 'icon')}
        aria-label={copied ? 'Email address copied' : 'Copy email address'}
        title="Copy email address"
      >
        {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </div>
  );
}
