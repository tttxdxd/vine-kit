import type { NonEmptyArray } from '../types'
import { isFunction, isString } from './general'
import { randomInt } from './random'

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

/**
 * 获取打乱后的集合
 * @param val
 * @returns
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

export function last<T>(val: NonEmptyArray<T>): T
export function last<T>(val: T[]): T | undefined {
  return Array.isArray(val) && val.length > 0 ? val[val.length - 1] : undefined
}

export function unique<T>(val: T[]): T[] {
  return Array.from(new Set(val))
}

export function every<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => boolean): boolean {
  return Array.isArray(iterable) ? iterable.every(fn) : Array.from(iterable).every(fn)
}

export function some<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => boolean): boolean {
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
