import { Type, VineType } from './vine'
import type { TypeOf, VineFieldCtor } from './vine'

export class VineMeta extends VineType {
  declare readonly [Type]: TypeOf<this['type']>

  declare type: VineFieldCtor
  declare descriptors: {}
  declare groups: {}

  static extend<
    T extends new () => VineMeta,
    EU extends Record<string, any>,
    EG extends Record<string, any>,
  >(this: T,
    descriptors: EU = {} as EU,
    groups: EG = {} as EG,
  ) {
    return meta(this.prototype.type, descriptors, groups)
  }
}

export function meta<
  T extends VineFieldCtor,
  U extends Record<string, any> = {},
  G extends Record<string, any> = {},
>(type: T, descriptors: U = {} as U, groups: G = {} as G) {
  return class Meta extends VineMeta {
    type = type
    descriptors = descriptors
    groups = groups
  }
}

export type VineModelField = VineMeta | VineFieldCtor
export interface VineModelFields {
  [key: string]: VineModelField
}
export type TypeOfFields<T extends VineModelFields> = {
  [K in keyof T]: TypeOf<T[K]>
}

abstract class VineSchema extends VineType {
  declare readonly [Type]: TypeOfFields<this['fields']>
  declare fields: VineModelFields
}

export function schema<
  T extends VineModelFields,
  U extends Record<string, any> = {},
>(fields: T, descriptors: U = {} as U) {
  return class Model extends VineSchema {
    fields = fields
    static fields = fields
    static descriptors = descriptors
  }
}
