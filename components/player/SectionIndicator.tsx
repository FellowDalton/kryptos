/**
 * Section indicator component
 * Shows all 6 sections as dots with current section highlighted
 */

interface SectionIndicatorProps {
  /** Total number of sections (always 6) */
  totalSections: number;
  /** Current active section index (0-based) */
  currentSection: number;
}

export default function SectionIndicator({
  totalSections,
  currentSection,
}: SectionIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {Array.from({ length: totalSections }, (_, index) => {
        const isActive = index === currentSection;
        const isPast = index < currentSection;

        return (
          <div
            key={index}
            className={`
              w-2.5 h-2.5 rounded-full transition-all duration-300
              ${isActive ? 'bg-blue-500 scale-125' : ''}
              ${isPast ? 'bg-gray-600' : ''}
              ${!isActive && !isPast ? 'bg-gray-800' : ''}
            `}
            aria-label={`Section ${index + 1}${isActive ? ' (current)' : ''}`}
          />
        );
      })}
    </div>
  );
}
