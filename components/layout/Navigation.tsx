'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getTheme, toggleTheme, type Theme } from '@/lib/utils/theme';

/**
 * Navigation component
 * Mobile: Hamburger menu with overlay
 * Desktop: Horizontal navigation with active states
 * Follows Ma principles: minimal, spacious, calm
 */

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/meditate/standard', label: 'Meditate' },
  { href: '/create', label: 'Create' },
  { href: '/profile', label: 'Profile' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setThemeState(getTheme());
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setThemeState(newTheme);
  };

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden md:flex items-center gap-8 lg:gap-12" aria-label="Main navigation">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              text-base font-medium transition-colors duration-300
              ${isActive(link.href)
                ? 'text-accent'
                : 'text-text-secondary hover:text-text-primary'
              }
            `}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <nav
            className="fixed top-20 right-0 bottom-0 w-64 bg-surface z-50 md:hidden shadow-lg"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-2 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-300
                    ${isActive(link.href)
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}

              {/* Theme Toggle in Mobile Menu */}
              <div className="mt-4 pt-4 border-t border-surface">
                <button
                  onClick={handleThemeToggle}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium text-text-secondary hover:text-text-primary hover:bg-surface/50 transition-colors duration-300"
                  suppressHydrationWarning
                >
                  {mounted && (
                    <>
                      {theme === 'dark' ? (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          <span>Dark Mode</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
