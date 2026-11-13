import { LazyMotion, MotionConfig } from 'motion/react';
import { Fragment, useMemo } from 'react';
import { content as defaultContent, type PortfolioContent } from './content';
import { getInitials, getResume, getSocialLinks } from './content/selectors';
import { useActiveSection } from './hooks/useActiveSection';
import { BackToTop } from './layouts/BackToTop';
import { Footer } from './layouts/Footer';
import { Header } from './layouts/Header';
import { ThemeProvider } from './providers/ThemeProvider';
import { resolveSections } from './sections/registry';

const loadMotionFeatures = () => import('./lib/motion-features').then((module) => module.default);

interface AppProps {
  /** Injected in tests; defaults to the JSON in src/data. */
  content?: PortfolioContent;
}

export default function App({ content = defaultContent }: AppProps) {
  const { siteConfig, profile } = content;
  const sections = useMemo(() => resolveSections(content), [content]);
  const navLinks = useMemo(
    () => sections.filter((s) => s.showInNav).map(({ id, label }) => ({ id, label })),
    [sections],
  );
  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);
  const activeId = useActiveSection(sectionIds);
  const resume = getResume(siteConfig);
  const socialLinks = getSocialLinks(content.socialLinks);

  return (
    <ThemeProvider defaultTheme={siteConfig.defaultTheme} themeColors={siteConfig.themeColor}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadMotionFeatures} strict>
          <a
            href="#main"
            className="sr-only z-50 rounded-md bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <Header
            name={profile.name}
            initials={getInitials(profile)}
            links={navLinks}
            activeId={activeId}
            resume={resume}
          />
          <main id="main" tabIndex={-1} className="outline-none">
            {sections.map((section) => (
              <Fragment key={section.id}>{section.render()}</Fragment>
            ))}
          </main>
          <Footer
            name={profile.name}
            tagline={siteConfig.footer?.tagline}
            links={navLinks}
            socialLinks={socialLinks}
          />
          <BackToTop />
        </LazyMotion>
      </MotionConfig>
    </ThemeProvider>
  );
}
