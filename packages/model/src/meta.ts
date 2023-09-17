import { define, defineLazy } from '@vine-kit/core'

import type { IMeta, IMetaOptions, IMetaRawOptions, MetaClass, MetaType, MetaValue } from './types/meta'
import { getDefaultValue, toParsedType, validateMetaType } from './util'
import type { IModel } from './types/model'
import { Validator } from './validator'
import { type Issue, IssueCode } from './types/schema'
import { errorMap } from './locales'

const MetaSymbol: unique symbol = Symbol('MetaSymbol')
export const MetaValueSymbol: unique symbol = Symbol('MetaValueSymbol')

export function isMetaClass(value: any): value is MetaClass {
  return value && value[MetaSymbol]
}

export class Meta<T extends MetaType> {
  private readonly shape: any

  /**
   * 初始化 meta 值
   */
  [MetaValueSymbol](newVal?: MetaValue<T>) {
    if (this.shape.computed)
      return this.shape.computed
    return {
      value: newVal ?? this.shape.default ?? getDefaultValue(this.type),
      writable: true,
      enumerable: true,
      configurable: true,
    }
  }

  constructor(options: IMetaOptions<T>) {
    if (!options.type)
      throw new Error('Meta: type is required')

    if (options.default && !validateMetaType(options.default, options.type))
      throw new Error('Meta: default value is invalid')

    const { type, model } = options

    const required = options.required ?? false
    const readonly = options.readonly ?? false
    const disabled = options.disabled ?? false
    const hidden = options.hidden ?? false
    const validators = [Validator.fromMeta(type), ...(options.validators ?? [])]

    this.shape = {
      type,
      default: options.default,
      computed: options.computed?.bind(model),
      formatter: options.formatter,
      model,
    }

    this.prop = options.prop ?? ''
    this.label = options.label ?? ''

    defineLazy(this, 'value', this[MetaValueSymbol].bind(this))
    define(this, 'required', required)
    define(this, 'readonly', readonly)
    define(this, 'disabled', disabled)
    define(this, 'hidden', hidden)
    define(this, 'validators', validators)
    define(this, 'formatter', {
      value: this.shape.formatter?.bind(model),
    })
    define(this, 'from', {
      value: options.from?.bind(model),
    })
    define(this, 'to', {
      value: options.to?.bind(model),
    })
  }

  prop!: string
  label!: string
  value!: MetaValue<T>
  error?: string
  issue?: Issue
  validators!: Validator[]

  get type() {
    return this.shape.type
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
    this.issue = Validator.validate(this.validators, val, [key])
    this.error = this.issue?.message

    return !this.issue
  }

  static isMetaClass: typeof isMetaClass = isMetaClass
  static isMeta(val: unknown): val is IMeta<any> {
    return val instanceof Meta
  }
}

/**
 * 字段元数据类型
 * @param shape
 * @returns
 */
export function meta<
  T extends MetaType,
>(shape: IMetaOptions<T>): MetaClass<T> {
  class _Meta extends Meta<T> {
    static readonly [MetaSymbol] = true

    constructor(newShape?: any) {
      super({ ...shape, ...newShape })
    }

    static extend(newShape: any) {
      return meta({ ...shape, ...newShape })
    }

    static default(val: any) {
      return meta({ ...shape, default: val })
    }

    static label(val: string) {
      return meta({ ...shape, label: val })
    }

    static readonly(val: boolean = true) {
      return meta({ ...shape, readonly: val })
    }

    static disabled(val: boolean = true) {
      return meta({ ...shape, disabled: val })
    }

    static hidden(val: boolean = true) {
      return meta({ ...shape, hidden: val })
    }

    static required(val: boolean = true) {
      return meta({ ...shape, required: val })
    }
  }

  return _Meta as any
}

export function string(val: string = '') {
  return meta({ type: String, default: val })
}

export function number(val: number = 0) {
  return meta({ type: Number, default: val })
}

export function boolean(val: boolean = false) {
  return meta({ type: Boolean, default: val })
}
