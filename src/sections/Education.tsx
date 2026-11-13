import { Award, GraduationCap } from 'lucide-react';
import type { ReactNode } from 'react';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { TextLink } from '../components/ui/TextLink';
import { cardClasses } from '../components/ui/styles';
import { cn } from '../lib/cn';
import { formatDateRange, formatYearMonth } from '../lib/date';
import type { Certification, Education as EducationEntry, SectionCopy } from '../types/content';

interface EducationProps {
  copy: SectionCopy;
  education: readonly EducationEntry[];
  certifications: readonly Certification[];
  locale?: string;
}

export function Education({ copy, education, certifications, locale }: EducationProps) {
  const both = education.length > 0 && certifications.length > 0;
  return (
    <Section id="education" copy={copy}>
      <div className={cn('grid gap-10', both && 'lg:grid-cols-2 lg:gap-8')}>
        {education.length > 0 && (
          <Column title="Education" icon={<GraduationCap aria-hidden="true" className="size-4" />}>
            {education.map((item) => {
              const range = formatDateRange(item.startDate, item.endDate, locale);
              return (
                <Reveal as="li" key={item.id} className={cardClasses(false, 'p-6')}>
                  <h4 className="font-semibold text-fg">
                    {item.degree}
                    {item.field && <span className="font-normal text-fg-muted"> — {item.field}</span>}
                  </h4>
                  <p className="mt-1 text-[0.9375rem] text-accent">{item.institution}</p>
                  <p className="mt-2 font-mono text-xs text-fg-subtle">
                    {[range, item.location, item.grade].filter(Boolean).join(' · ')}
                  </p>
                  {item.highlights && item.highlights.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {item.highlights.map((highlight) => (
                        <li key={highlight} className="text-sm leading-relaxed text-fg-muted">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              );
            })}
          </Column>
        )}

        {certifications.length > 0 && (
          <Column title="Certifications" icon={<Award aria-hidden="true" className="size-4" />}>
            {certifications.map((item) => {
              const issued = formatYearMonth(item.issueDate, locale);
              const expires = formatYearMonth(item.expiryDate, locale);
              return (
                <Reveal as="li" key={item.id} className={cardClasses(false, 'p-6')}>
                  <h4 className="font-semibold text-fg">
                    <TextLink href={item.url} aria-label={item.url ? `${item.name} — view credential` : undefined}>
                      {item.name}
                    </TextLink>
                  </h4>
                  <p className="mt-1 text-[0.9375rem] text-fg-muted">{item.issuer}</p>
                  <p className="mt-2 font-mono text-xs text-fg-subtle">
                    {[issued && `Issued ${issued}`, expires && `Expires ${expires}`, item.credentialId && `ID ${item.credentialId}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </Reveal>
              );
            })}
          </Column>
        )}
      </div>
    </Section>
  );
}

function Column({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-fg-subtle uppercase">
        {icon}
        {title}
      </h3>
      <ul className="space-y-4">{children}</ul>
    </div>
  );
}
