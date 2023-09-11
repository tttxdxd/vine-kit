import type { z } from 'zod'
import type { identity } from '../util'
import type { Schema } from '../schema'
import type { MetaClass, toIMeta } from './meta'

export interface ModelRawShape {
  [key: string]: ModelClass<any> | MetaClass<any, any>
}

export type ModelViews<T extends ModelRawShape> = identity<{
  [K in keyof T]: T[K] extends ModelClass<any> ? T[K]['$views'] : T[K] extends MetaClass<any, any> ? toIMeta<T[K]> : never
}>

export type ModelStore<T extends ModelRawShape> = identity<{
  [K in keyof T]: T[K] extends ModelClass<any, infer Store> ? Store : T[K] extends MetaClass<infer Z, any> ?
    z.infer<Z>
    : never
}>

export interface IModel<T extends ModelRawShape, Views = ModelViews<T>, Store = ModelStore<T>> {
  $parent?: IModel<any>
  $views: Views
  $store: Store
  $schema: Schema
  error: z.ZodError<any>

  fromJSON<Self>(this: Self, json: PartialStore<T>): Self
  toJSON(): Store
  toParams(): any
  toFormData(): any
  validate(): boolean
}

export type PartialStore<T extends ModelRawShape> = identity<{
  [K in keyof T]?: T[K] extends ModelClass<any, infer Store> ? Store : T[K] extends MetaClass<infer Z, any> ?
    z.infer<Z>
    : never
}>

export interface ModelOptions {
  parent: ModelClass<any>
  keyPath: string
}

export type ModelClass<T extends ModelRawShape, Views extends ModelViews<T> = ModelViews<T>, Store extends ModelStore<T> = ModelStore<T>> = {
  new(data?: PartialStore<T>, options?: ModelOptions): IModel<T, Views, Store> & Store
} & { [K in keyof T]: T[K] }
