import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { Tag } from '../components/ui/Tag';
import { cardClasses } from '../components/ui/styles';
import { normalizeSkills } from '../content/selectors';
import { resolveIcon } from '../lib/icons';
import type { SectionCopy, SkillCategory } from '../types/content';

interface SkillsProps {
  copy: SectionCopy;
  categories: readonly SkillCategory[];
}

export function Skills({ copy, categories }: SkillsProps) {
  const groups = categories
    .map((category) => ({ ...category, items: normalizeSkills(category) }))
    .filter((category) => category.items.length > 0);
  const hasCore = groups.some((group) => group.items.some((skill) => skill.core));

  return (
    <Section
      id="skills"
      copy={copy}
      aside={
        hasCore ? (
          <p className="flex items-center gap-2 text-sm text-fg-muted">
            <Tag emphasis>Core</Tag>
            <span>Used daily in production</span>
          </p>
        ) : undefined
      }
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {groups.map((group, index) => {
          const Icon = resolveIcon(group.icon);
          return (
            <Reveal as="li" key={group.id} delay={(index % 2) * 0.06} className={cardClasses(false, 'p-6')}>
              <div className="flex items-start gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-surface-muted text-accent">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-fg">{group.name}</h3>
                  {group.description && <p className="mt-0.5 text-sm text-fg-muted">{group.description}</p>}
                </div>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${group.name} skills`}>
                {group.items.map((skill) => (
                  <li key={skill.name}>
                    <Tag emphasis={skill.core} className="text-[0.8125rem]">
                      {skill.name}
                      {skill.core && <span className="sr-only"> (core skill)</span>}
                    </Tag>
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
