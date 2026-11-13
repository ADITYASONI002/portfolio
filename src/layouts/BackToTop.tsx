import { ArrowUp } from 'lucide-react';
import { buttonClasses } from '../components/ui/styles';
import { useScrolled } from '../hooks/useScrolled';
import { cn } from '../lib/cn';

export function BackToTop() {
  const visible = useScrolled(700);

  const scrollToTop = () => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    // Return keyboard focus to the start of the page.
    document.getElementById('main')?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        buttonClasses('secondary', 'icon'),
        'fixed right-4 bottom-4 z-30 rounded-full shadow-[var(--shadow-lift)] transition-[opacity,transform] duration-300 sm:right-6 sm:bottom-6',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <ArrowUp className="size-[18px]" />
    </button>
  );
}
