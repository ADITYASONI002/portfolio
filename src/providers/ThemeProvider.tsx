import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  applyTheme,
  parseThemePreference,
  readStoredTheme,
  resolveTheme,
  writeStoredTheme,
  type ResolvedTheme,
  type ThemePreference,
} from '../lib/theme';
import { ThemeContext, type ThemeContextValue } from './theme-context';

interface ThemeProviderProps {
  children: ReactNode;
  /** `light`, `dark` or `system`, from site-config.json. */
  defaultTheme?: string;
  themeColors?: { light: string; dark: string };
}

export function ThemeProvider({ children, defaultTheme, themeColors }: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(
    () => readStoredTheme() ?? parseThemePreference(defaultTheme),
  );
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => resolveTheme('system'));
  const theme: ResolvedTheme = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    if (preference !== 'system' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemTheme(query.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [preference]);

  useEffect(() => {
    applyTheme(theme, themeColors);
  }, [theme, themeColors]);

  const setPreference = useCallback((next: ThemePreference) => {
    writeStoredTheme(next);
    setPreferenceState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, theme, setPreference, toggleTheme }),
    [preference, theme, setPreference, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
