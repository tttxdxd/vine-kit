import type { NonEmptyArray } from '../types'

/**
 * 生成间隔为 step, 位于 [start, end) 区间的数组
 */
export function range(start: number, end: number, step: number = 1) {
  return Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step)
}

export function toArray<T>(val: T | T[] = []): T[] {
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

export function isEmptyArray<T>(val: T[]): val is [] {
  return val.length === 0
}

export function notEmptyArray<T>(val: T[]): val is NonEmptyArray<T> {
  return val.length !== 0
}

export function last<T>(val: NonEmptyArray<T>): T
export function last<T>(val: T[]): T | undefined {
  return Array.isArray(val) && val.length > 0 ? val[val.length - 1] : undefined
}

export function uniq<T>(val: T[]): T[] {
  return Array.from(new Set(val))
}

export function every<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => boolean): boolean {
  return Array.isArray(iterable) ? iterable.every(fn) : Array.from(iterable).every(fn)
}

export function some<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => boolean): boolean {
  return Array.isArray(iterable) ? iterable.some(fn) : Array.from(iterable).some(fn)
}
