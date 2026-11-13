import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { isExternalUrl, safeUrl } from '../../lib/url';
import { buttonClasses, type ButtonSize, type ButtonVariant } from './styles';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

/**
 * Anchor styled as a button. Unsafe URLs render nothing; external URLs open in a new tab
 * with `noopener noreferrer`.
 */
export function ButtonLink({
  variant,
  size,
  className,
  href,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string | undefined }) {
  const safe = safeUrl(href);
  if (!safe) return null;
  const external = isExternalUrl(safe);
  return (
    <a
      href={safe}
      className={buttonClasses(variant, size, className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
}
