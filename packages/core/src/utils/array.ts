import type { Arrayable, NonEmptyArray, Nullable } from '../types'
import { isFunction, isNullish, isUndefined } from './general'
import { randomInt } from './random'

/**
 * Generate a range of numbers in an array.
 *
 * @param stop - The ending value of the range (exclusive, unless step is negative).
 * @returns An array of numbers from start to stop (exclusive) by the given step.
 *
 * @example
 * range(5)           // [0, 1, 2, 3, 4]
 */
export function range(stop: number): number[]
/**
 * Generate a range of numbers in an array.
 *
 * @param start - The starting value of the range (inclusive).
 * @param stop - The ending value of the range (exclusive, unless step is negative).
 * @param step - The increment between each value in the range. If omitted, it defaults to 1 if start is less than stop, or -1 if start is greater than stop.
 * @returns An array of numbers from start to stop (exclusive) by the given step.
 *
 * @example
 * range(0, 5)        // [0, 1, 2, 3, 4]
 * range(0, 10, 2)    // [0, 2, 4, 6, 8]
 * range(10, 0, -2)   // [10, 8, 6, 4, 2]
 * range(1, 10, 0)    // Throws an error: step must not be 0
 * range(10, 0)       // [] (empty array, as stop is less than start and no step is provided)
 */
export function range(start: number, stop: number, step?: number): number[]
export function range(...args: any): number[] {
  const [start = 0, stop = 0, _step] = args.length === 1 ? [0, args[0]] : args
  const step = _step ?? (start > stop ? -1 : 1)

  if (step === 0)
    throw new Error('step must not be 0')

  const length = Math.max(Math.ceil((stop - start) / step), 0)

  if (length < 0)
    return []

  return Array.from({ length: Math.ceil((stop - start) / step) }, (_, i) => start + i * step)
}

/**
 * Convert `Arrayable<T>` to `Array<T>`
 *
 * @category ArrayUtil
 * @param val - The value to be converted, which can be an array or a single item.
 * @returns An array containing the elements of `val` if it was already an array,
 *          or a single-element array containing `val` if it was not an array.
 */
export function toArray<T>(val?: Nullable<Arrayable<T>>): T[] {
  if (isNullish(val))
    return []
  return Array.isArray(val) ? val : [val]
}

/**
 * Flatten a nested array into a one-dimensional array.
 *
 * @param val - The nested array to be flattened.
 * @param depth - The depth of flattening, defaults to 1. If the depth is set to a value greater than 1,
 *                the function will recursively flatten nested arrays up to the specified depth.
 *                If the depth is set to 0 or a negative value, all nested arrays will be flattened.
 * @returns A one-dimensional array containing all elements of the original nested array.
 */
export function flatten(val: readonly any[], depth: number = 1): any[] {
  const result: any[] = []
  if (isEmptyArray(val))
    return result

  for (let i = 0; i < val.length; i++) {
    if (Array.isArray(val[i])) {
      if (depth > 0)
        result.push(...flatten(val[i], depth - 1))
      else
        result.push(...val[i])
    }
    else {
      result.push(val[i])
    }
  }

  return result
}

/**
 * Recursively flattens a deeply nested array into a one-dimensional array.
 *
 * @param val - The deeply nested array to be flattened.
 * @returns A one-dimensional array containing all elements of the original deeply nested array.
 */
export function flattenDeep(val: readonly any[]): any[] {
  return flatten(val, Number.POSITIVE_INFINITY)
}

/**
 * Shuffles the elements of an array in a random order.
 *
 * @param val - The array to be shuffled.
 * @returns A new array with the elements of the original array in a random order.
 */
export function shuffle<T>(val: readonly T[]): T[] {
  const result = [...val]
  for (let i = result.length - 1; i > 0; i--)
    swap(result, i, randomInt(i + 1))

  return result
}

/**
 * Swaps the positions of two elements in an array.
 *
 * @param val - The array in which to swap elements.
 * @param i - The index of the first element to swap.
 * @param j - The index of the second element to swap.
 */
export function swap(val: any[], i: number, j: number) {
  if (i === j)
    return

  const temp = val[i]
  val[i] = val[j]
  val[j] = temp
}

/**
 * Checks if the given array is empty.
 *
 * @param val - The array to be checked.
 * @returns `true` if the array is empty, `false` otherwise.
 */
export function isEmptyArray<T>(val: readonly T[]): val is [] {
  return val.length === 0
}

/**
 * Checks if the given array is not empty.
 *
 * @param val - The array to be checked.
 * @returns `true` if the array is not empty, `false` otherwise.
 * This function also serves as a type guard, narrowing the type of `val` to `NonEmptyArray<T>`
 * if the array is indeed not empty.
 */
export function notEmptyArray<T>(val: readonly T[]): val is NonEmptyArray<T> {
  return val.length !== 0
}

/**
 * Retrieves the value at the specified index from an array.
 * Returns `undefined` if the array is empty or the index is out of range.
 * Supports negative indexing, where -1 indicates the last element.
 *
 * @param val - The array to access, of type `readonly T[]` or `T[]`, representing a read-only or mutable array.
 * @param index - The index position to access. Can be negative, where -n means the nth element from the end.
 */
export function at(val: readonly [], index: number): undefined
export function at<T>(val: readonly T[], index: number): T
export function at<T>(val: readonly T[] | [], index: number): T | undefined {
  const len = val.length
  if (!len)
    return undefined

  if (index < 0)
    index += len

  return val[index]
}

/**
 * Retrieve the last element of an array.
 *
 * @param val - The array to retrieve the last element from.
 */
export function last(val: readonly []): undefined
export function last<T>(val: readonly T[]): T
export function last<T>(val: readonly T[]): T | undefined {
  return at(val, -1)
}

/**
 * Removes duplicates from an array, returning a new array with only unique elements.
 *
 * @param val - The input array, which may contain duplicate elements.
 * @returns A new array containing only the unique elements from the input array.
 */
export function unique<T>(val: readonly T[]): T[] {
  return Array.from(new Set(val))
}

/**
 * Removes duplicates from an array based on a custom equality function, returning a new array with only unique elements.
 *
 * @param val - The input array, which may contain duplicate elements.
 * @param equalFn - A custom equality function that takes two arguments and returns a boolean indicating whether they are equal.
 * @returns A new array containing only the unique elements from the input array, based on the provided equality function.
 *
 * @example
 * const arr = [1, 2, 3, 4, 1, 2, 5]
 * const uniqueArr = uniqueBy(arr, (a, b) => a === b)
 * console.log(uniqueArr) // [1, 2, 3, 4, 5]
 */
export function uniqueBy<T>(val: readonly T[], equalFn: (a: any, b: any) => boolean): T[] {
  return val.reduce((acc: T[], cur: any) => {
    const index = acc.findIndex((item: any) => equalFn(cur, item))
    if (index === -1)
      acc.push(cur)
    return acc
  }, [])
}

/**
 * Checks if all elements in an iterable or array-like object satisfy a given condition.
 *
 * @param iterable - The iterable or array-like object to check.
 * @param fn - A function that takes an element from the iterable and returns a boolean indicating whether the element satisfies the condition.
 * @returns `true` if all elements in the iterable satisfy the condition, otherwise `false`.
 * If the iterable is `null` or `undefined`, returns `false`.
 * If the iterable is an empty array, returns `false` as well (this behavior might be subject to change in future versions).
 *
 * @example
 * const arr = [1, 2, 3, 4]
 * const isEven = (num) => num % 2 === 0
 * console.log(every(arr, isEven)) // false, because not all elements are even
 *
 * const str = 'Hello'
 * const isChar = (char) => typeof char === 'string' && char.length === 1
 * console.log(every(str, isChar)) // true, because all characters in the string are indeed characters
 */
export function every<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => boolean): boolean {
  if (isNullish(iterable))
    return false
  if (Array.isArray(iterable))
    return isEmptyArray(iterable) ? false : iterable.every(fn)
  return every(Array.from(iterable), fn)
}

/**
 * Checks if at least one element in an iterable or array-like object satisfies a given condition.
 *
 * @param iterable - The iterable or array-like object to check.
 * @param fn - A function that takes an element from the iterable and returns a boolean indicating whether the element satisfies the condition.
 * @returns `true` if at least one element in the iterable satisfies the condition, otherwise `false`.
 * If the iterable is `null` or `undefined`, returns `false`.
 *
 * @example
 * const arr = [1, 2, 3, 4, 5]
 * const isEven = (num) => num % 2 === 0
 * console.log(some(arr, isEven)) // true, because there are even numbers in the array
 *
 * const str = 'Hello'
 * const isVowel = (char) => ['a', 'e', 'i', 'o', 'u'].includes(char)
 * console.log(some(str, isVowel)) // true, because there are vowels in the string
 */
export function some<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => boolean): boolean {
  if (isNullish(iterable))
    return false

  return Array.isArray(iterable) ? iterable.some(fn) : Array.from(iterable).some(fn)
}

/**
 * Checks if at least one element in the iterable or array-like object satisfies the provided test function.
 *
 * @param iterable An iterable or array-like object.
 * @param callbackfn A function that takes one argument and returns a boolean, used to test if an element satisfies a condition.
 * @returns true if at least one element in the iterable or array-like object satisfies the test function; otherwise, false.
 */
export function reduce<T>(iterable: Iterable<T> | ArrayLike<T>, callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T
export function reduce<T>(iterable: Iterable<T> | ArrayLike<T>, callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T
export function reduce<T, U>(iterable: Iterable<T> | ArrayLike<T>, callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
export function reduce(iterable: Iterable<any> | ArrayLike<any>, fn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue?: any): any {
  return Array.isArray(iterable) ? iterable.reduce(fn, initialValue) : Array.from(iterable).reduce(fn, initialValue)
}

/**
 * Creates an object composed of keys generated from the results of running each element of
 * `iterable` through `keyFn`. The corresponding value of each key is the last element
 * responsible for generating the key.
 *
 * @param iterable The collection to iterate over.
 * @param key The key to use for grouping elements.
 * @returns Returns the composed aggregate object.
 */
export function keyBy<T>(iterable: Iterable<T> | ArrayLike<T>, key: keyof T): Record<string, T>
/**
 * Creates an object composed of keys generated from the results of running each element of
 * `iterable` through `fn`. The corresponding value of each key is the last element
 * responsible for generating the key.
 *
 * @param iterable The collection to iterate over.
 * @param fn The function to generate the key for each element.
 * @returns Returns the composed aggregate object.
 */
export function keyBy<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => string): Record<string, T>
export function keyBy<T>(iterable: Iterable<T> | ArrayLike<T>, keyFn: ((val: T) => string) | keyof T): Record<string, T> {
  return reduce(iterable, (acc, val) => {
    const key = isFunction(keyFn) ? keyFn(val) : keyFn
    const valKey = (val as any)[key]
    acc[valKey] = val
    return acc
  }, {} as Record<any, T>)
}

/**
 * Groups the elements of `iterable` by a specified key and returns an object whose properties
 * are arrays of elements grouped by the specified key.
 *
 * @param iterable The collection to iterate over.
 * @param key The key to use for grouping elements.
 * @returns Returns the composed aggregate object with grouped elements.
 */
export function groupBy<T>(iterable: Iterable<T> | ArrayLike<T>, key: keyof T): Record<string, T[]>
/**
 * Groups the elements of `iterable` by a key generated from a function and returns an object
 * whose properties are arrays of elements grouped by the generated key.
 *
 * @param iterable The collection to iterate over.
 * @param fn The function to generate the key for each element.
 * @returns  Returns the composed aggregate object with grouped elements.
 */
export function groupBy<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => string): Record<string, T[]>
export function groupBy<T>(iterable: Iterable<T> | ArrayLike<T>, keyFn: ((val: T) => string) | keyof T): Record<string, T[]> {
  return reduce(iterable, (acc, val) => {
    const key = isFunction(keyFn) ? keyFn(val) : keyFn
    const valKey = (val as any)[key]
    if (isUndefined(acc[valKey]))
      acc[valKey] = []
    acc[valKey].push(val)
    return acc
  }, {} as Record<any, T[]>)
}

/**
 * Sorts the elements of an iterable or array-like object and returns a new array, without modifying the original.
 *
 * @param iterable The iterable or array-like object to be sorted.
 * @param compareFn Optional comparison function used to define the sort order.
 *                  Defaults to the natural order if not provided.
 * @returns A new array containing the sorted elements. The original iterable or array-like object remains unchanged.
 *
 * @example
 * const numbers = [5, 2, 8, 9, 4];
 * const sortedNumbers = toSorted(numbers);
 * console.log(sortedNumbers); // Output: [2, 4, 5, 8, 9]
 * console.log(numbers); // Output: [5, 2, 8, 9, 4] (original array unchanged)
 */
export function toSorted<T>(iterable: Iterable<T> | ArrayLike<T>, compareFn?: (a: T, b: T) => number) {
  if (isNullish(iterable))
    return iterable

  return Array.from(iterable).sort(compareFn)
}
