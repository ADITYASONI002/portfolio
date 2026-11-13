import { useEffect, useRef, type ReactNode } from 'react';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../lib/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Id of the element that names the dialog (usually its heading). */
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

/**
 * Modal built on the native `<dialog>`: the browser provides focus trapping, Escape handling,
 * inert background content and focus restoration on close.
 */
export function Dialog({ open, onClose, labelledBy, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // Clicks on the backdrop target the <dialog> itself; clicks inside hit the content wrapper.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        'dialog-panel m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto overscroll-contain rounded-[var(--radius-card)] border border-border bg-surface p-0 text-fg shadow-[var(--shadow-lift)] sm:max-h-[calc(100dvh-4rem)]',
        className,
      )}
    >
      {open && <div>{children}</div>}
    </dialog>
  );
}
