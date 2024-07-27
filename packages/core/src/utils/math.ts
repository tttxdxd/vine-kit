/**
 * Clamps a number between a specified minimum and maximum value.
 *
 * @param value The number to clamp.
 * @param min The minimum value that the result should not be less than.
 * @param max The maximum value that the result should not be greater than.
 * @returns The clamped value between the minimum and maximum values.
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linearly interpolates between two numbers.
 *
 * This function returns a number between `a` and `b` based on the interpolation factor `t`.
 * The parameter `t` is clamped between 0 and 1.
 * When `t` is 0, the function returns `a`.
 * When `t` is 1, the function returns `b`.
 * For values of `t` between 0 and 1, the function returns a value in a linear fashion between `a` and `b`.
 *
 * @param a - The starting value.
 * @param b - The ending value.
 * @param t - The interpolation factor between 0 and 1.
 * @returns The interpolated value between `a` and `b`.
 */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/**
 * Remaps a number from one range to another.
 * This function takes a value in the 'old' range (oldMin to oldMax) and maps it to a new range (newMin to newMax).
 * It's useful for scaling values, such as normalizing a pixel value or converting a temperature scale.
 *
 * @param value The original value to remap.
 * @param oldMin The minimum value of the original range.
 * @param oldMax The maximum value of the original range.
 * @param newMin The minimum value of the new range.
 * @param newMax The maximum value of the new range.
 * @returns The remapped value within the new range.
 */
export function remap(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  return lerp(newMin, newMax, (value - oldMin) / (oldMax - oldMin))
}

/**
 * Sums up all the numbers provided, either as an initial array or as a sequence of arguments.
 *
 * @param number - The first parameter can be either a single number or an array of numbers.
 *                 If an array is provided, it is summed first, and then the remaining numbers are added to the sum.
 * @param numbers - Additional numbers to be added to the sum. These are provided as rest parameters.
 * @returns The total sum of all numbers provided.
 */
export function sum(numbers: number[]): number
export function sum(...numbers: number[]): number
export function sum(number: number | number[], ...numbers: number[]) {
  if (Array.isArray(number))
    return number.reduce((a, b) => a + b, 0)
  return numbers.reduce((a, b) => a + b, number)
}

/**
 * Calculates the sum of a numeric value derived by invoking a function on each element in the array.
 *
 * @param array The array of objects to iterate over.
 * @param fn The function invoked per iteration. It should return a number to be summed.
 * @returns The sum of the numeric values returned by the function for each element in the array.
 */
export function sumBy<T extends object>(array: T[], fn: (item: T) => number) {
  return array.reduce((a, b) => a + fn(b), 0)
}
