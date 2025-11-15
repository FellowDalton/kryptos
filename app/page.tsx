import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-12">
        {/* Branding and Welcome */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-semibold text-text-primary">
            Praylude
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary">
            Where Prayer Sets the Tone
          </p>
          <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            A minimalist Christian meditation app inspired by Japanese Ma - the art of sacred space.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="space-y-6 pt-8">
          <Link
            href="/meditate/standard"
            className="block w-full sm:inline-block sm:w-auto px-8 py-4 rounded-lg bg-accent text-background font-medium text-lg hover:opacity-90 transition-all duration-300 min-h-[44px]"
          >
            Begin Today&apos;s Meditation
          </Link>

          {/* Secondary CTA */}
          <div>
            <Link
              href="/create"
              className="block w-full sm:inline-block sm:w-auto px-6 py-3 rounded-lg border border-accent text-accent hover:bg-accent hover:text-background transition-all duration-300 min-h-[44px]"
            >
              Create Custom Meditation
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
