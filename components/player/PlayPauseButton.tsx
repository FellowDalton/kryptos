/**
 * Play/Pause button component
 * Central control for meditation playback with smooth state transitions
 */

interface PlayPauseButtonProps {
  /** Current playback state */
  isPlaying: boolean;
  /** Callback when button is clicked */
  onToggle: () => void;
  /** Optional: disable the button */
  disabled?: boolean;
}

export default function PlayPauseButton({
  isPlaying,
  onToggle,
  disabled = false,
}: PlayPauseButtonProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className="
        group relative w-20 h-20 mx-auto
        bg-gradient-to-br from-blue-500 to-blue-600
        hover:from-blue-400 hover:to-blue-500
        rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
      "
      aria-label={isPlaying ? 'Pause meditation' : 'Play meditation'}
    >
      {isPlaying ? (
        // Pause icon (two vertical bars)
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        // Play icon (triangle)
        <svg
          className="w-8 h-8 text-white ml-1"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
