'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
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
            </div>
          </nav>
        </>
      )}
    </>
  );
}
