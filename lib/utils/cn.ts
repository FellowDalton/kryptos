/**
 * Class name utility
 * Merges and conditionally applies CSS classes
 * TODO: Implement using clsx or custom logic for conditional class names
 */

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
