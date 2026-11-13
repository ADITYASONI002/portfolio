import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Dialog } from '../../components/ui/Dialog';
import { TagList } from '../../components/ui/Tag';
import { buttonClasses } from '../../components/ui/styles';
import type { Project } from '../../types/content';
import { ArchitectureFlow } from './ArchitectureFlow';
import { ProjectLinks } from './ProjectLinks';

interface ProjectDetailDialogProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailDialog({ project, onClose }: ProjectDetailDialogProps) {
  const titleId = 'project-dialog-title';
  return (
    <Dialog open={project !== null} onClose={onClose} labelledBy={titleId}>
      {project && <ProjectDetail project={project} titleId={titleId} onClose={onClose} />}
    </Dialog>
  );
}

function ProjectDetail({ project, titleId, onClose }: { project: Project; titleId: string; onClose: () => void }) {
  const meta = [project.year, project.role, project.context].filter(Boolean);
  const components = project.architecture?.components ?? [];

  return (
    <article>
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface/95 px-5 py-5 backdrop-blur-sm sm:px-8 sm:py-6">
        <div className="min-w-0">
          {project.categories?.length ? (
            <p className="font-mono text-xs tracking-wide text-accent">{project.categories.join(' / ')}</p>
          ) : null}
          <h2 id={titleId} className="mt-1.5 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
            {project.title}
          </h2>
          {meta.length > 0 && <p className="mt-1 text-sm text-fg-muted">{meta.join(' · ')}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className={buttonClasses('ghost', 'icon', '-mr-2 shrink-0')}
          autoFocus
        >
          <X className="size-5" />
        </button>
      </header>

      <div className="space-y-9 px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-base leading-relaxed text-pretty text-fg sm:text-lg">{project.summary}</p>

        {project.results && project.results.length > 0 && (
          <dl className="grid gap-3 sm:grid-cols-3">
            {project.results.map((metric) => (
              <div
                key={`${metric.value}-${metric.label}`}
                className="flex flex-col-reverse rounded-lg border border-border bg-surface-muted/60 p-4"
              >
                <dt className="mt-1 text-sm text-fg-muted">
                  {metric.label}
                  {metric.description && <span className="mt-1 block text-xs text-fg-subtle">{metric.description}</span>}
                </dt>
                <dd className="tabular text-2xl font-semibold tracking-tight text-fg">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {(project.problem || project.solution) && (
          <div className="grid gap-6 md:grid-cols-2">
            {project.problem && (
              <Block title="Problem">
                <p className="leading-relaxed text-fg-muted">{project.problem}</p>
              </Block>
            )}
            {project.solution && (
              <Block title="Solution">
                <p className="leading-relaxed text-fg-muted">{project.solution}</p>
              </Block>
            )}
          </div>
        )}

        {(project.architecture?.overview || components.length > 0) && (
          <Block title="Architecture">
            {project.architecture?.overview && (
              <p className="leading-relaxed text-fg-muted">{project.architecture.overview}</p>
            )}
            {components.length > 0 && (
              <>
                <div className="bg-grid mt-5 rounded-lg border border-border bg-surface-muted/50 px-4 py-6">
                  <ArchitectureFlow components={components} size="md" />
                </div>
                <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                  {components.map((component, index) => (
                    <li key={`${component.name}-${index}`} className="flex gap-3 rounded-lg border border-border p-3.5">
                      <span className="font-mono text-xs leading-5 text-accent">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="text-sm font-medium text-fg">{component.name}</p>
                        {component.description && (
                          <p className="mt-0.5 text-sm leading-relaxed text-fg-muted">{component.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </Block>
        )}

        {project.contributions && project.contributions.length > 0 && (
          <Block title="Key contributions">
            <ul className="space-y-2.5">
              {project.contributions.map((item) => (
                <li key={item} className="relative pl-5 leading-relaxed text-fg">
                  <span aria-hidden="true" className="absolute top-[0.6rem] left-0 h-px w-2.5 bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Block>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <Block title="Technologies">
            <TagList items={project.technologies} />
          </Block>
        )}

        <ProjectLinks project={project} size="md" />
      </div>
    </article>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 font-mono text-xs tracking-[0.14em] text-fg-subtle uppercase">{title}</h3>
      {children}
    </section>
  );
}
