import { isObject, isString } from '@vine-kit/shared'

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
