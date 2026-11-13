import { ArrowRight, Download, MapPin } from 'lucide-react';
import { Monogram } from '../components/Monogram';
import { SocialLinks } from '../components/SocialLinks';
import { ButtonLink } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Reveal } from '../components/ui/Reveal';
import { Tag } from '../components/ui/Tag';
import type { ResumeLink } from '../layouts/types';
import { cn } from '../lib/cn';
import type { Achievement, Profile, SocialLink } from '../types/content';

interface HeroProps {
  profile: Profile;
  initials: string;
  experienceLabel: string | null;
  socialLinks: readonly SocialLink[];
  highlights: readonly Achievement[];
  resume: ResumeLink | null;
  /** Whether the projects section is rendered (controls the primary CTA). */
  hasProjects: boolean;
}

export function Hero({ profile, initials, experienceLabel, socialLinks, highlights, resume, hasProjects }: HeroProps) {
  return (
    <section id="home" aria-labelledby="home-title" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div aria-hidden="true" className="bg-grid mask-fade-radial absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute -top-48 left-1/2 -z-10 h-[28rem] w-[min(60rem,140vw)] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          {profile.status?.label && <StatusPill label={profile.status.label} available={profile.status.available} />}

          <h1 id="home-title" className="text-display font-semibold text-balance text-fg">
            {profile.name}
          </h1>
          <p className="mt-4 font-mono text-sm font-medium text-accent sm:text-base">{profile.title}</p>
          <p className="mt-6 max-w-xl text-xl leading-snug font-medium text-balance text-fg sm:text-2xl">
            {profile.headline}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">{profile.summary}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {hasProjects && (
              <ButtonLink href="#projects">
                View projects
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            )}
            {resume && (
              <ButtonLink href={resume.path} download={resume.downloadName} variant="secondary">
                <Download aria-hidden="true" className="size-4" />
                Download {resume.label.toLowerCase()}
              </ButtonLink>
            )}
            <SocialLinks links={socialLinks} variant="ghost" />
          </div>
        </div>

        <Reveal delay={0.1}>
          <ProfileCard profile={profile} initials={initials} experienceLabel={experienceLabel} />
        </Reveal>
      </Container>

      {highlights.length > 0 && (
        <Container className="mt-16 sm:mt-20">
          <Reveal delay={0.15}>
            <h2 className="mb-4 font-mono text-xs font-medium tracking-[0.14em] text-fg-subtle uppercase">
              Selected impact
            </h2>
            <dl
              className={cn(
                'grid divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface/70 backdrop-blur-sm sm:divide-x sm:divide-y-0',
                highlights.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
                highlights.length >= 4 && 'lg:grid-cols-4',
              )}
            >
              {highlights.map((item) => (
                <div key={item.id} className="flex flex-col-reverse gap-1 px-5 py-5 sm:px-6">
                  <dt className="text-sm text-fg-muted">{item.label}</dt>
                  <dd className="tabular text-3xl font-semibold tracking-tight text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      )}
    </section>
  );
}

function StatusPill({ label, available }: { label: string; available?: boolean }) {
  return (
    <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 py-1.5 pr-3.5 pl-3 text-sm text-fg-muted backdrop-blur-sm">
      <span aria-hidden="true" className="relative flex size-2">
        {available && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
        )}
        <span className={cn('relative inline-flex size-2 rounded-full', available ? 'bg-success' : 'bg-fg-subtle')} />
      </span>
      {label}
    </p>
  );
}

function ProfileCard({
  profile,
  initials,
  experienceLabel,
}: {
  profile: Profile;
  initials: string;
  experienceLabel: string | null;
}) {
  const rows: Array<{ label: string; value: string }> = [];
  if (experienceLabel) rows.push({ label: 'Experience', value: experienceLabel });
  if (profile.focusAreas?.length) rows.push({ label: 'Focus', value: profile.focusAreas.join(', ') });

  return (
    <div className="relative rounded-[var(--radius-card)] border border-border bg-surface/90 shadow-[var(--shadow-lift)] backdrop-blur-sm">
      <div className="flex items-center gap-3.5 border-b border-border p-5 sm:p-6">
        <Monogram initials={initials} image={profile.avatar} className="size-20 rounded-xl text-base sm:size-24" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-fg">{profile.title}</p>
          {profile.location && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-fg-muted">
              <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="truncate">{profile.location}</span>
            </p>
          )}
        </div>
      </div>
      {rows.length > 0 && (
        <dl className="divide-y divide-border">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 px-5 py-3.5 text-sm sm:px-6">
              <dt className="font-mono text-xs leading-5 tracking-wide text-fg-subtle uppercase">{row.label}</dt>
              <dd className="text-fg">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {profile.coreStack && profile.coreStack.length > 0 && (
        <div className="border-t border-border px-5 py-4 sm:px-6">
          <p className="mb-2.5 font-mono text-xs tracking-wide text-fg-subtle uppercase">Core stack</p>
          <ul className="flex flex-wrap gap-1.5" aria-label="Core stack">
            {profile.coreStack.map((item) => (
              <li key={item}>
                <Tag>{item}</Tag>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
