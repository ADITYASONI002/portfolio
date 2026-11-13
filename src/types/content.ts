/**
 * Type definitions for every JSON file in `src/data`.
 *
 * The JSON files are imported and assigned to these interfaces in
 * `src/content/index.ts`, so `npm run typecheck` fails if a JSON file does not
 * match its schema. Optional fields (`?`) may be omitted or left empty; the UI
 * hides whatever is missing.
 */

/** Calendar month in `YYYY-MM` format, e.g. `"2023-04"`. */
export type YearMonth = string;

export interface ImageAsset {
  /** Path relative to `public/` (e.g. `/images/avatar.webp`) or an absolute URL. */
  src: string;
  /** Describe the image for screen readers. Use `""` only for purely decorative images. */
  alt: string;
  width?: number;
  height?: number;
}

/** A single headline number such as `{ "value": "65%", "label": "faster settlement runs" }`. */
export interface Metric {
  value: string;
  label: string;
  description?: string;
}

/* ------------------------------------------------------------------ */
/* site-config.json                                                    */
/* ------------------------------------------------------------------ */

export interface SectionCopy {
  eyebrow?: string;
  title: string;
  description?: string;
}

export interface ResumeConfig {
  /** Path relative to `public/`, e.g. `/resume/resume.pdf`. Leave empty to hide all resume buttons. */
  path: string;
  /** File name suggested to the browser when downloading. */
  downloadName?: string;
  label?: string;
}

export interface ContactConfig {
  /**
   * Optional HTTPS endpoint that accepts a JSON POST of `{ name, email, subject, message }`
   * (e.g. a Formspree form URL). When empty, the form opens the visitor's email client instead.
   */
  formEndpoint?: string;
  /** Prepended to the email subject so you can filter portfolio enquiries. */
  subjectPrefix?: string;
}

export interface SiteConfig {
  /** Public URL of the deployed site, without a trailing slash. Used for canonical, OG and sitemap. */
  siteUrl: string;
  title: string;
  description: string;
  keywords?: string[];
  /** BCP 47 locale for dates and `<html lang>`, e.g. `en-IN`, `en-US`. */
  locale?: string;
  /** Social share image (1200×630 recommended) placed in `public/`. */
  ogImage?: ImageAsset;
  /** X/Twitter handle including `@`. */
  twitterHandle?: string;
  themeColor?: { light: string; dark: string };
  /** `"light"`, `"dark"` or `"system"`. */
  defaultTheme?: string;
  resume?: ResumeConfig;
  contact?: ContactConfig;
  /** Heading copy for each section keyed by section id (see navigation.json). */
  sections?: Record<string, SectionCopy>;
  footer?: { tagline?: string };
}

/* ------------------------------------------------------------------ */
/* navigation.json                                                     */
/* ------------------------------------------------------------------ */

export interface NavigationItem {
  /** Section id. Must be one of: home, about, experience, skills, projects, achievements, education, contact. */
  id: string;
  label: string;
  /** Set to `false` to render the section without a link in the header. Defaults to `true`. */
  showInNav?: boolean;
}

/* ------------------------------------------------------------------ */
/* profile.json                                                        */
/* ------------------------------------------------------------------ */

export interface ProfileStatus {
  label: string;
  /** Shows a green "available" indicator when `true`. */
  available?: boolean;
}

export interface Principle {
  title: string;
  description: string;
}

export interface AboutContent {
  paragraphs: string[];
  philosophy?: Principle[];
  specializations?: string[];
  interests?: string[];
}

export interface Profile {
  name: string;
  /** Two or three letters for the logo/avatar fallback. Derived from `name` when omitted. */
  initials?: string;
  title: string;
  /** One-sentence value statement shown prominently in the hero. */
  headline: string;
  /** Short description of your engineering expertise. */
  summary: string;
  location?: string;
  email?: string;
  avatar?: ImageAsset;
  status?: ProfileStatus;
  /**
   * `years` is shown verbatim (e.g. 4 → "4+ years"). If omitted, it is
   * calculated from `careerStartDate` (`YYYY-MM`).
   */
  experience?: { years?: number; careerStartDate?: YearMonth };
  /** Areas shown in the hero profile card. */
  focusAreas?: string[];
  /** Technologies shown in the hero profile card. */
  coreStack?: string[];
  about?: AboutContent;
}

/* ------------------------------------------------------------------ */
/* experience.json                                                     */
/* ------------------------------------------------------------------ */

export interface Experience {
  id: string;
  company: string;
  companyUrl?: string;
  companyDescription?: string;
  logo?: ImageAsset;
  role: string;
  /** e.g. Full-time, Contract, Internship. */
  employmentType?: string;
  startDate: YearMonth;
  /** `null` or omitted means "Present". */
  endDate?: YearMonth | null;
  location?: string;
  summary?: string;
  /** Rendered first and most prominently. */
  achievements?: string[];
  /** Rendered in a collapsible list below achievements. */
  responsibilities?: string[];
  impact?: Metric[];
  technologies?: string[];
}

/* ------------------------------------------------------------------ */
/* projects.json                                                       */
/* ------------------------------------------------------------------ */

export interface ArchitectureComponent {
  name: string;
  description?: string;
}

export interface ProjectLinks {
  github?: string;
  live?: string;
  caseStudy?: string;
}

export interface Project {
  /** URL-safe unique id; used for deep links (`?project=<id>`). */
  id: string;
  title: string;
  summary: string;
  /** Used by the category filters. A project may belong to several. */
  categories?: string[];
  /** Featured projects get the large layout. */
  featured?: boolean;
  year?: string;
  role?: string;
  /** e.g. "Built at Company" or "Personal project". */
  context?: string;
  /** Marks proprietary work whose source cannot be shared. */
  confidential?: boolean;
  image?: ImageAsset;
  problem?: string;
  solution?: string;
  architecture?: {
    overview?: string;
    /** Listed in request/data-flow order; the first 5 are drawn as a diagram when there is no image. */
    components?: ArchitectureComponent[];
  };
  contributions?: string[];
  technologies?: string[];
  results?: Metric[];
  links?: ProjectLinks;
}

/* ------------------------------------------------------------------ */
/* skills.json                                                         */
/* ------------------------------------------------------------------ */

export interface Skill {
  name: string;
  /** Highlights a skill you use daily / would be interviewed on. */
  core?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  /** Icon name from the registry in `src/lib/icons.ts`. */
  icon?: string;
  description?: string;
  /** Either plain names or `{ "name": "...", "core": true }`. */
  skills: Array<string | Skill>;
}

/* ------------------------------------------------------------------ */
/* education.json / certifications.json                                */
/* ------------------------------------------------------------------ */

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate?: YearMonth;
  endDate?: YearMonth | null;
  location?: string;
  grade?: string;
  highlights?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: YearMonth;
  expiryDate?: YearMonth | null;
  credentialId?: string;
  url?: string;
}

/* ------------------------------------------------------------------ */
/* achievements.json                                                   */
/* ------------------------------------------------------------------ */

export interface Achievement {
  id: string;
  /** The headline number, e.g. "65%" or "3×". */
  value: string;
  label: string;
  description?: string;
  /** Where it happened, e.g. a company or project name. */
  context?: string;
  /** Icon name from the registry in `src/lib/icons.ts`. */
  icon?: string;
  /** Also show this metric in the hero "impact" strip. */
  highlight?: boolean;
}

/* ------------------------------------------------------------------ */
/* social-links.json                                                   */
/* ------------------------------------------------------------------ */

export interface SocialLink {
  id: string;
  /** github, linkedin, x, email, website, stackoverflow, medium, devto, leetcode, … */
  platform: string;
  label: string;
  url: string;
  handle?: string;
  /** Show this link as an icon button in the hero. */
  showInHero?: boolean;
}
