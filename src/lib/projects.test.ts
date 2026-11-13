import { describe, expect, it } from 'vitest';
import type { Project } from '../types/content';
import { ALL_CATEGORIES, filterProjects, getProjectCategories, getProjectLinks, partitionFeatured } from './projects';

const projects: Project[] = [
  { id: 'a', title: 'A', summary: '', categories: ['Backend', 'FinTech'], featured: true },
  { id: 'b', title: 'B', summary: '', categories: ['APIs', 'Backend '] },
  { id: 'c', title: 'C', summary: '' },
];

describe('project helpers', () => {
  it('lists unique, trimmed categories in first-seen order', () => {
    expect(getProjectCategories(projects)).toEqual(['Backend', 'FinTech', 'APIs']);
  });

  it('filters by category and returns everything for All', () => {
    expect(filterProjects(projects, ALL_CATEGORIES).map((p) => p.id)).toEqual(['a', 'b', 'c']);
    expect(filterProjects(projects, 'Backend').map((p) => p.id)).toEqual(['a', 'b']);
    expect(filterProjects(projects, 'Nope')).toEqual([]);
  });

  it('splits featured from other projects preserving order', () => {
    const { featured, others } = partitionFeatured(projects);
    expect(featured.map((p) => p.id)).toEqual(['a']);
    expect(others.map((p) => p.id)).toEqual(['b', 'c']);
  });

  it('returns only safe, non-empty links', () => {
    const links = getProjectLinks({
      id: 'x',
      title: 'X',
      summary: '',
      links: { github: 'https://github.com/x/y', live: 'javascript:alert(1)', caseStudy: '' },
    });
    expect(links).toEqual([{ kind: 'github', label: 'Code', href: 'https://github.com/x/y' }]);
  });
});
