/**
 * Clamps a value between a minimum and maximum value.
 *
 * @category MathUtil
 */
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}
