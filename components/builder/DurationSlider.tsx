/**
 * Duration slider component
 * Allows users to customize the duration of each meditation technique
 * TODO: Implement with range input, min/max constraints, and visual feedback
 */
export default function DurationSlider() {
  return (
    <div className="duration-slider">
      <input type="range" min="0" max="30" />
      <span>Duration</span>
    </div>
  );
}
