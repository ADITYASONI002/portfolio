import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { content, type PortfolioContent } from './content';

function renderApp(overrides: Partial<PortfolioContent> = {}) {
  return render(<App content={{ ...content, ...overrides }} />);
}

describe('App', () => {
  it('renders the hero and every section from JSON', () => {
    renderApp();
    expect(screen.getByRole('heading', { level: 1, name: content.profile.name })).toBeInTheDocument();
    expect(screen.getByText(content.profile.headline)).toBeInTheDocument();
    for (const id of ['about', 'experience', 'skills', 'projects', 'achievements', 'education', 'contact']) {
      expect(document.getElementById(id), `section #${id}`).not.toBeNull();
    }
    for (const project of content.projects) {
      expect(screen.getByRole('heading', { level: 3, name: project.title })).toBeInTheDocument();
    }
    for (const job of content.experience) {
      expect(screen.getByRole('heading', { level: 3, name: job.role })).toBeInTheDocument();
    }
  });

  it('builds the primary navigation from navigation.json, honouring showInNav', () => {
    renderApp();
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent);
    const expected = content.navigation.filter((item) => item.showInNav !== false).map((item) => item.label);
    expect(labels).toEqual(expected);
  });

  it('hides empty sections and their navigation links', () => {
    renderApp({ projects: [], achievements: [], education: [], certifications: [] });
    expect(document.getElementById('projects')).toBeNull();
    expect(document.getElementById('achievements')).toBeNull();
    expect(document.getElementById('education')).toBeNull();
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).queryByRole('link', { name: 'Projects' })).toBeNull();
    // The hero CTA to a missing section is not rendered either.
    expect(screen.queryByRole('link', { name: /view projects/i })).toBeNull();
    expect(screen.queryByText(/selected impact/i)).toBeNull();
  });

  it('renders sections in navigation.json order', () => {
    const navigation = [
      { id: 'home', label: 'Home' },
      { id: 'contact', label: 'Contact' },
      { id: 'about', label: 'About' },
    ];
    renderApp({ navigation });
    const ids = [...document.querySelectorAll('main > section')].map((section) => section.id);
    expect(ids).toEqual(['home', 'contact', 'about']);
  });

  it('survives minimal optional data', () => {
    const minimal: PortfolioContent = {
      siteConfig: { siteUrl: '', title: 'T', description: 'D' },
      navigation: content.navigation,
      profile: { name: 'Solo Dev', title: 'Engineer', headline: 'Builds things.', summary: 'Summary.' },
      experience: [{ id: 'x', company: 'Acme', role: 'Engineer', startDate: '2024-01' }],
      projects: [{ id: 'p', title: 'Thing', summary: 'A thing.' }],
      skills: [{ id: 's', name: 'Backend', skills: ['Node.js'] }],
      education: [],
      certifications: [],
      achievements: [],
      socialLinks: [],
    };
    render(<App content={minimal} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Solo Dev' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Thing' })).toBeInTheDocument();
    expect(document.getElementById('about')).toBeNull();
    expect(document.getElementById('contact')).toBeNull();
    expect(screen.queryByRole('link', { name: /resume/i })).toBeNull();
  });

  it('toggles and persists the theme', async () => {
    const user = userEvent.setup();
    renderApp();
    const toggle = screen.getByRole('button', { name: /switch to dark theme/i });
    await user.click(toggle);
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');
    await user.click(screen.getByRole('button', { name: /switch to light theme/i }));
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('links the resume download to the configured file', () => {
    renderApp();
    const links = screen.getAllByRole('link', { name: /resume/i });
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toHaveAttribute('href', content.siteConfig.resume?.path);
      expect(link).toHaveAttribute('download', content.siteConfig.resume?.downloadName);
    }
  });

  it('opens the mobile menu and closes it after choosing a link', async () => {
    const user = userEvent.setup();
    renderApp();
    const button = screen.getByRole('button', { name: 'Open menu' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile' });
    await user.click(within(mobileNav).getByRole('link', { name: 'Skills' }));
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders external social links safely', () => {
    renderApp();
    const github = screen.getAllByRole('link', { name: /github/i })[0];
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
