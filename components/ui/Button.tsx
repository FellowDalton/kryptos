/**
 * Minimalist button component following Japanese Ma design principles
 * TODO: Implement with proper styling, variants (primary, secondary, ghost), and accessibility
 */
export default function Button({ children }: { children?: React.ReactNode }) {
  return <button>{children || 'Button'}</button>;
}
