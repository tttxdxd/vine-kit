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
 * 将嵌套数组展平为一维数组
 *
 * @param val 要展平的数组
 * @param depth 展平的深度，默认为1
 * @returns 返回展平后的一维数组
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
 * @returns {T|undefined} 索引处的元素，如果索引有效；否则，返回 undefined
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
 * @returns 累加结果。
 */
export function reduce<T>(iterable: Iterable<T> | ArrayLike<T>, callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T
export function reduce<T>(iterable: Iterable<T> | ArrayLike<T>, callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T
export function reduce<T, U>(iterable: Iterable<T> | ArrayLike<T>, callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
export function reduce(iterable: Iterable<any> | ArrayLike<any>, fn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue?: any): any {
  return Array.isArray(iterable) ? iterable.reduce(fn, initialValue) : Array.from(iterable).reduce(fn, initialValue)
}

/**
 * Creates an object composed of keys generated from the results of running each element of the iterable
 * through the given key function. The order of grouped values is determined by the order they occur in the iterable.
 * The resulting object has each key's value as an array of elements responsible for generating the key.
 * However, this implementation differs slightly in that it only keeps the last encountered value for each key,
 * overwriting previous values for the same key.
 *
 * @param iterable The iterable or array-like object to iterate over.
 * @param keyFn The function invoked per iteration or the property name to use as the key.
 *               If a function is provided, it is invoked with the current value as the argument and its return value is used as the key.
 *               If a string (representing a property name) is provided, the value of the property on the current value is used as the key.
 * @returns Returns the composed aggregate object.
 */
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
 * Groups elements of an iterable or array-like object into a record by the specified key function or property name.
 *
 * @param iterable The iterable or array-like object to be grouped.
 * @param keyFn A function that returns a string key for each element, or a string representing the property name to use as the key.
 * @returns A record where each key is the result of the key function or property name applied to an element,
 *          and each value is an array of elements that map to that key.
 *
 * @example
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 25 }
 * ];
 *
 * // Using a function as the key
 * const groupedByAge = groupBy(people, person => `${person.age}`);
 * console.log(groupedByAge); // { "25": [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }], "30": [{ name: 'Bob', age: 30 }] }
 *
 * // Using a property name as the key
 * const groupedByName = groupBy(people, 'name');
 * console.log(groupedByName); // { Alice: [{ name: 'Alice', age: 25 }], Bob: [{ name: 'Bob', age: 30 }], Charlie: [{ name: 'Charlie', age: 25 }] }
 */
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
