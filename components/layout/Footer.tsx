/**
 * Footer component for site-wide footer
 * Minimal design following Ma principles: unobtrusive, spacious
 * Simple copyright and version, generous margin from content
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 sm:mt-32 border-t border-surface">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
          {/* Copyright */}
          <p className="text-sm text-text-secondary">
            &copy; {currentYear} Praylude. Where prayer sets the tone.
          </p>

          {/* Version - Optional, subtle */}
          <p className="text-xs text-text-secondary/70">
            v0.1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
