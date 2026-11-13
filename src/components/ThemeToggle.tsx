import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { buttonClasses } from './ui/styles';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={buttonClasses('ghost', 'icon', className)}
    >
      {/* Icon follows the `dark` class (set before paint), so prerendered HTML shows the right one. */}
      <Sun className="hidden size-[18px] dark:block" />
      <Moon className="size-[18px] dark:hidden" />
    </button>
  );
}
