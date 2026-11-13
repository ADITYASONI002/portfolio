import { ArrowUp } from 'lucide-react';
import { SocialLinks } from '../components/SocialLinks';
import { Container } from '../components/ui/Container';
import type { SocialLink } from '../types/content';
import type { NavLink } from './types';

interface FooterProps {
  name: string;
  tagline?: string;
  links: readonly NavLink[];
  socialLinks: readonly SocialLink[];
  year?: number;
}

export function Footer({ name, tagline, links, socialLinks, year = new Date().getFullYear() }: FooterProps) {
  return (
    <footer className="border-t border-border bg-surface-muted/40">
      <Container className="py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-base font-semibold tracking-tight text-fg">{name}</p>
            {tagline && <p className="mt-2 text-sm text-fg-muted">{tagline}</p>}
            <SocialLinks links={socialLinks} variant="ghost" className="mt-4 -ml-2.5" />
          </div>
          {links.length > 0 && (
            <nav aria-label="Footer">
              <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5 sm:grid-cols-3">
                {links.map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`} className="text-sm text-fg-muted transition-colors hover:text-fg">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-fg-subtle">
            © {year} {name}. All rights reserved.
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 self-start text-sm text-fg-muted transition-colors hover:text-fg sm:self-auto"
          >
            Back to top
            <ArrowUp aria-hidden="true" className="size-4" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
