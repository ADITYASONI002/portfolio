import { useMemo, useState } from 'react';
import { Reveal } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { useQueryParamState } from '../../hooks/useQueryParamState';
import { ALL_CATEGORIES, filterProjects, getProjectCategories, partitionFeatured } from '../../lib/projects';
import type { Project, SectionCopy } from '../../types/content';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailDialog } from './ProjectDetailDialog';
import { ProjectFilters } from './ProjectFilters';

export const PROJECT_QUERY_PARAM = 'project';

interface ProjectsProps {
  copy: SectionCopy;
  projects: readonly Project[];
}

export function Projects({ copy, projects }: ProjectsProps) {
  const categories = useMemo(() => getProjectCategories(projects), [projects]);
  const projectIds = useMemo(() => projects.map((project) => project.id), [projects]);
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [selectedId, openProject, closeProject] = useQueryParamState(PROJECT_QUERY_PARAM, projectIds);

  const visible = useMemo(() => filterProjects(projects, category), [projects, category]);
  const { featured, others } = partitionFeatured(visible);
  const selected = projects.find((project) => project.id === selectedId) ?? null;
  const showFilters = categories.length > 1;

  return (
    <Section id="projects" copy={copy}>
      {showFilters && (
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ProjectFilters categories={[ALL_CATEGORIES, ...categories]} active={category} onChange={setCategory} />
          <p className="text-sm text-fg-subtle" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
      )}

      {featured.length > 0 && (
        <ul className="space-y-6">
          {featured.map((project, index) => (
            <Reveal as="li" key={project.id}>
              <ProjectCard project={project} onOpen={openProject} featured reverse={index % 2 === 1} />
            </Reveal>
          ))}
        </ul>
      )}

      {others.length > 0 && (
        <ul className={`grid gap-6 md:grid-cols-2 ${featured.length > 0 ? 'mt-6' : ''}`}>
          {others.map((project, index) => (
            <Reveal as="li" key={project.id} delay={(index % 2) * 0.06}>
              <ProjectCard project={project} onOpen={openProject} />
            </Reveal>
          ))}
        </ul>
      )}

      {visible.length === 0 && (
        <p className="rounded-[var(--radius-card)] border border-dashed border-border p-10 text-center text-fg-muted">
          No projects in this category yet.
        </p>
      )}

      <ProjectDetailDialog project={selected} onClose={closeProject} />
    </Section>
  );
}
