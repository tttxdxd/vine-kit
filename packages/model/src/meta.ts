import type * as z from 'zod'
import { define, defineLazy } from '@vine-kit/core'

import { getDefaultValue } from './util'
import type { IMeta, MetaClass, MetaRawOptions, MetaRawShape } from './types/meta'

const MetaSymbol: unique symbol = Symbol('MetaSymbol')
export const MetaValueSymbol: unique symbol = Symbol('MetaValueSymbol')

export function isMetaClass(value: any): value is MetaClass<any, any> {
  return value && value[MetaSymbol]
}

export class Meta<
  Z extends z.ZodTypeAny,
  Shape extends MetaRawShape<Z>,
  Model = undefined,
> implements IMeta<Z, Shape> {
  readonly shape: Shape

  /**
   * 初始化 meta 值
   */
  [MetaValueSymbol](newVal?: z.infer<Z>) {
    if (this.shape.computed)
      return this.shape.computed
    return {
      value: newVal ?? this.shape.default ?? getDefaultValue(this.type as any),
      writable: true,
      enumerable: true,
      configurable: true,
    }
  }

  constructor(options: MetaRawOptions<Z>) {
    if (!options.type)
      throw new Error('Meta: type is required')

    if (options.default && !options.type.safeParse(options.default).success)
      throw new Error('Meta: default value is invalid')

    const { type, required, readonly, disabled, hidden, model } = options

    this.shape = {
      type,
      default: options.default,
      computed: options.computed?.bind(model),

      required: required ?? false,
      readonly: readonly ?? false,
      disabled: disabled ?? false,
      hidden: hidden ?? false,
      formatter: options.formatter,
      fromJSON: options.fromJSON,
      toJSON: options.toJSON,
      model,
    } as unknown as Shape

    this.prop = options.prop ?? ''
    this.label = options.label ?? ''

    defineLazy(this, 'value', this[MetaValueSymbol].bind(this))
    define(this, 'formatter', {
      value: this.shape.formatter?.bind(model),
    })
    define(this, 'fromJSON', {
      value: this.shape.fromJSON?.bind(model),
    })
    define(this, 'toJSON', {
      value: this.shape.toJSON?.bind(model),
    })
  }

  prop!: string
  label!: string
  value!: z.infer<Z>

  get type() {
    return this.shape.type
  }

  get default() {
    return this.shape.default
  }

  get required() {
    return this.shape.required
  }

  get readonly() {
    return this.shape.readonly
  }

  get disabled() {
    return this.shape.disabled
  }

  get hidden() {
    return this.shape.hidden
  }

  get model() {
    return this.shape.model!
  }

  get text() {
    if (this.shape.formatter)
      return this.shape.formatter(this.value, this.prop)

    return String(this.value)
  }

  validate(val: any, key: string) {

  }

  static isMeta: typeof isMetaClass = isMetaClass
}

/**
 * 字段元数据类型
 * @param shape
 * @returns
 */
export function meta<
  Z extends z.ZodTypeAny,
  Shape extends MetaRawShape<Z>,
>(shape: MetaRawOptions<Z>): MetaClass<Z, Shape> {
  class _Meta extends Meta<any, any> {
    static readonly [MetaSymbol] = true

    constructor(newShape?: any) {
      super({ ...shape, ...newShape })
    }

    static extend(newShape: any) {
      return meta({ ...shape, ...newShape })
    }

    static default(val: boolean) {
      return meta({ ...shape, default: val })
    }

    static label(val: string) {
      return meta({ ...shape, label: val })
    }

    static readonly(val: boolean) {
      return meta({ ...shape, readonly: val })
    }

    static disabled(val: boolean) {
      return meta({ ...shape, disabled: val })
    }

    static hidden(val: boolean) {
      return meta({ ...shape, hidden: val })
    }

    static required(val: boolean) {
      return meta({ ...shape, default: val })
    }
  }

  return _Meta as any
}
