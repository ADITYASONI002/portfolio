import { cn } from '../lib/cn';
import { resolveSocialIcon } from '../lib/icons';
import { isExternalUrl } from '../lib/url';
import type { SocialLink } from '../types/content';
import { buttonClasses, type ButtonVariant } from './ui/styles';

interface SocialLinksProps {
  /** Links must already be sanitised (see `getSocialLinks`). */
  links: readonly SocialLink[];
  variant?: ButtonVariant;
  className?: string;
}

export function SocialLinks({ links, variant = 'secondary', className }: SocialLinksProps) {
  if (links.length === 0) return null;
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)} aria-label="Social profiles">
      {links.map((link) => {
        const Icon = resolveSocialIcon(link.platform);
        const external = isExternalUrl(link.url);
        return (
          <li key={link.id}>
            <a
              href={link.url}
              aria-label={external ? `${link.label} (opens in a new tab)` : link.label}
              title={link.label}
              className={buttonClasses(variant, 'icon')}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <Icon size={18} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
