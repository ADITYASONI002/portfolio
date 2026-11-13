import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface TagProps {
  children: ReactNode;
  /** Emphasised style, e.g. for core skills. */
  emphasis?: boolean;
  className?: string;
}

export function Tag({ children, emphasis = false, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[0.75rem] leading-none whitespace-nowrap',
        emphasis
          ? 'border-accent/35 bg-accent-soft text-fg'
          : 'border-border bg-surface-muted/60 text-fg-muted',
        className,
      )}
    >
      {emphasis && <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />}
      {children}
    </span>
  );
}

interface TagListProps {
  items: readonly string[] | undefined;
  /** Show at most this many tags followed by "+N". */
  limit?: number;
  label?: string;
  className?: string;
}

export function TagList({ items, limit, label = 'Technologies', className }: TagListProps) {
  if (!items?.length) return null;
  const visible = limit ? items.slice(0, limit) : items;
  const hidden = items.length - visible.length;
  return (
    <ul aria-label={label} className={cn('flex flex-wrap gap-1.5', className)}>
      {visible.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Tag className="text-fg-subtle">
            +{hidden}
            <span className="sr-only"> more</span>
          </Tag>
        </li>
      )}
    </ul>
  );
}
