import { Check } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Reveal } from '../components/ui/Reveal';
import { Tag } from '../components/ui/Tag';
import { cardClasses } from '../components/ui/styles';
import type { AboutContent, SectionCopy } from '../types/content';

interface AboutProps {
  copy: SectionCopy;
  about: AboutContent;
  experienceLabel: string | null;
}

export function About({ copy, about, experienceLabel }: AboutProps) {
  const [lead, ...rest] = about.paragraphs;
  const hasAside = Boolean(experienceLabel || about.specializations?.length || about.interests?.length);

  return (
    <Section id="about" copy={copy}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className={hasAside ? 'lg:col-span-7' : 'lg:col-span-9'}>
          {lead && <p className="text-lg leading-relaxed text-pretty text-fg sm:text-xl">{lead}</p>}
          {rest.map((paragraph, index) => (
            <p key={index} className="mt-5 text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
              {paragraph}
            </p>
          ))}
        </Reveal>

        {hasAside && (
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className={cardClasses(false, 'divide-y divide-border')}>
              {experienceLabel && (
                <div className="p-6">
                  <p className="text-3xl font-semibold tracking-tight text-fg">{experienceLabel}</p>
                  <p className="mt-1 text-sm text-fg-muted">of professional software engineering</p>
                </div>
              )}
              {about.specializations && about.specializations.length > 0 && (
                <div className="p-6">
                  <h3 className="mb-3 font-mono text-xs tracking-wide text-fg-subtle uppercase">Specialisations</h3>
                  <ul className="space-y-2.5">
                    {about.specializations.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-fg">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {about.interests && about.interests.length > 0 && (
                <div className="p-6">
                  <h3 className="mb-3 font-mono text-xs tracking-wide text-fg-subtle uppercase">Interests</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {about.interests.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Reveal>
        )}
      </div>

      {about.philosophy && about.philosophy.length > 0 && (
        <div className="mt-16">
          <h3 className="mb-5 font-mono text-xs tracking-[0.14em] text-fg-subtle uppercase">How I work</h3>
          <ol className="grid gap-4 md:grid-cols-3">
            {about.philosophy.map((principle, index) => (
              <Reveal as="li" key={principle.title} delay={index * 0.06} className={cardClasses(false, 'p-6')}>
                <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, '0')}</span>
                <h4 className="mt-3 font-semibold text-fg">{principle.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{principle.description}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      )}
    </Section>
  );
}
