'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { getTheme, toggleTheme, type Theme } from '@/lib/utils/theme';

/**
 * Header component for site-wide navigation
 * Follows Japanese Ma aesthetic: generous whitespace, minimal elements
 * Dark mode first with design system colors
 * Includes theme toggle button for light/dark mode switching
 */
export default function Header() {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setThemeState(getTheme());
  }, []);

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setThemeState(newTheme);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-surface">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo/Wordmark */}
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary hover:text-accent transition-colors duration-300"
          >
            Praylude
          </Link>

          {/* Desktop Navigation & Theme Toggle */}
          <div className="flex items-center gap-6">
            <Navigation />

            {/* Theme Toggle Button - Desktop */}
            <button
              onClick={handleThemeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface transition-all duration-300"
              suppressHydrationWarning
            >
              {mounted && (
                theme === 'dark' ? (
                  // Sun icon for light mode
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  // Moon icon for dark mode
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
