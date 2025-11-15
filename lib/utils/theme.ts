/**
 * Theme utility functions for Praylude
 * Manages light/dark mode toggle with localStorage persistence
 * Default theme: dark (as per design system)
 */

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'praylude_theme';
const DEFAULT_THEME: Theme = 'dark';

/**
 * Get current theme from localStorage or default
 * Safe for SSR - returns default on server
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as Theme) || DEFAULT_THEME;
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
    return DEFAULT_THEME;
  }
}

/**
 * Set theme and persist to localStorage
 * Updates document class for immediate visual effect
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
}

/**
 * Toggle between light and dark themes
 * Returns the new theme
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/**
 * Initialize theme on app mount
 * Call this in a useEffect to set up initial theme
 */
export function initializeTheme(): Theme {
  const theme = getTheme();
  if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
  return theme;
}
