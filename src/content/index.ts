/**
 * The only module that imports `src/data/*.json`.
 *
 * Each JSON file is assigned to its interface, so `tsc` reports any schema
 * mismatch at build time. Components read content from here, never from JSON.
 */
import type {
  Achievement,
  Certification,
  Education,
  Experience,
  NavigationItem,
  Profile,
  Project,
  SiteConfig,
  SkillCategory,
  SocialLink,
} from '../types/content';

import achievementsJson from '../data/achievements.json';
import certificationsJson from '../data/certifications.json';
import educationJson from '../data/education.json';
import experienceJson from '../data/experience.json';
import navigationJson from '../data/navigation.json';
import profileJson from '../data/profile.json';
import projectsJson from '../data/projects.json';
import siteConfigJson from '../data/site-config.json';
import skillsJson from '../data/skills.json';
import socialLinksJson from '../data/social-links.json';

export interface PortfolioContent {
  siteConfig: SiteConfig;
  navigation: NavigationItem[];
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  socialLinks: SocialLink[];
}

export const content: PortfolioContent = {
  siteConfig: siteConfigJson,
  navigation: navigationJson,
  profile: profileJson,
  experience: experienceJson,
  projects: projectsJson,
  skills: skillsJson,
  education: educationJson,
  certifications: certificationsJson,
  achievements: achievementsJson,
  socialLinks: socialLinksJson,
};
