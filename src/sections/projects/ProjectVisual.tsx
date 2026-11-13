import { cn } from '../../lib/cn';
import { safeUrl } from '../../lib/url';
import type { Project } from '../../types/content';
import { ArchitectureFlow } from './ArchitectureFlow';

interface ProjectVisualProps {
  project: Project;
  className?: string;
}

/**
 * Project image when provided; otherwise an architecture flow generated from the project's
 * own `architecture.components`, or a typographic fallback. Never stock art.
 */
export function ProjectVisual({ project, className }: ProjectVisualProps) {
  const src = safeUrl(project.image?.src);
  const frame = cn(
    'relative overflow-hidden border-b border-border bg-surface-muted',
    className,
  );

  if (src) {
    return (
      <div className={frame}>
        <img
          src={src}
          alt={project.image?.alt ?? ''}
          width={project.image?.width ?? 1200}
          height={project.image?.height ?? 675}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  const components = project.architecture?.components ?? [];
  return (
    <div className={cn(frame, 'grid place-items-center')}>
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-80" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--surface-muted)_85%)]"
      />
      {components.length > 0 ? (
        <ArchitectureFlow components={components} className="relative px-5 py-8" />
      ) : (
        <span aria-hidden="true" className="relative font-mono text-sm tracking-wide text-fg-subtle">
          {project.categories?.[0] ?? project.title}
        </span>
      )}
    </div>
  );
}
