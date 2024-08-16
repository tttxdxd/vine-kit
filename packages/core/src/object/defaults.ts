import type { DeepPartial } from '@vine-kit/shared'

/**
 * Extends an object with default values. For each property in `defaults` that is not already
 * present in `o`, or is present but undefined, the property and its value from `defaults` is added to `o`.
 *
 * @param o - The original object to be extended.
 * @param defaults - An object containing default values.
 * @returns A new object that is `o` extended with default values from `defaults`.
 *
 * @example
 * ```typescript
 * const original = { a: 1, b: undefined };
 * const defaults = { b: 2, c: 3 };
 * const extended = defaults(original, defaults);
 * console.log(extended); // Outputs: { a: 1, b: 2, c: 3 }
 * ```
 */
export function defaults<O extends Record<string, any>>(o: O, defaults: DeepPartial<O>) {
  const output = { ...o }
  for (const key in defaults) {
    if (output[key] === undefined)
      output[key] = defaults[key] as any
  }
  return output
}
