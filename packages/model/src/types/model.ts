import type { Identity } from '@vine-kit/core'
import type { Schema } from '../schema'
import type { ValidationError } from '../error'
import type { MetaClass, MetaValue, toIMeta } from './meta'
import type { IsAsync } from './validator'

export interface ModelRawShape {
  [key: string]: ModelClass | MetaClass<any, any, any, any>
}

export type ModelViews<T extends ModelRawShape> = {
  [K in keyof T]: T[K] extends ModelClass<infer S> ? ModelViews<S> : T[K] extends MetaClass<any, any, any, any> ? toIMeta<T[K]> : never
}

export type ModelStore<T extends ModelRawShape> = {
  [K in keyof T]: T[K] extends ModelClass<infer S> ? ModelStore<S> : T[K] extends MetaClass<infer Z, any, any, any> ?
    MetaValue<Z>
    : never
}

export interface IModel<T extends ModelRawShape = any> {
  $parent?: IModel<any>
  $views: ModelViews<T>
  $store: ModelStore<T>
  $schema: Schema<T>
  error?: ValidationError

  reset(): void
  fromJSON<Self>(this: Self, json: PartialStore<T>): Self
  toJSON(): ModelStore<T>
  toParams(): any
  toFormData(): any
}

export type PartialStore<T extends ModelRawShape> = Identity<{
  [K in keyof T]?: T[K] extends ModelClass<any> ? ModelStore<T> : T[K] extends MetaClass<infer Z, any, any, any> ?
    MetaValue<Z>
    : never
}>

export interface ModelOptions {
  parent: ModelClass<any>
  keyPath: string
  scene?: string
}

type ExtractScenes<T extends ModelRawShape> = Exclude<T[keyof T]['$scenes'], undefined>
type ExtractedType<T, Shape extends ModelRawShape> = Identity<{
  [K in keyof T]: ModelClass<Shape>
}>

export type ModelIsAsync<T extends ModelRawShape> =
  T[keyof T] extends ModelClass<any, infer Async> ? Async : T[keyof T] extends MetaClass<any, any, any, infer V> ? IsAsync<V> : false

export type ModelClass<T extends ModelRawShape = any, Async = ModelIsAsync<T>> = {
  new(data?: PartialStore<T>, options?: ModelOptions): IModel<T> & ModelStore<T> & (Async extends true ? {
    validateAsync(): Promise<boolean>
  } : {
    validate(): boolean
    validateAsync(): Promise<boolean>
  })
} & { [K in keyof T]: T[K] }
& {
  $async: Async
  $scenes: ExtractedType<ExtractScenes<T>, T>
}
