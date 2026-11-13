import { ChevronDown, MapPin } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { TagList } from '../components/ui/Tag';
import { TextLink } from '../components/ui/TextLink';
import { cardClasses } from '../components/ui/styles';
import { formatDateRange, formatDuration } from '../lib/date';
import type { Experience as ExperienceEntry, SectionCopy } from '../types/content';

interface ExperienceProps {
  copy: SectionCopy;
  items: readonly ExperienceEntry[];
  locale?: string;
}

export function Experience({ copy, items, locale }: ExperienceProps) {
  return (
    <Section id="experience" copy={copy}>
      <ol className="relative space-y-6 md:space-y-10 md:before:absolute md:before:top-3 md:before:bottom-3 md:before:left-[11.5rem] md:before:w-px md:before:bg-border">
        {items.map((item, index) => (
          <Reveal as="li" key={item.id} delay={Math.min(index, 3) * 0.05}>
            <ExperienceItem item={item} locale={locale} />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function ExperienceItem({ item, locale }: { item: ExperienceEntry; locale?: string }) {
  const range = formatDateRange(item.startDate, item.endDate, locale);
  const duration = formatDuration(item.startDate, item.endDate);
  const isCurrent = !item.endDate;
  const titleId = `experience-${item.id}`;

  return (
    <article aria-labelledby={titleId} className="relative grid gap-4 md:grid-cols-[11.5rem_minmax(0,1fr)] md:gap-0">
      {/* Timeline meta column */}
      <div className="md:pt-6 md:pr-6">
        <span
          aria-hidden="true"
          className={`absolute top-[1.85rem] left-[11.5rem] hidden size-2.5 -translate-x-1/2 rounded-full ring-4 ring-bg md:block ${isCurrent ? 'bg-accent' : 'bg-border-strong'}`}
        />
        {range && <p className="font-mono text-sm text-fg md:text-[0.8125rem] md:whitespace-nowrap">{range}</p>}
        <p className="mt-1 text-sm text-fg-subtle">
          {[duration, item.employmentType].filter(Boolean).join(' · ')}
        </p>
      </div>

      <div className={cardClasses(false, 'p-6 sm:p-7 md:ml-8')}>
        <header>
          <h3 id={titleId} className="text-lg font-semibold text-fg sm:text-xl">
            {item.role}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem]">
            <TextLink href={item.companyUrl} className="font-medium text-accent">
              {item.company}
            </TextLink>
            {item.location && (
              <span className="inline-flex items-center gap-1 text-sm text-fg-muted">
                <MapPin aria-hidden="true" className="size-3.5" />
                {item.location}
              </span>
            )}
          </p>
          {item.companyDescription && <p className="mt-3 text-sm text-fg-subtle">{item.companyDescription}</p>}
        </header>

        {item.summary && <p className="mt-4 leading-relaxed text-fg-muted">{item.summary}</p>}

        {item.impact && item.impact.length > 0 && (
          <dl className="mt-5 flex flex-wrap gap-2.5">
            {item.impact.map((metric) => (
              <div
                key={`${metric.value}-${metric.label}`}
                className="flex flex-col-reverse rounded-lg border border-border bg-surface-muted/60 px-3.5 py-2.5"
              >
                <dt className="text-xs text-fg-muted">{metric.label}</dt>
                <dd className="tabular text-lg font-semibold text-fg">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {item.achievements && item.achievements.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 font-mono text-xs tracking-wide text-fg-subtle uppercase">Key achievements</h4>
            <ul className="space-y-2.5">
              {item.achievements.map((achievement) => (
                <li key={achievement} className="relative pl-5 leading-relaxed text-fg">
                  <span aria-hidden="true" className="absolute top-[0.6rem] left-0 h-px w-2.5 bg-accent" />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.responsibilities && item.responsibilities.length > 0 && (
          <details className="group mt-5 rounded-lg border border-border">
            <summary className="flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium text-fg-muted transition-colors hover:text-fg">
              Responsibilities
              <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="space-y-2 border-t border-border px-4 py-3.5">
              {item.responsibilities.map((responsibility) => (
                <li key={responsibility} className="relative pl-4 text-sm leading-relaxed text-fg-muted">
                  <span aria-hidden="true" className="absolute top-[0.55rem] left-0 size-1 rounded-full bg-fg-subtle" />
                  {responsibility}
                </li>
              ))}
            </ul>
          </details>
        )}

        <TagList items={item.technologies} className="mt-6" />
      </div>
    </article>
  );
}
