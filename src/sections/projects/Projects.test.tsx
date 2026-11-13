import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LazyMotion, domAnimation } from 'motion/react';
import { describe, expect, it } from 'vitest';
import type { Project } from '../../types/content';
import { Projects } from './Projects';

const projects: Project[] = [
  {
    id: 'engine',
    title: 'Settlement Engine',
    summary: 'Pays merchants.',
    categories: ['Backend', 'FinTech'],
    featured: true,
    problem: 'Slow batch.',
    solution: 'Partitioned workers.',
    architecture: { components: [{ name: 'Scheduler' }, { name: 'Kafka' }, { name: 'Workers' }] },
    results: [{ value: '65%', label: 'faster' }],
    confidential: true,
  },
  {
    id: 'cli',
    title: 'Dev CLI',
    summary: 'A tool.',
    categories: ['Open Source'],
    links: { github: 'https://github.com/a/b' },
  },
];

function renderProjects() {
  return render(
    <LazyMotion features={domAnimation}>
      <Projects copy={{ title: 'Projects' }} projects={projects} />
    </LazyMotion>,
  );
}

describe('Projects', () => {
  it('renders a card per project and filters by category', async () => {
    const user = userEvent.setup();
    renderProjects();
    expect(screen.getAllByRole('article')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Open Source' }));
    expect(screen.getByRole('button', { name: 'Open Source' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Dev CLI' })).toBeInTheDocument();
    expect(screen.getByText('1 project')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('opens a detail dialog with problem, solution and architecture, synced to the URL', async () => {
    const user = userEvent.setup();
    renderProjects();
    await user.click(screen.getByRole('button', { name: 'View details: Settlement Engine' }));

    const dialog = screen.getByRole('dialog', { name: 'Settlement Engine' });
    expect(within(dialog).getByText('Slow batch.')).toBeInTheDocument();
    expect(within(dialog).getByText('Partitioned workers.')).toBeInTheDocument();
    expect(within(dialog).getByRole('img', { name: /Scheduler → Kafka → Workers/ })).toBeInTheDocument();
    expect(within(dialog).getByText(/source not public/i)).toBeInTheDocument();
    expect(window.location.search).toBe('?project=engine');

    await user.click(within(dialog).getByRole('button', { name: 'Close project details' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens the dialog from a deep link and ignores unknown ids', () => {
    window.history.replaceState(null, '', '/?project=cli');
    const { unmount } = renderProjects();
    expect(screen.getByRole('dialog', { name: 'Dev CLI' })).toBeInTheDocument();
    unmount();

    window.history.replaceState(null, '', '/?project=does-not-exist');
    renderProjects();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('hides filters when there is only one category', () => {
    render(
      <LazyMotion features={domAnimation}>
        <Projects copy={{ title: 'Projects' }} projects={[{ id: 'x', title: 'X', summary: 'x', categories: ['Backend'] }]} />
      </LazyMotion>,
    );
    expect(screen.queryByRole('group', { name: /filter projects/i })).toBeNull();
  });
});
