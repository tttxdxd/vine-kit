import type { Identity } from '@vine-kit/core'
import type { Schema, ValidationError } from '../schema'
import type { MetaClass, MetaValue, toIMeta } from './meta'

export interface ModelRawShape {
  [key: string]: ModelClass | MetaClass
}

export type ModelViews<T extends ModelRawShape> = {
  [K in keyof T]: T[K] extends ModelClass<infer S> ? ModelViews<S> : T[K] extends MetaClass ? toIMeta<T[K]> : never
}

export type ModelStore<T extends ModelRawShape> = {
  [K in keyof T]: T[K] extends ModelClass<infer S> ? ModelStore<S> : T[K] extends MetaClass<infer Z> ?
    MetaValue<Z>
    : never
}

export interface IModel<T extends ModelRawShape = any> {
  $parent?: IModel<any>
  $views: ModelViews<T>
  $store: ModelStore<T>
  $schema: Schema
  error?: ValidationError

  fromJSON<Self>(this: Self, json: PartialStore<T>): Self
  toJSON(): ModelStore<T>
  toParams(): any
  toFormData(): any
  validate(): boolean
}

export type PartialStore<T extends ModelRawShape> = Identity<{
  [K in keyof T]?: T[K] extends ModelClass<any> ? ModelStore<T> : T[K] extends MetaClass<infer Z> ?
    MetaValue<Z>
    : never
}>

export interface ModelOptions {
  parent: ModelClass<any>
  keyPath: string
}

export type ModelClass<T extends ModelRawShape = any> = {
  new(data?: PartialStore<T>, options?: ModelOptions): IModel<T> & ModelStore<T>
} & { [K in keyof T]: T[K] }
