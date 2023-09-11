import { isObject } from './general'

/**
 * 生成间隔为 step, 位于 [start, end) 区间的数组
 */
export function range(start: number, end: number, step: number = 1) {
  return Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step)
}

export function toArray<T>(val: T | T[] = []): T[] {
  return Array.isArray(val) ? val : [val]
}

export function isEmptyArray<T>(val: ArrayLike<T>): boolean {
  return val.length === 0
}

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
