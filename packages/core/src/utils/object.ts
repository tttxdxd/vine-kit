import type { DeepPartial } from '../types'
import { isArray, isObject, isPlainObject } from './is'

/**
 * Determines whether an object has a property with the specified name.
 * @param val
 * @param propertyKey — A property name.
 * @returns
 */
export const hasOwn = (val: unknown, propertyKey: string): boolean => Object.prototype.hasOwnProperty.call(val, propertyKey)
/**
 * Returns a string representation of an object.
 * @param val
 * @returns
 */
export const toString = (val: unknown): string => Object.prototype.toString.call(val)

/**
 * Deep merge two objects
 */
export function mergeDeep<T>(original: T, patch: DeepPartial<T>, mergeArray = false): T {
  const o = original as any
  const p = patch as any

  if (isArray(p)) {
    if (mergeArray && isArray(p))
      return [...o, ...p] as any
    else
      return [...p] as any
  }

  const output = { ...o }
  if (isObject(o) && isObject(p)) {
    Object.keys(p).forEach((key) => {
      if (((isObject(o[key]) && isObject(p[key])) || (isArray(o[key]) && isArray(p[key]))))
        output[key] = mergeDeep(o[key], p[key], mergeArray)
      else
        Object.assign(output, { [key]: p[key] })
    })
  }
  return output
}

export function clone<T>(val: T): T {
  let k: any, out: any, tmp: any

  if (Array.isArray(val)) {
    out = Array(k = val.length)
    // eslint-disable-next-line no-cond-assign
    while (k--) out[k] = ((tmp = val[k]) && typeof tmp === 'object') ? clone(tmp) : tmp
    return out as any
  }

  if (isPlainObject(val)) {
    out = {} // null
    for (k in val) {
      if (k === '__proto__') {
        Object.defineProperty(out, k, {
          value: clone((val as any)[k]),
          configurable: true,
          enumerable: true,
          writable: true,
        })
      }
      else {
        // eslint-disable-next-line no-cond-assign
        out[k] = ((tmp = (val as any)[k]) && typeof tmp === 'object') ? clone(tmp) : tmp
      }
    }
    return out
  }

  return val
}
