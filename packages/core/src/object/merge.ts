import { type DeepPartial, isArray, isObject } from '@vine-kit/shared'

/**
 * Deep merge two objects
 *
 * @category ObjectUtil
 */
export function mergeDeep<T>(original: T, patch?: DeepPartial<T>, mergeArray = false): T {
  const o = original as any
  const p = patch as any

  if (isArray(p)) {
    if (mergeArray)
      return [...o, ...p] as any
    else
      return [...p] as any
  }

  const output = { ...o }
  if (isObject(o) && isObject(p)) {
    Object.keys(p).forEach((key) => {
      if (((isObject(o[key]) && isObject(p[key]))))
        output[key] = mergeDeep(o[key], p[key], mergeArray)
      else
        output[key] = p[key]
    })
  }
  return output
}
