import { ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { TagList } from '../../components/ui/Tag';
import { cardClasses } from '../../components/ui/styles';
import { cn } from '../../lib/cn';
import type { Project } from '../../types/content';
import { ProjectLinks } from './ProjectLinks';
import { ProjectVisual } from './ProjectVisual';

interface ProjectCardProps {
  project: Project;
  onOpen: (id: string) => void;
  /** Large horizontal layout on wide screens. */
  featured?: boolean;
  /** Puts the visual on the right in the featured layout (for alternating rows). */
  reverse?: boolean;
}

export function ProjectCard({ project, onOpen, featured = false, reverse = false }: ProjectCardProps) {
  const titleId = `project-${project.id}-title`;
  const results = project.results?.slice(0, featured ? 3 : 2) ?? [];

  return (
    <article
      aria-labelledby={titleId}
      className={cardClasses(
        true,
        cn('group flex h-full flex-col overflow-hidden', featured && 'lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]'),
      )}
    >
      <ProjectVisual
        project={project}
        className={cn(
          'aspect-[16/9]',
          featured && 'lg:aspect-auto lg:min-h-[22rem] lg:border-b-0',
          featured && (reverse ? 'lg:order-last lg:border-l' : 'lg:border-r'),
        )}
      />

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs tracking-wide text-fg-subtle">
          {featured && <span className="text-accent">Featured</span>}
          {project.categories?.length ? <span>{project.categories.join(' / ')}</span> : null}
          {project.year && <span aria-label={`Year ${project.year}`}>· {project.year}</span>}
        </p>

        <h3 id={titleId} className={cn('mt-3 font-semibold text-fg', featured ? 'text-2xl tracking-tight' : 'text-xl')}>
          {project.title}
        </h3>
        {project.context && <p className="mt-1 text-sm text-fg-subtle">{project.context}</p>}
        <p className="mt-3 leading-relaxed text-pretty text-fg-muted">{project.summary}</p>

        {results.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {results.map((metric) => (
              <div key={`${metric.value}-${metric.label}`} className="flex flex-col-reverse border-l-2 border-accent/60 pl-3">
                <dt className="text-xs leading-snug text-fg-muted">{metric.label}</dt>
                <dd className="tabular text-lg font-semibold text-fg">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <TagList items={project.technologies} limit={featured ? 7 : 5} className="mt-5" />

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <Button
            size="sm"
            onClick={() => onOpen(project.id)}
            aria-haspopup="dialog"
            aria-label={`View details: ${project.title}`}
          >
            View details
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}
