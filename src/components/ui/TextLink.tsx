import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { isExternalUrl, safeUrl } from '../../lib/url';

interface TextLinkProps {
  href: string | undefined;
  children: ReactNode;
  className?: string;
  /** Show an arrow for links that leave the site. Defaults to true for external URLs. */
  showExternalIcon?: boolean;
  'aria-label'?: string;
}

/** Inline link with URL sanitising. Renders plain text when the URL is missing or unsafe. */
export function TextLink({ href, children, className, showExternalIcon, ...rest }: TextLinkProps) {
  const safe = safeUrl(href);
  if (!safe) return <span className={className}>{children}</span>;
  const external = isExternalUrl(safe);
  const showIcon = showExternalIcon ?? external;
  return (
    <a
      href={safe}
      className={cn(
        'inline-flex items-center gap-1 underline-offset-4 transition-colors hover:text-accent hover:underline',
        className,
      )}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
      {showIcon && <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
