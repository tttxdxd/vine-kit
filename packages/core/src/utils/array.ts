import type { Arrayable, NonEmptyArray, Nullable } from '../types'
import { isFunction, isNullish, isUndefined } from './general'
import { randomInt } from './random'

/**
 * 生成指定范围内的数字数组
 *
 * @param stop 结束值
 * @returns 返回一个数字数组，包含指定范围内的数字
 */
export function range(stop: number): number[]
/**
 * 生成指定范围内的数字数组
 *
 * @param start 起始值
 * @param stop 结束值
 * @param step 步长，默认为1
 * @returns 返回一个数字数组，包含指定范围内的数字
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
 */
export function toArray<T>(val?: Nullable<Arrayable<T>>): T[] {
  if (isNullish(val))
    return []
  return Array.isArray(val) ? val : [val]
}

/**
 * 将嵌套的数组展开为指定的深度
 * @param val - 要展开的数组
 * @param depth - 展开的深度，默认为 1
 * @returns 展开后的数组
 */
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

/**
 * 完全展开嵌套数组
 * @param val - 要展开的数组
 * @returns 展开后的数组
 */
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

/**
 * 交换数组中两个元素的位置
 * @param val - 要交换的数组
 * @param i - 第一个元素的索引
 * @param j - 第二个元素的索引
 */
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
 * 获取数组中指定索引位置的值
 * 如果数组为空，或者索引超出范围，返回 undefined
 * 支持负索引，从数组末尾开始计数，-1 表示最后一个元素
 *
 * @param val 要访问的数组，类型为 readonly T[] 或 T[]，表示只读数组或可变数组
 * @param index 要访问的索引位置，可以是负数，-n 表示从数组末尾数第 n 个元素
 * @returns 索引处的元素，如果索引有效；否则，返回 undefined
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

/**
 * 判断可迭代对象或类数组对象中的元素是否全部满足条件
 * 和 Array.every 不一样的是空数组默认返回 false
 * @param iterable 可迭代对象或类数组对象
 * @param fn 回调函数，用于判断元素是否满足条件，返回布尔值
 * @returns 若存在满足条件的元素，则返回true；否则返回false
 */
export function every<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => boolean): boolean {
  if (isNullish(iterable))
    return false
  if (Array.isArray(iterable))
    return isEmptyArray(iterable) ? false : iterable.every(fn)
  return every(Array.from(iterable), fn)
}

/**
 * 判断给定可迭代对象或类数组对象中是否至少有一个元素满足指定的测试函数
 *
 * @param iterable 可迭代对象或类数组对象
 * @param fn 测试函数，接收一个参数并返回一个布尔值
 * @returns 如果可迭代对象或类数组对象中至少有一个元素满足测试函数，则返回true；否则返回false
 */
export function some<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (val: T) => boolean): boolean {
  if (isNullish(iterable))
    return false

  return Array.isArray(iterable) ? iterable.some(fn) : Array.from(iterable).some(fn)
}

/**
 * 将给定的可迭代对象或类数组对象中的元素使用指定的函数进行累加，并返回累加结果。
 *
 * @template T 可迭代对象或类数组对象的元素类型。
 * @template U 累加函数的返回值类型。
 * @param iterable 要累加的可迭代对象或类数组对象。
 * @param fn 用于累加每个元素的函数。它接受四个参数：累加器的当前值（previousValue），可迭代对象的当前元素（currentValue），当前元素的索引（currentIndex），以及可迭代对象本身（array）。
 * @param initialValue 可选。累加器的初始值。如果未提供，则使用可迭代对象中的第一个元素作为初始值。
 * @returns 累加结果。
 */
export function reduce<T>(iterable: Iterable<T> | ArrayLike<T>, callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T
export function reduce<T>(iterable: Iterable<T> | ArrayLike<T>, callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T
export function reduce<T, U>(iterable: Iterable<T> | ArrayLike<T>, callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
export function reduce(iterable: Iterable<any> | ArrayLike<any>, fn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue?: any): any {
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

export function groupBy<T>(iterable: Iterable<T> | ArrayLike<T>, key: keyof T): Record<string, T[]>
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
 * Returns a new array with the elements sorted in ascending order.
 *
 * @category ArrayUtil
 */
export function toSorted<T>(iterable: Iterable<T> | ArrayLike<T>, compareFn?: (a: T, b: T) => number) {
  if (isNullish(iterable))
    return iterable

  return Array.from(iterable).sort(compareFn)
}
