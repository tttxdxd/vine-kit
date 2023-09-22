import { isBoolean, isNumber, isString, isUndefined } from '@vine-kit/core'
import type { MetaType, MetaValueToType } from './types/meta'
import { ParsedType } from './locales'

export function validateMetaType(val: string | number | boolean, type: MetaType) {
  return (val).constructor === type
}

export function getDefaultValue(type: MetaType) {
  return type.prototype.valueOf()
}

export function toMetaType<T extends string | number | boolean>(val: T): MetaValueToType<T> {
  return (val).constructor as any
}

export function toParsedType(val: unknown): ParsedType {
  if (isUndefined(val))
    return ParsedType.undefined
  if (isString(val))
    return ParsedType.string
  if (isNumber(val))
    return ParsedType.number
  if (isBoolean(val))
    return ParsedType.boolean

  return ParsedType.unknown
}

/**
 * 双向绑定
 */
export function bind(origin: any, key: string, target: any, targetKey: string = key) {
  Object.defineProperty(target, targetKey, {
    get() {
      return origin[key]
    },
    set(value) {
      origin[key] = value
    },
  })
}

export function joinValues<T extends any[]>(
  array: T,
  separator = ' | ',
): string {
  return array
    .map(val => (typeof val === 'string' ? `'${val}'` : val))
    .join(separator)
}
