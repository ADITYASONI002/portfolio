import { cn } from '../../lib/cn';

interface ProjectFiltersProps {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
}

/** Toggle buttons (`aria-pressed`) rather than tabs: they filter one list instead of switching panels. */
export function ProjectFilters({ categories, active, onChange }: ProjectFiltersProps) {
  return (
    <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const pressed = category === active;
        return (
          <button
            key={category}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(category)}
            className={cn(
              'h-9 rounded-full border px-4 text-sm transition-colors',
              pressed
                ? 'border-fg bg-fg text-bg'
                : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg',
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
