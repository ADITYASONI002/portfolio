import { ExternalLink, FileText, Lock } from 'lucide-react';
import { ButtonLink } from '../../components/ui/Button';
import { resolveSocialIcon, type IconComponent } from '../../lib/icons';
import { getProjectLinks, type ProjectLinkItem } from '../../lib/projects';
import { isExternalUrl } from '../../lib/url';
import type { Project } from '../../types/content';

const LINK_ICONS: Record<ProjectLinkItem['kind'], IconComponent> = {
  live: ExternalLink,
  github: resolveSocialIcon('github'),
  caseStudy: FileText,
};

interface ProjectLinksProps {
  project: Project;
  size?: 'sm' | 'md';
}

export function ProjectLinks({ project, size = 'sm' }: ProjectLinksProps) {
  const links = getProjectLinks(project);

  if (links.length === 0) {
    return project.confidential ? (
      <p className="inline-flex items-center gap-1.5 text-sm text-fg-subtle">
        <Lock aria-hidden="true" className="size-3.5" />
        Proprietary — source not public
      </p>
    ) : null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.map((link) => {
        const Icon = LINK_ICONS[link.kind];
        const newTab = isExternalUrl(link.href) ? ' (opens in a new tab)' : '';
        return (
          <ButtonLink
            key={link.kind}
            href={link.href}
            variant="secondary"
            size={size}
            aria-label={`${link.label} for ${project.title}${newTab}`}
          >
            <Icon size={16} />
            {link.label}
          </ButtonLink>
        );
      })}
    </div>
  );
}
