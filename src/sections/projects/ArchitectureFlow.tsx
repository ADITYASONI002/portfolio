import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { cn } from '../../lib/cn';
import type { ArchitectureComponent } from '../../types/content';

export const MAX_FLOW_NODES = 5;

interface ArchitectureFlowProps {
  components: readonly ArchitectureComponent[];
  className?: string;
  size?: 'sm' | 'md';
}

/** Draws `architecture.components` as a left-to-right flow. Purely presentational. */
export function ArchitectureFlow({ components, className, size = 'sm' }: ArchitectureFlowProps) {
  const nodes = components.slice(0, MAX_FLOW_NODES);
  if (nodes.length === 0) return null;
  const label = `Architecture flow: ${nodes.map((node) => node.name).join(' → ')}`;

  return (
    <div role="img" aria-label={label} className={cn('flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2.5', className)}>
      {nodes.map((node, index) => (
        <Fragment key={`${node.name}-${index}`}>
          {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-fg-subtle" />}
          <span
            className={cn(
              'rounded-md border bg-surface font-mono whitespace-nowrap shadow-sm',
              size === 'sm' ? 'px-2 py-1 text-[0.6875rem]' : 'px-3 py-1.5 text-xs',
              index === 0 ? 'border-accent/50 text-accent' : 'border-border-strong text-fg',
            )}
          >
            {node.name}
          </span>
        </Fragment>
      ))}
    </div>
  );
}
