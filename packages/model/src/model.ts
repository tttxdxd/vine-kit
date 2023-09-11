import { define } from '@vine-kit/core'
import { Meta, MetaValueSymbol } from './meta'
import type { IModel, ModelClass, ModelOptions, ModelRawShape, ModelStore, ModelViews, PartialStore } from './types/model'
import { Schema } from './schema'
import { bind } from './util'

const ModelSymbol: unique symbol = Symbol('ModelSymbol')
const ModelShapeSymbol = Symbol('ModelShapeSymbol')

export function isModelClass(value: any): value is ModelClass<any, any> {
  return value && value[ModelSymbol]
}

export class Model<
  T extends ModelRawShape, Views extends ModelViews<T> = ModelViews<T>, Store extends ModelStore<T> = ModelStore<T>,
> {
  readonly $views!: Views
  readonly $store!: Store
  readonly $parent!: ModelClass<any>
  readonly $keyPath!: string
  private $schema!: Schema

  get $root() {
    let temp = this.$parent

    while (temp?.$parent)
      temp = temp.$parent

    return temp
  }

  validate() {
    return this.$schema.validate(this.$store)
  }

  fromJSON(json: PartialStore<T>) {
    const keys = Object.keys(json)

    for (const key of keys) {
      const view = this.$views[key]

      if (!view)
        continue

      (this.$store as any)[key] = view?.fromJSON?.call(this, json[view.prop]) ?? json[view.prop]
    }

    return this
  }

  toJSON(): Store {
    const result: any = {}
    const keys = Object.keys(this.$views)

    for (const key of keys) {
      const view = this.$views[key]

      result[key] = view?.toJSON?.(view.value) ?? view.value
    }

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

export function model<T extends ModelRawShape, Views extends ModelViews<T>, Store extends ModelStore<T> = ModelStore<T>>(shape: T): ModelClass<T, Views, Store> {
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

      define(this, '$views', { value: $views })
      define(this, '$store', { value: $store })
      define(this, '$parent', { value: $parent })
      define(this, '$keyPath', { value: $keyPath })
      define(this, '$schema', { value: $schema })

      for (const key of keys) {
        const Constructor = shape[key]
        const defaultValue = data?.[key]

        if (Meta.isMetaClass(Constructor)) {
          const meta = new Constructor({ model: this, prop: key })

          $views[key] = meta
          $schema.attach(key, meta)

          define($store, key, (meta as any)[MetaValueSymbol](defaultValue))
          bind($store, key, meta, 'value')
          bind($store, key, this)
        }
        else if (Model.isModelClass(Constructor)) {
          const model = new Constructor(defaultValue, {
            parent: this as any,
            keyPath: key,
          })

          define(this, key, { value: model })
          $schema.attach(key, model)
        }
      }
    }
  }

  return _Model as any
}
