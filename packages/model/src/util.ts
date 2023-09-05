import * as z from 'zod'

export type identity<T> = T

export function getDefaultValue<T extends z.ZodDefault<any>>(type: T): z.infer<T> {
  if (type._def.typeName !== z.ZodFirstPartyTypeKind.ZodDefault)
    throw new Error('getDefaultValue: type is not ZodDefault')

  return type.parse(undefined)
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
