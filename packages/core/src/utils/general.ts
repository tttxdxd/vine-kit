import { toTypeString } from './object'

export function NOOP() { }

/**
 * Always return false.
 */
export const NO = () => false

export const isNull = (val: unknown): val is null => val === null
export function notNull<T>(val: T | null): val is T extends null ? never : T {
  return val !== null
}

export function isUndefined(val: unknown): val is undefined {
  return typeof val === 'undefined'
}
export function notUndefined<T>(val: T | undefined): val is T extends undefined ? never : T {
  return typeof val !== 'undefined'
}

export function isNullish(val: unknown): val is null | undefined {
  return isUndefined(val) || isNull(val)
}

export function isEmpty(val?: ArrayLike<any>): val is undefined {
  return !val || val.length === 0
}

export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean'
}
export function isNumber(val: unknown): val is number {
  return typeof val === 'number'
}
export function isString(val: unknown): val is string {
  return typeof val === 'string'
}
export function isSymbol(val: unknown): val is symbol {
  return typeof val === 'symbol'
}
export function isFunction(val: unknown): val is (...args: any[]) => any {
  return typeof val === 'function'
}
export const isArray = Array.isArray
export function isObject(val: unknown): val is Record<any, any> {
  return val != null && typeof val === 'object'
}
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}
export const isNaN = (val: any): boolean => isNumber(val) && Number.isNaN(val)
export const isArrayLike = (val: any): val is ArrayLike<any> => !isNullish(val) && isNumber(val.length)

export const isConstructor = (val: any): boolean => val === 'constructor'
export function isInstanceOf<T extends new (...args: any[]) => any>(val: unknown, type: T, isStrict: boolean): boolean {
  if (!val || typeof val !== 'object')
    return false
  if (isStrict)
    return val.constructor === type
  return val instanceof type
}

export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]'
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]'
export const isRegExp = (val: unknown): val is RegExp => toTypeString(val) === '[object RegExp]'
export const isDate = (val: unknown): val is Date => toTypeString(val) === '[object Date]'
export function isWeakMap(val: unknown): val is WeakMap<object, any> {
  return toTypeString(val) === '[object WeakMap]'
}
export function isWeakSet(val: unknown): val is WeakSet<object> {
  return toTypeString(val) === '[object WeakSet]'
}
