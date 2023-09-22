import { define, defineLazy, flatten, get, last, notUndefined, set, some, unique } from '@vine-kit/core'
import { Meta, MetaValueSymbol } from './meta'
import type { IModel, ModelClass, ModelIsAsync, ModelOptions, ModelRawShape, ModelStore, ModelViews, PartialStore } from './types/model'
import type { ValidationError } from './error'
import { Schema } from './schema'
import { bind } from './util'

const ModelSymbol: unique symbol = Symbol('ModelSymbol')

export function isModelClass(value: any): value is ModelClass {
  return value && value[ModelSymbol]
}

export class Model<
  T extends ModelRawShape,
> implements IModel<T> {
  readonly $views!: ModelViews<T>
  readonly $store!: ModelStore<T>
  readonly $parent!: IModel
  readonly $keyPath!: string
  readonly $schema!: Schema
  error?: ValidationError

  get $root() {
    let temp = this.$parent

    while (temp?.$parent)
      temp = temp.$parent

    return temp
  }

  reset() {
    this.$schema.each((meta, path) => {
      set(this.$store, path, meta.default)

      return true
    })
  }

  fromJSON(json: PartialStore<T>) {
    this.$schema.each((meta, path) => {
      const value = get(json, path) ?? meta?.from?.(meta.value)

      if (notUndefined(value))
        set(this.$store, path, value)

      return true
    })
    return this as any
  }

  toJSON(): ModelStore<T> {
    const result: any = {}
    this.$schema.each((meta, path) => {
      const value = meta?.to?.(meta.value, last(path)) ?? meta.value

      set(result, path, value)
      return true
    })

    return result
  }

  toParams() {

  }

  toFormData() {

  }

  static isModelClass: typeof isModelClass = isModelClass
  static isModel(val: any): val is IModel<any> {
    return val instanceof Model
  }
}

export function model<T extends ModelRawShape, Async = ModelIsAsync<T>>(shape: T): ModelClass<T, Async>
export function model<T extends ModelRawShape, Async = ModelIsAsync<T>>(shape: T, options: { scene?: string }): ModelClass<T, Async>
export function model<T extends ModelRawShape, Async = ModelIsAsync<T>>(shape: T, options?: { scene?: string }): ModelClass<T, Async> {
  const scene = options?.scene

  class _Model extends Model<any> {
    static readonly [ModelSymbol] = true

    constructor(data?: any, options?: ModelOptions) {
      super()

      const $parent = options?.parent
      const $keyPath = options?.keyPath ?? ''
      const $views = $parent ? ($parent.$views[$keyPath] = $parent.$views[$keyPath] ?? {}) : {}
      const $store = $parent ? ($parent.$store[$keyPath] = $parent.$store[$keyPath] ?? {}) : {}
      const $schema = new Schema(this as any)
      const keys = Object.keys(shape)

      define(this, '$parent', { value: $parent })
      define(this, '$views', { value: $views })
      define(this, '$store', { value: $store })
      define(this, '$keyPath', { value: $keyPath })
      define(this, '$schema', { value: $schema })

      for (const key of keys) {
        const Constructor = shape[key]
        const defaultValue = data?.[key]

        if (Meta.isMetaClass(Constructor)) {
          const meta = new Constructor({
            model: this as any,
            prop: key,
            scene,
          })

          $views[key] = meta

          define($store, key, (meta as any)[MetaValueSymbol](defaultValue))
          bind($store, key, meta, 'value')
          bind($store, key, this)
        }
        else if (Model.isModelClass(Constructor)) {
          const model = new Constructor(defaultValue, {
            parent: this as any,
            keyPath: key,
            scene,
          })

          define(this, key, { value: model })
        }
      }
    }

    validate() {
      return this.$schema.validate(this.$store)
    }

    async validateAsync() {
      return this.$schema.validateAsync(this.$store)
    }
  }

  const async = some(Object.values(shape), v => Boolean(v.$async))

  if (async)
    delete (_Model.prototype as any).validate

  define(_Model, '$async', async)
  defineLazy(_Model, '$scenes', () => {
    const $scenes: any = {}
    const keys = unique(flatten(Object.values(shape).map(v => Object.keys(v.$scenes))))

    if (keys.length) {
      for (const key of keys)
        $scenes[key] = model(shape, { scene: key })
    }
    return $scenes
  })

  return _Model as any
}
