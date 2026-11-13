/**
 * Data-integrity checks for src/data/*.json. They run with `npm test` and catch the
 * mistakes TypeScript cannot: duplicate ids, malformed dates, unsafe URLs, unknown icons.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseYearMonth } from '../lib/date';
import { resolveIcon } from '../lib/icons';
import { safeUrl } from '../lib/url';
import { content } from './index';

const PUBLIC_DIR = resolve(process.cwd(), 'public');
const KNOWN_SECTIONS = ['home', 'about', 'experience', 'skills', 'projects', 'achievements', 'education', 'contact'];

function expectUniqueIds(items: Array<{ id: string }>, file: string) {
  const ids = items.map((item) => item.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  expect(duplicates, `${file}: duplicate ids`).toEqual([]);
}

function expectValidMonth(value: string | null | undefined, label: string) {
  if (value === null || value === undefined) return;
  expect(parseYearMonth(value), `${label} must be YYYY-MM, got "${value}"`).not.toBeNull();
}

function expectSafeUrl(value: string | undefined, label: string) {
  if (!value) return;
  expect(safeUrl(value), `${label} is not an allowed URL: "${value}"`).toBeDefined();
}

describe('portfolio content', () => {
  it('has unique ids in every collection', () => {
    expectUniqueIds(content.experience, 'experience.json');
    expectUniqueIds(content.projects, 'projects.json');
    expectUniqueIds(content.skills, 'skills.json');
    expectUniqueIds(content.education, 'education.json');
    expectUniqueIds(content.certifications, 'certifications.json');
    expectUniqueIds(content.achievements, 'achievements.json');
    expectUniqueIds(content.socialLinks, 'social-links.json');
  });

  it('only references known sections in navigation.json', () => {
    for (const item of content.navigation) expect(KNOWN_SECTIONS, `navigation.json id "${item.id}"`).toContain(item.id);
  });

  it('uses URL-safe project ids (used in ?project= deep links)', () => {
    for (const project of content.projects) expect(project.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it('uses YYYY-MM dates with start before end', () => {
    for (const item of content.experience) {
      expectValidMonth(item.startDate, `experience "${item.id}" startDate`);
      expectValidMonth(item.endDate, `experience "${item.id}" endDate`);
      if (item.endDate) expect(item.endDate >= item.startDate, `experience "${item.id}" ends before it starts`).toBe(true);
    }
    for (const item of content.education) {
      expectValidMonth(item.startDate, `education "${item.id}" startDate`);
      expectValidMonth(item.endDate, `education "${item.id}" endDate`);
    }
    for (const item of content.certifications) {
      expectValidMonth(item.issueDate, `certification "${item.id}" issueDate`);
      expectValidMonth(item.expiryDate, `certification "${item.id}" expiryDate`);
    }
    expectValidMonth(content.profile.experience?.careerStartDate, 'profile careerStartDate');
  });

  it('uses only safe URLs', () => {
    content.socialLinks.forEach((link) => expectSafeUrl(link.url, `social link "${link.id}"`));
    content.projects.forEach((p) => {
      expectSafeUrl(p.links?.github, `project "${p.id}" github`);
      expectSafeUrl(p.links?.live, `project "${p.id}" live`);
      expectSafeUrl(p.links?.caseStudy, `project "${p.id}" caseStudy`);
      expectSafeUrl(p.image?.src, `project "${p.id}" image`);
    });
    content.experience.forEach((e) => expectSafeUrl(e.companyUrl, `experience "${e.id}" companyUrl`));
    content.certifications.forEach((c) => expectSafeUrl(c.url, `certification "${c.id}" url`));
  });

  it('only uses icon names from the registry', () => {
    const fallback = resolveIcon(undefined);
    for (const item of [...content.skills, ...content.achievements]) {
      if (item.icon) expect(resolveIcon(item.icon), `unknown icon "${item.icon}"`).not.toBe(fallback);
    }
  });

  it('references local files that exist in public/', () => {
    const localPaths = [
      content.siteConfig.resume?.path,
      content.siteConfig.ogImage?.src,
      content.profile.avatar?.src,
      ...content.projects.map((p) => p.image?.src),
    ].filter((path): path is string => Boolean(path?.startsWith('/')));
    for (const path of localPaths) expect(existsSync(resolve(PUBLIC_DIR, `.${path}`)), `missing public file ${path}`).toBe(true);
  });

  it('gives every image alt text', () => {
    const images = [content.profile.avatar, content.siteConfig.ogImage, ...content.projects.map((p) => p.image)];
    for (const image of images) if (image?.src) expect(image.alt, `alt text for ${image.src}`).toBeTruthy();
  });
});
