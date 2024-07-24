import type { DeepPartial } from '../types'
import { isArray, isFunction, isObject, isPlainObject, isString } from './general'

/**
 * Determines whether an object has a property with the specified name.
 *
 * @category ObjectUtil
 * @param val
 * @param key — A property name.
 */
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val => Object.prototype.hasOwnProperty.call(val, key)
export const objectToString = Object.prototype.toString

/**
 * Converts a type of value to a string.
 *
 * @category ObjectUtil
 */
export const toTypeString = (val: unknown): string => objectToString.call(val)

/**
 * Checks if an object is empty.
 *
 * @category ObjectUtil
 */
export function isEmptyObject(val: object): boolean {
  // eslint-disable-next-line no-unreachable-loop
  for (const _ in val)
    return false
  return true
}

/**
 * Deep merge two objects
 *
 * @category ObjectUtil
 */
export function mergeDeep<T>(original: T, patch?: DeepPartial<T>, mergeArray = false): T {
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

  if (isArray(val)) {
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

/**
 * Retrieves a value from an object using a path.
 *
 * @category ObjectUtil
 */
export function get(object: any, path: string | string[], defaultValue?: any) {
  if (object == null)
    return defaultValue

  const keys = isString(path) ? path.split('.') : [...path]
  let result = object
  for (const key of keys) {
    if (!isObject(result))
      break
    result = result[key]
  }
  return result === undefined ? defaultValue : result
}

/**
 * Sets a value from an object using a path.
 *
 * @category ObjectUtil
 */
export function set(object: any, path: string | string[], value: any) {
  if (object == null)
    return

  const keys = isString(path) ? path.split('.') : [...path]
  let result = object
  for (const key of keys) {
    if (!isObject(result[key]))
      break
    result = result[key]
  }
  result[keys[keys.length - 1]] = value
  return true
}

/**
 * Adds a property to an object, or modifies attributes of an existing property.
 *
 * @category ObjectUtil
 * @param o Object on which to add or modify the property. This can be a native JavaScript object (that is, a user-defined object or a built in object) or a DOM object.
 * @param p The property name.
 * @param value The value to be assigned to the property. This can be either a property descriptor object or a getter function.
 */
export function define(o: any, p: PropertyKey, value: (PropertyDescriptor & ThisType<any> | (() => any))) {
  if (isFunction(value)) {
    Object.defineProperty(o, p, {
      get() { return value() },
    })
  }
  else if (isPlainObject(value)) {
    if (hasOwn(value, 'get') || hasOwn(value, 'set') || hasOwn(value, 'value'))
      Object.defineProperty(o, p, value)
    else
      Object.defineProperty(o, p, { value })
  }
  else { Object.defineProperty(o, p, { value }) }
}

/**
 * Defines a lazy property in an object.
 *
 * @category ObjectUtil
 */
export function defineLazy(o: any, p: PropertyKey, initail: () => any) {
  Object.defineProperty(o, p, {
    get() {
      const temp = initail()
      define(o, p, temp)
      return isFunction(temp) ? temp() : hasOwn(temp, 'value') ? temp.value : temp
    },
    set(v) {
      o[p] = v
    },
    configurable: true,
  })
}
