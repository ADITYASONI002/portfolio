import { cn } from '../lib/cn';
import { safeUrl } from '../lib/url';
import type { ImageAsset } from '../types/content';

interface MonogramProps {
  initials: string;
  image?: ImageAsset;
  className?: string;
}

/** Avatar image when configured, otherwise an initials mark. */
export function Monogram({ initials, image, className }: MonogramProps) {
  const src = safeUrl(image?.src);
  // Size and corner radius come from `className` so callers control them without class conflicts.
  const base = 'grid shrink-0 place-items-center overflow-hidden border border-border bg-surface-muted';
  if (src) {
    return (
      <img
        src={src}
        alt={image?.alt ?? ''}
        width={image?.width ?? 96}
        height={image?.height ?? 96}
        className={cn(base, 'object-cover', className)}
        decoding="async"
      />
    );
  }
  return (
    <span aria-hidden="true" className={cn(base, 'font-mono font-semibold tracking-tight text-fg', className)}>
      {initials}
    </span>
  );
}
