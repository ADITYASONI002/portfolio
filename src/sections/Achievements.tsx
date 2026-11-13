import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { cardClasses } from '../components/ui/styles';
import { cn } from '../lib/cn';
import { resolveIcon } from '../lib/icons';
import type { Achievement, SectionCopy } from '../types/content';

interface AchievementsProps {
  copy: SectionCopy;
  items: readonly Achievement[];
}

export function Achievements({ copy, items }: AchievementsProps) {
  return (
    <Section id="achievements" copy={copy} className="border-y border-border bg-surface-muted/40">
      <ul className={cn('grid gap-4 sm:grid-cols-2', items.length >= 3 && 'lg:grid-cols-3', items.length >= 4 && 'xl:grid-cols-4')}>
        {items.map((item, index) => {
          const Icon = resolveIcon(item.icon);
          return (
            <Reveal as="li" key={item.id} delay={(index % 4) * 0.05} className={cardClasses(false, 'flex flex-col p-6')}>
              <Icon aria-hidden="true" className="size-5 text-accent" />
              <p className="tabular mt-5 text-4xl font-semibold tracking-tight text-fg">{item.value}</p>
              <h3 className="mt-2 font-medium text-fg">{item.label}</h3>
              {item.description && <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.description}</p>}
              {item.context && (
                <p className="mt-auto pt-5 font-mono text-xs tracking-wide text-fg-subtle">{item.context}</p>
              )}
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
