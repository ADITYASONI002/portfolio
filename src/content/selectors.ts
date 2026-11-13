/**
 * Pure helpers that derive display values from content, with fallbacks for
 * missing or partially filled JSON. Kept free of React so they are easy to test.
 */
import { yearsSince } from '../lib/date';
import { safeUrl } from '../lib/url';
import type {
  Profile,
  ResumeConfig,
  SectionCopy,
  SiteConfig,
  Skill,
  SkillCategory,
  SocialLink,
} from '../types/content';

const DEFAULT_SECTION_COPY: Record<string, SectionCopy> = {
  about: { eyebrow: 'About', title: 'About me' },
  experience: { eyebrow: 'Experience', title: 'Professional experience' },
  skills: { eyebrow: 'Skills', title: 'Technical skills' },
  projects: { eyebrow: 'Projects', title: 'Featured projects' },
  achievements: { eyebrow: 'Impact', title: 'Achievements & impact' },
  education: { eyebrow: 'Education', title: 'Education & certifications' },
  contact: { eyebrow: 'Contact', title: 'Get in touch' },
};

export function getSectionCopy(siteConfig: SiteConfig, id: string): SectionCopy {
  const configured = siteConfig.sections?.[id];
  const fallback = DEFAULT_SECTION_COPY[id] ?? { title: id };
  return configured?.title ? { ...fallback, ...configured } : fallback;
}

export function getInitials(profile: Pick<Profile, 'name' | 'initials'>): string {
  if (profile.initials?.trim()) return profile.initials.trim().slice(0, 3).toUpperCase();
  const letters = profile.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]);
  if (letters.length === 0) return '·';
  const first = letters[0];
  const last = letters.length > 1 ? letters[letters.length - 1] : '';
  return `${first}${last}`.toUpperCase();
}

/** "5+ years", from an explicit number or computed from the career start date. */
export function getExperienceLabel(profile: Profile, now: Date = new Date()): string | null {
  const explicit = profile.experience?.years;
  const years =
    typeof explicit === 'number' && explicit > 0 ? explicit : yearsSince(profile.experience?.careerStartDate, now);
  if (years === null || years === undefined) return null;
  if (years < 1) return 'Less than 1 year';
  return `${years}+ year${years === 1 ? '' : 's'}`;
}

export function normalizeSkills(category: SkillCategory): Skill[] {
  return category.skills
    .map((skill) => (typeof skill === 'string' ? { name: skill } : skill))
    .filter((skill) => skill.name.trim().length > 0);
}

/** Social links with a valid, safe URL, in JSON order. */
export function getSocialLinks(links: readonly SocialLink[], options: { heroOnly?: boolean } = {}): SocialLink[] {
  return links
    .filter((link) => !options.heroOnly || link.showInHero)
    .flatMap((link) => {
      const url = safeUrl(link.url);
      return url ? [{ ...link, url }] : [];
    });
}

export function getResume(siteConfig: SiteConfig): Required<ResumeConfig> | null {
  const path = safeUrl(siteConfig.resume?.path);
  if (!path) return null;
  return {
    path,
    downloadName: siteConfig.resume?.downloadName?.trim() || path.split('/').pop() || 'resume.pdf',
    label: siteConfig.resume?.label?.trim() || 'Resume',
  };
}

export function hasItems<T>(items: readonly T[] | undefined | null): items is readonly T[] {
  return Array.isArray(items) && items.length > 0;
}
