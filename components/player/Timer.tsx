/**
 * Timer component showing elapsed/remaining time
 * Displays current position and total duration in MM:SS format
 */

interface TimerProps {
  /** Current elapsed time in seconds */
  elapsed: number;
  /** Total duration in seconds */
  total: number;
}

/**
 * Format seconds into MM:SS display
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function Timer({ elapsed, total }: TimerProps) {
  return (
    <div className="text-center text-gray-400 text-lg font-light tracking-wide">
      {formatTime(elapsed)} / {formatTime(total)}
    </div>
  );
}
