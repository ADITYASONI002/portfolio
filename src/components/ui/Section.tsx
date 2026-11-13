import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { SectionCopy } from '../../types/content';
import { Container } from './Container';
import { Reveal } from './Reveal';

interface SectionProps {
  id: string;
  copy: SectionCopy;
  children: ReactNode;
  className?: string;
  /** Extra content aligned with the heading on wide screens (e.g. filters). */
  aside?: ReactNode;
}

export function Section({ id, copy, children, className, aside }: SectionProps) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className={cn('py-20 sm:py-24 lg:py-28', className)}>
      <Container>
        <Reveal className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {copy.eyebrow && (
              <p className="mb-3 font-mono text-xs font-medium tracking-[0.14em] text-accent uppercase">
                {copy.eyebrow}
              </p>
            )}
            <h2 id={titleId} className="text-heading font-semibold text-balance text-fg">
              {copy.title}
            </h2>
            {copy.description && (
              <p className="mt-4 text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">{copy.description}</p>
            )}
          </div>
          {aside}
        </Reveal>
        {children}
      </Container>
    </section>
  );
}
