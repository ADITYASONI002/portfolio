import { describe, expect, it } from 'vitest';
import type { Profile, SiteConfig } from '../types/content';
import {
  getExperienceLabel,
  getInitials,
  getResume,
  getSectionCopy,
  getSocialLinks,
  normalizeSkills,
} from './selectors';

const site: SiteConfig = { siteUrl: 'https://x.dev', title: 't', description: 'd' };
const profile: Profile = { name: 'Ada Byron Lovelace', title: 'Engineer', headline: 'h', summary: 's' };

describe('selectors', () => {
  it('derives initials from the name unless provided', () => {
    expect(getInitials(profile)).toBe('AL');
    expect(getInitials({ name: 'Ada', initials: ' ab ' })).toBe('AB');
    expect(getInitials({ name: 'Plato' })).toBe('P');
  });

  it('prefers explicit years, otherwise computes from the career start date', () => {
    const now = new Date(2026, 10, 1);
    expect(getExperienceLabel({ ...profile, experience: { years: 7, careerStartDate: '2021-01' } }, now)).toBe('7+ years');
    expect(getExperienceLabel({ ...profile, experience: { careerStartDate: '2024-03' } }, now)).toBe('2+ years');
    expect(getExperienceLabel({ ...profile, experience: { careerStartDate: '2026-06' } }, now)).toBe('Less than 1 year');
    expect(getExperienceLabel(profile, now)).toBeNull();
  });

  it('falls back to default section copy', () => {
    expect(getSectionCopy(site, 'projects').title).toBe('Featured projects');
    expect(getSectionCopy({ ...site, sections: { projects: { title: 'Work' } } }, 'projects')).toMatchObject({
      eyebrow: 'Projects',
      title: 'Work',
    });
  });

  it('normalises string and object skills, dropping blanks', () => {
    expect(normalizeSkills({ id: 'x', name: 'X', skills: ['Node.js', { name: 'Go', core: true }, ' '] })).toEqual([
      { name: 'Node.js' },
      { name: 'Go', core: true },
    ]);
  });

  it('drops unsafe social links and filters hero links', () => {
    const links = [
      { id: 'gh', platform: 'github', label: 'GitHub', url: 'https://github.com/a', showInHero: true },
      { id: 'bad', platform: 'website', label: 'Bad', url: 'javascript:alert(1)', showInHero: true },
      { id: 'li', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/a' },
    ];
    expect(getSocialLinks(links).map((l) => l.id)).toEqual(['gh', 'li']);
    expect(getSocialLinks(links, { heroOnly: true }).map((l) => l.id)).toEqual(['gh']);
  });

  it('returns resume settings with defaults, or null when unset', () => {
    expect(getResume(site)).toBeNull();
    expect(getResume({ ...site, resume: { path: '/resume/cv.pdf' } })).toEqual({
      path: '/resume/cv.pdf',
      downloadName: 'cv.pdf',
      label: 'Resume',
    });
  });
});
