import { Download, Menu, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Monogram } from '../components/Monogram';
import { ThemeToggle } from '../components/ThemeToggle';
import { ButtonLink } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { buttonClasses } from '../components/ui/styles';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { useScrolled } from '../hooks/useScrolled';
import { cn } from '../lib/cn';
import type { NavLink, ResumeLink } from './types';

interface HeaderProps {
  name: string;
  initials: string;
  links: readonly NavLink[];
  activeId: string | null;
  resume: ResumeLink | null;
}

export function Header({ name, initials, links, activeId, resume }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(8);
  const menuId = useId();
  useLockBodyScroll(menuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const desktop = window.matchMedia?.('(min-width: 64rem)');
    const onResize = () => {
      if (desktop?.matches) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    desktop?.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      desktop?.removeEventListener('change', onResize);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const elevated = scrolled || menuOpen;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-300',
        elevated ? 'border-border bg-bg/85 backdrop-blur-md' : 'border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <a
          href="#home"
          onClick={closeMenu}
          className="flex min-w-0 items-center gap-2.5 rounded-md text-fg"
          aria-label={`${name} — back to top`}
        >
          <Monogram initials={initials} className="size-8 rounded-lg text-[0.6875rem]" />
          <span className="truncate text-[0.9375rem] font-semibold tracking-tight">{name}</span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {links.map((link) => {
              const active = link.id === activeId;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active ? 'location' : undefined}
                    className={cn(
                      'relative rounded-md px-3 py-2 text-sm transition-colors',
                      active ? 'text-fg' : 'text-fg-muted hover:text-fg',
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-3 -bottom-px h-px bg-accent transition-opacity duration-300',
                        active ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {resume && (
            <ButtonLink
              href={resume.path}
              download={resume.downloadName}
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Download aria-hidden="true" className="size-4" />
              {resume.label}
            </ButtonLink>
          )}
          <button
            type="button"
            className={buttonClasses('ghost', 'icon', 'lg:hidden')}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      <div
        id={menuId}
        hidden={!menuOpen}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-bg lg:hidden"
      >
        <Container className="py-6">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={closeMenu}
                    aria-current={link.id === activeId ? 'location' : undefined}
                    className={cn(
                      'flex items-center justify-between border-b border-border py-4 text-lg',
                      link.id === activeId ? 'text-fg' : 'text-fg-muted',
                    )}
                  >
                    {link.label}
                    {link.id === activeId && <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {resume && (
            <ButtonLink href={resume.path} download={resume.downloadName} className="mt-8 w-full" onClick={closeMenu}>
              <Download aria-hidden="true" className="size-4" />
              Download {resume.label.toLowerCase()}
            </ButtonLink>
          )}
        </Container>
      </div>
    </header>
  );
}
