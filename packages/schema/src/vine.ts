import { isBoolean, isBooleanConstructor, isFloat, isInterger, isNumber, isNumberConstructor, isString, isStringConstructor } from '@vine-kit/core'
import type { BasicCtor } from './types'

export const Type = '__type__' as const

export type TypeOf<T extends VineFieldCtor | VineType> =
  T extends BasicCtor ? ReturnType<T> :
    T extends new () => { __type__: infer U } ? U :
      T extends VineType ? T['__type__'] :
        never

export abstract class VineType {
  abstract readonly [Type]: unknown

  static create<T extends VineCtor>(this: T, value: TypeOf<T>) {
    return value
  }

  static validate(_: unknown): boolean {
    return true
  }
}

export type VineCtor<T extends VineType = VineType> = (new () => T)
export type VineFieldCtor = BasicCtor | VineCtor

export class Number extends VineType {
  declare readonly [Type]: number
  static validate = isNumber
}
export class String extends VineType {
  declare readonly [Type]: string
  static validate = isString
}
export class Boolean extends VineType {
  declare readonly [Type]: boolean
  static validate = isBoolean
}
export class Int extends VineType {
  declare readonly [Type]: number
  static validate = isInterger
}
export class Float extends VineType {
  declare readonly [Type]: number
  static validate = isFloat
}

export type SchemaField<T extends object, key extends keyof T> =
  key extends '__type__' ? never : T[key] extends undefined
    ? never : T[key] extends VineFieldCtor | undefined
      ? key : never

export type TypeOfField<T> = T extends VineFieldCtor
  ? TypeOf<T>
  : T extends undefined
    ? undefined
    : never
export abstract class ObjectType extends VineType {
  declare readonly [Type]: {
    [key in keyof this as SchemaField<this, key>]: TypeOfField<this[key]>
  }
}

export abstract class ListType extends VineType {
  readonly [Type]!: TypeOf<this['value']>[]
  abstract value: VineFieldCtor
}

export function List<T extends VineFieldCtor>(item: T) {
  return class List extends ListType {
    value = item
  }
}

export type Literals = number | string | boolean | null | undefined
export abstract class LiteralType extends VineType {
  readonly [Type]!: this['value']
  abstract value: Literals
}
export function Literal<T extends Literals>(item: T) {
  return class Literal extends LiteralType {
    value = item
  }
}

export const Null = Literal(null)
export const Undefined = Literal(undefined)

export abstract class UnionType extends VineType {
  declare readonly [Type]: TypeOf<this['value'][number]>
  abstract value: VineFieldCtor[]
}

export function Union<T extends VineFieldCtor[]>(...items: T) {
  return class Union extends UnionType {
    value = items
  }
}

export function Optional<T extends VineFieldCtor>(item: T) {
  return Union(item, Undefined)
}

export function Nullable<T extends VineFieldCtor>(item: T) {
  return Union(item, Null)
}

export function isVineType(input: any): input is new () => VineType {
  return input?.prototype instanceof VineType
}

export type InstanceTypeOf<T extends VineFieldCtor> =
  T extends NumberConstructor ? Number
    : T extends StringConstructor ? String
      : T extends BooleanConstructor ? Boolean
        : T extends new () => infer R ? R : never

const instanceWeakMap = new WeakMap<VineFieldCtor, VineType>()
export function getInstance<T extends VineFieldCtor>(Ctor: T): InstanceTypeOf<T> {
  if (isNumberConstructor(Ctor))
    return getInstance(Number) as InstanceTypeOf<T>
  if (isStringConstructor(Ctor))
    return getInstance(String) as InstanceTypeOf<T>
  if (isBooleanConstructor(Ctor))
    return getInstance(Boolean) as InstanceTypeOf<T>

  if (instanceWeakMap.has(Ctor))
    return instanceWeakMap.get(Ctor) as InstanceTypeOf<T>

  const instance = new Ctor()

  instanceWeakMap.set(Ctor, instance as VineType)

  return instance as InstanceTypeOf<T>
}

export function toVineType() {

}
