import { define } from '@vine-kit/core'
import { Meta, MetaValueSymbol } from './meta'
import type { ModelClass, ModelOptions, ModelRawShape, ModelStore, ModelViews, PartialStore } from './types/model'
import { bind } from './util'

const ModelSymbol: unique symbol = Symbol('ModelSymbol')
const ModelShapeSymbol = Symbol('ModelShapeSymbol')

export function isModelClass(value: any): value is ModelClass<any, any> {
  return value && value[ModelSymbol]
}

export class Model<
  T extends ModelRawShape, Views extends ModelViews<T> = ModelViews<T>, Store extends ModelStore<T> = ModelStore<T>,
> {
  protected _views!: Views
  protected _store!: Store
  protected _parent?: ModelClass<any>
  protected _keyPath?: string

  get $keyPath() {
    return this._keyPath
  }

  get $parent() {
    return this._parent
  }

  get $root() {
    let temp = this.$parent

    while (temp?.$parent)
      temp = temp.$parent

    return temp
  }

  get $views() {
    return this._views
  }

  get $store() {
    return this._store
  }

  validate() {

  }

  fromJSON(json: PartialStore<T>) {
    const result: any = {}
    const keys = Object.keys(json)

    while (keys.length) {
      const key = keys.shift()!
      const view = this.$views[key]

      if (!view)
        continue;
      (this._store as any)[key] = view?.fromJSON?.call(this, json[view.prop]) ?? json[view.prop]
    }

    return this
  }

  toJSON(): Store {
    const result: any = {}
    const keys = Object.keys(this.$views)

    while (keys.length) {
      const key = keys.shift()!
      const view = this.$views[key]

      result[key] = view?.toJSON?.(view.value) ?? view.value
    }

    return result
  }

  toParams() {

  }

  toFormData() {

  }

  static isModel: typeof isModelClass = isModelClass
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
      const keys = Object.keys(shape)

      this._views = $views
      this._store = $store
      this._parent = $parent
      this._keyPath = $keyPath

      for (const key of keys) {
        const Constructor = shape[key]
        const defaultValue = data?.[key]

        if (Meta.isMeta(Constructor)) {
          const meta = new Constructor({ model: this, prop: key })

          $views[key] = meta

          define($store, key, (meta as any)[MetaValueSymbol](defaultValue))
          bind($store, key, meta, 'value')
          bind($store, key, this)
        }
        else if (Model.isModel(Constructor)) {
          const model = new Constructor(defaultValue, {
            parent: this as any,
            keyPath: key,
          })
        }
      }
    }
  }

  return _Model as any
}
