import type { Arrayable, NonEmptyArray, Nullable } from '../types'
import { isFunction, isNullish } from './general'
import { randomInt } from './random'

/**
 * Genrate a range array of numbers. The `stop` is exclusive.
 *
 * @category ArrayUtil
 */
export function range(stop: number): number[]
export function range(start: number, stop: number, step?: number): number[]
export function range(...args: any): number[] {
  let start: number, stop: number, step: number

  if (args.length === 1) {
    start = 0
    step = 1;
    ([stop] = args)
  }
  else {
    ([start, stop, step = 1] = args)
  }

  return Array.from({ length: Math.ceil((stop - start) / step) }, (_, i) => start + i * step)
}

/**
 * Convert `Arrayable<T>` to `Array<T>`
 *
 * @category ArrayUtil
 */
export function toArray<T>(val?: Nullable<Arrayable<T>>): T[] {
  if (isNullish(val))
    return []
  return Array.isArray(val) ? val : [val]
}

export function flatten(val: any[], depth: number = 1): any[] {
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

export function flattenDeep(val: any[]): any[] {
  return flatten(val, Number.POSITIVE_INFINITY)
}

/**
 * 获取打乱后的集合
 * @param val
 */
export function shuffle<T>(val: T[]): T[] {
  const result = [...val]
  for (let i = result.length - 1; i > 0; i--)
    swap(result, i, randomInt(i + 1))

  return result
}

export function swap(val: any[], i: number, j: number) {
  if (i === j)
    return

  const temp = val[i]
  val[i] = val[j]
  val[j] = temp
}

export function isEmptyArray<T>(val: T[]): val is [] {
  return val.length === 0
}

export function notEmptyArray<T>(val: T[]): val is NonEmptyArray<T> {
  return val.length !== 0
}

/**
 * Get nth item of Array. Negative for backward
 *
 * @category ArrayUtil
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
 * Get last item
 *
 * @category ArrayUtil
 */
export function last(val: readonly []): undefined
export function last<T>(val: readonly T[]): T
export function last<T>(val: readonly T[]): T | undefined {
  return at(val, -1)
}

/**
 * Unique an Array
 *
 * @category ArrayUtil
 */
export function unique<T>(val: readonly T[]): T[] {
  return Array.from(new Set(val))
}

/**
 * Unique an Array by a custom equality function
 *
 * @category ArrayUtil
 */
export function uniqueBy<T>(val: readonly T[], equalFn: (a: any, b: any) => boolean): T[] {
  return val.reduce((acc: T[], cur: any) => {
    const index = acc.findIndex((item: any) => equalFn(cur, item))
    if (index === -1)
      acc.push(cur)
    return acc
  }, [])
}

export function every<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => boolean): boolean {
  if (isNullish(iterable))
    return false

  return Array.isArray(iterable) ? iterable.every(fn) : Array.from(iterable).every(fn)
}

export function some<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => boolean): boolean {
  if (isNullish(iterable))
    return false

  return Array.isArray(iterable) ? iterable.some(fn) : Array.from(iterable).some(fn)
}

export function reduce<T, U>(iterable: Iterable<T> | ArrayLike<T>, fn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U {
  return Array.isArray(iterable) ? iterable.reduce(fn, initialValue) : Array.from(iterable).reduce(fn, initialValue)
}

export function keyBy<T>(iterable: Iterable<T> | ArrayLike<T>, key: keyof T): Record<string, T>
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
 * Returns a new array with the elements sorted in ascending order.
 *
 * @category ArrayUtil
 */
export function toSorted<T>(iterable: Iterable<T> | ArrayLike<T>, compareFn?: (a: T, b: T) => number) {
  if (isNullish(iterable))
    return iterable

  return Array.from(iterable).sort(compareFn)
}
