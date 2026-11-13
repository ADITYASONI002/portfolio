import type { ReactNode } from 'react';
import type { PortfolioContent } from '../content';
import { getExperienceLabel, getInitials, getResume, getSectionCopy, getSocialLinks, hasItems } from '../content/selectors';
import { About } from './About';
import { Achievements } from './Achievements';
import { Contact } from './contact/Contact';
import { Education } from './Education';
import { Experience } from './Experience';
import { Hero } from './Hero';
import { Projects } from './projects/Projects';
import { Skills } from './Skills';

interface SectionDefinition {
  /** Decides whether the section (and its nav link) is rendered. */
  hasContent: (content: PortfolioContent) => boolean;
  render: (content: PortfolioContent) => ReactNode;
}

/**
 * Every section the page can render, keyed by the id used in navigation.json.
 * To add a section: create the component, register it here, and add its id to navigation.json.
 */
const SECTIONS: Record<string, SectionDefinition> = {
  home: {
    hasContent: (c) => Boolean(c.profile.name),
    render: (c) => (
      <Hero
        profile={c.profile}
        initials={getInitials(c.profile)}
        experienceLabel={getExperienceLabel(c.profile)}
        socialLinks={getSocialLinks(c.socialLinks, { heroOnly: true })}
        highlights={c.achievements.filter((a) => a.highlight).slice(0, 4)}
        resume={getResume(c.siteConfig)}
        hasProjects={SECTIONS.projects.hasContent(c) && c.navigation.some((item) => item.id === 'projects')}
      />
    ),
  },
  about: {
    hasContent: (c) => hasItems(c.profile.about?.paragraphs),
    render: (c) => (
      <About
        copy={getSectionCopy(c.siteConfig, 'about')}
        about={c.profile.about ?? { paragraphs: [] }}
        experienceLabel={getExperienceLabel(c.profile)}
      />
    ),
  },
  experience: {
    hasContent: (c) => hasItems(c.experience),
    render: (c) => (
      <Experience copy={getSectionCopy(c.siteConfig, 'experience')} items={c.experience} locale={c.siteConfig.locale} />
    ),
  },
  skills: {
    hasContent: (c) => c.skills.some((category) => hasItems(category.skills)),
    render: (c) => <Skills copy={getSectionCopy(c.siteConfig, 'skills')} categories={c.skills} />,
  },
  projects: {
    hasContent: (c) => hasItems(c.projects),
    render: (c) => <Projects copy={getSectionCopy(c.siteConfig, 'projects')} projects={c.projects} />,
  },
  achievements: {
    hasContent: (c) => hasItems(c.achievements),
    render: (c) => <Achievements copy={getSectionCopy(c.siteConfig, 'achievements')} items={c.achievements} />,
  },
  education: {
    hasContent: (c) => hasItems(c.education) || hasItems(c.certifications),
    render: (c) => (
      <Education
        copy={getSectionCopy(c.siteConfig, 'education')}
        education={c.education}
        certifications={c.certifications}
        locale={c.siteConfig.locale}
      />
    ),
  },
  contact: {
    hasContent: (c) => Boolean(c.profile.email || c.siteConfig.contact?.formEndpoint) || hasItems(c.socialLinks),
    render: (c) => (
      <Contact
        copy={getSectionCopy(c.siteConfig, 'contact')}
        email={c.profile.email}
        location={c.profile.location}
        socialLinks={getSocialLinks(c.socialLinks)}
        config={c.siteConfig.contact}
      />
    ),
  },
};

export interface ResolvedSection {
  id: string;
  label: string;
  showInNav: boolean;
  render: () => ReactNode;
}

/** Sections in navigation.json order, skipping unknown ids and sections without content. */
export function resolveSections(content: PortfolioContent): ResolvedSection[] {
  const seen = new Set<string>();
  return content.navigation.flatMap((item) => {
    const definition = Object.hasOwn(SECTIONS, item.id) ? SECTIONS[item.id] : undefined;
    if (!definition || seen.has(item.id)) {
      if (import.meta.env.DEV) console.warn(`[portfolio] navigation.json: ignoring unknown or duplicate id "${item.id}".`);
      return [];
    }
    seen.add(item.id);
    if (!definition.hasContent(content)) return [];
    return [
      {
        id: item.id,
        label: item.label,
        showInNav: item.showInNav !== false,
        render: () => definition.render(content),
      },
    ];
  });
}
