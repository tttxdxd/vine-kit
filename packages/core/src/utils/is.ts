import { toString } from './object'

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
export const isArray = Array.isArray
export function isObject(val: unknown): val is Record<any, any> {
  return val != null && typeof val === 'object' && !isArray(val)
}
export function isFunction(val: unknown): val is (...args: any[]) => any {
  return typeof val === 'function'
}
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}
export const isNaN = (val: any): boolean => isNumber(val) && Number.isNaN(val)

export const isConstructor = (val: any): boolean => val === 'constructor'
export function isInstanceOf<T extends new (...args: any[]) => any>(val: unknown,
  type: T,
  isStrict: boolean): boolean {
  if (!val || typeof val !== 'object')
    return false
  if (isStrict)
    return val.constructor === type
  return val instanceof type
}

export const isPlainObject = (val: unknown): val is object => toString(val) === '[object Object]'

export function noop() { }
