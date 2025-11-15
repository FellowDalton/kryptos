import Link from 'next/link';
import Navigation from './Navigation';

/**
 * Header component for site-wide navigation
 * Follows Japanese Ma aesthetic: generous whitespace, minimal elements
 * Dark mode first with design system colors
 */
export default function Header() {
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

          {/* Desktop Navigation */}
          <Navigation />
        </div>
      </div>
    </header>
  );
}
