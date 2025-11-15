/**
 * Progress bar component showing meditation session progress
 * Visual indicator of current position in the current section
 */

interface ProgressBarProps {
  /** Current elapsed time in seconds */
  elapsed: number;
  /** Total duration in seconds */
  total: number;
}

export default function ProgressBar({ elapsed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((elapsed / total) * 100, 100) : 0;

  return (
    <div className="w-full max-w-md mx-auto my-8">
      {/* Progress track */}
      <div className="relative w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        {/* Progress fill */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300 ease-linear"
          style={{ width: `${percentage}%` }}
        />

        {/* Progress indicator dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg transition-all duration-300 ease-linear"
          style={{ left: `${percentage}%`, marginLeft: '-6px' }}
        />
      </div>
    </div>
  );
}
