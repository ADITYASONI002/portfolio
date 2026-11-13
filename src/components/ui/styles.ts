import { cn } from '../../lib/cn';

/* Shared class builders so links, buttons and cards look identical wherever they are used. */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'icon';

const BUTTON_BASE =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 select-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-px';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-fg text-bg shadow-sm hover:bg-fg/85',
  secondary: 'border border-border-strong bg-surface text-fg hover:border-fg-subtle hover:bg-surface-muted',
  ghost: 'text-fg-muted hover:bg-surface-muted hover:text-fg',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm sm:text-[0.9375rem]',
  icon: 'size-10',
};

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className);
}

export function cardClasses(interactive = false, className?: string) {
  return cn(
    'rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-card)]',
    interactive &&
      'transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-lift)]',
    className,
  );
}
