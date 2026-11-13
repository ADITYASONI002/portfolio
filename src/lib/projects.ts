import type { Project } from '../types/content';
import { safeUrl } from './url';

export const ALL_CATEGORIES = 'All';

export interface ProjectLinkItem {
  kind: 'live' | 'github' | 'caseStudy';
  label: string;
  href: string;
}

const LINK_LABELS: Record<ProjectLinkItem['kind'], string> = {
  live: 'Live demo',
  github: 'Code',
  caseStudy: 'Case study',
};

/** Safe, non-empty project links in display order. */
export function getProjectLinks(project: Project): ProjectLinkItem[] {
  const links = project.links ?? {};
  return (['live', 'github', 'caseStudy'] as const).flatMap((kind) => {
    const href = safeUrl(links[kind]);
    return href ? [{ kind, label: LINK_LABELS[kind], href }] : [];
  });
}

/** Unique categories in first-seen order, so JSON order controls filter order. */
export function getProjectCategories(projects: readonly Project[]): string[] {
  const seen = new Set<string>();
  for (const project of projects) {
    for (const category of project.categories ?? []) {
      const trimmed = category.trim();
      if (trimmed) seen.add(trimmed);
    }
  }
  return [...seen];
}

export function filterProjects(projects: readonly Project[], category: string): Project[] {
  if (category === ALL_CATEGORIES) return [...projects];
  return projects.filter((project) => project.categories?.some((c) => c.trim() === category));
}

/** Splits into the large "featured" layout and the standard grid, preserving JSON order. */
export function partitionFeatured(projects: readonly Project[]): { featured: Project[]; others: Project[] } {
  return {
    featured: projects.filter((p) => p.featured),
    others: projects.filter((p) => !p.featured),
  };
}
