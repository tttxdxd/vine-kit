import type { NonEmptyArray } from '@vine-kit/core'
import { define, defineLazy, isFunction, isUndefined, keyBy } from '@vine-kit/core'

import type { IMeta, IMetaOptions, IMetaRawOptions, IMetaScenes, MetaClass, MetaType, MetaValue, MetaValueToType } from './types/meta'
import { type Issue } from './types/schema'
import { getDefaultValue, toMetaType, validateMetaType } from './util'
import { Validator } from './validator'

const MetaSymbol: unique symbol = Symbol('MetaSymbol')
export const MetaValueSymbol: unique symbol = Symbol('MetaValueSymbol')

export function isMetaClass(value: any): value is MetaClass<any> {
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

  constructor(options: IMetaOptions<T>, scenes?: IMetaScenes<T>) {
    if (options.scene)
      options = scenes?.[options.scene] ? { ...options, ...scenes[options.scene] } : options

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
    define(this, 'label', isFunction(options.label) ? () => (options.label as ((...args: any[]) => string))!.call(model, this.value, this.prop) : options.label ?? '')

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
    define(this, 'options', {
      value: options.options,
    })
  }

  prop!: string
  label!: string
  value!: MetaValue<T>
  error?: string
  issue?: Issue
  validators!: Validator[]

  required!: boolean
  readonly!: boolean
  disabled!: boolean
  hidden!: boolean

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
    if (isUndefined(val) && !this.required)
      return true

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
export function meta<T extends MetaType, Options = never>(shape: IMetaOptions<T, Options>): MetaClass<T>
export function meta<
  T extends MetaType,
  Scenes extends IMetaScenes<T>,
>(shape: IMetaOptions<T>, scenes: Scenes): MetaClass<T, Scenes>
export function meta<
  T extends MetaType,
  Scenes extends IMetaScenes<T>,
>(shape: IMetaOptions<T>, scenes?: Scenes): MetaClass<T, Scenes> {
  class _Meta extends Meta<T> {
    static readonly [MetaSymbol] = true

    constructor(newShape?: any) {
      super({ ...shape, ...newShape }, scenes)
    }

    static extend(newShape: any) {
      return meta({ ...shape, ...newShape }, scenes!)
    }

    static default(val: any) {
      return meta({ ...shape, default: val }, scenes!)
    }

    static label(val: string) {
      return meta({ ...shape, label: val }, scenes!)
    }

    static readonly(val: boolean = true) {
      return meta({ ...shape, readonly: val }, scenes!)
    }

    static disabled(val: boolean = true) {
      return meta({ ...shape, disabled: val }, scenes!)
    }

    static hidden(val: boolean = true) {
      return meta({ ...shape, hidden: val }, scenes!)
    }

    static required(val: boolean = true) {
      return meta({ ...shape, required: val }, scenes!)
    }
  }

  defineLazy(_Meta, '$scenes', () => {
    const $scenes: any = {}

    if (scenes) {
      for (const key in scenes)
        $scenes[key] = meta({ ...shape, ...scenes[key] })
    }
    return $scenes
  })
  defineLazy(_Meta, '$options', () => shape.options)

  return _Meta as any
}

export function string(val: string = '') {
  return meta({ type: String, default: val })
}

export function number(val: number = 0) {
  return meta({ type: Number, default: val })
}

/**
 *
 * @param val
 * @returns
 */
export function boolean(val: boolean = false) {
  return meta({ type: Boolean, default: val })
}

/**
 * 定义字典类型
 * @param shape
 * @returns
 * @example
 * const Switch = dict({
 *  type: Boolean,
 *  options: [{ value: false, label: '关' }, { value: true, label: '开' }]
 * })
 */
export function dict<
  T extends MetaType,
  Scenes extends IMetaScenes<T> = IMetaScenes<T>,
  Options extends { value: MetaValue<T>; label: string; default?: boolean }[] = { value: MetaValue<T>; label: string; default?: boolean }[]>(
  shape: IMetaOptions<T, Options>,
) {
  const options = shape.options!
  const map = keyBy(options, 'value')
  const defaultValue: any = options.find(({ default: d }) => d)?.value ?? options[0].value

  return meta({
    default: defaultValue,
    formatter(val) {
      return map[String(val)].label
    },
    ...shape,
  }) as MetaClass<T, Scenes, Options>
}
