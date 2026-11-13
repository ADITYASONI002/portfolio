import { THEME_PREFERENCES, THEME_STORAGE_KEY } from './theme-constants';

export type ThemePreference = (typeof THEME_PREFERENCES)[number];
export type ResolvedTheme = 'light' | 'dark';

export function parseThemePreference(value: unknown, fallback: ThemePreference = 'system'): ThemePreference {
  return typeof value === 'string' && (THEME_PREFERENCES as readonly string[]).includes(value)
    ? (value as ThemePreference)
    : fallback;
}

export function readStoredTheme(): ThemePreference | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored ? parseThemePreference(stored) : null;
  } catch {
    return null; // Storage can be unavailable (privacy mode, blocked site data).
  }
}

export function writeStoredTheme(theme: ThemePreference): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Non-critical: the theme still applies for this visit. */
  }
}

export function getSystemTheme(): ResolvedTheme {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? getSystemTheme() : preference;
}

export function applyTheme(theme: ResolvedTheme, themeColors?: { light: string; dark: string }): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  const color = themeColors?.[theme];
  const meta = document.querySelector('meta[name="theme-color"]');
  if (color && meta) {
    meta.removeAttribute('media');
    meta.setAttribute('content', color);
  }
}
