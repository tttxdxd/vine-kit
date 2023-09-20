import type { Validator } from '../validator'
import type { IModel } from './model'
import type { Issue } from './schema'
import type { IValidator } from './validator'

export type MetaType = NumberConstructor | StringConstructor | BooleanConstructor
export type MetaValue<T extends MetaType> = T extends NumberConstructor ? number :
  T extends StringConstructor ? string :
    T extends BooleanConstructor ? boolean :
      T extends ObjectConstructor ? object : never
export type MetaValueToType<T extends number | string | boolean> = T extends number ? NumberConstructor
  : T extends string ? StringConstructor
    : T extends boolean ? BooleanConstructor
      : never

export interface IMetaRawOptions<T extends MetaType, Options = never> {
  default?: MetaValue<T>
  computed?: (this: any) => MetaValue<T>

  /** 字段 prop */
  prop?: string
  /** 字段 */
  label?: string | ((this: any, value: MetaValue<T>, key: string) => string)

  /** 字段是否必填 */
  required?: boolean
  /** 字段是否只读 */
  readonly?: boolean
  /** 字段是否禁用 */
  disabled?: boolean
  /** 字段是否隐藏 */
  hidden?: boolean

  /** 字段输出格式化 */
  formatter?: (this: any, value: MetaValue<T>, key: string) => string

  /** 校验 */
  validators?: IValidator<T>[]

  from?: (this: any, value: any) => MetaValue<T>
  to?: (this: any, value: MetaValue<T>, key: string) => MetaValue<T>

  model?: IModel
  scene?: string
  options?: Options
}

export type IMetaOptions<T extends MetaType, Options = never> = {
  /** 类型 */
  type: T
} & IMetaRawOptions<T, Options>

export interface IMetaScenes<T extends MetaType> {
  [key: string]: IMetaRawOptions<T>
}

export interface IMeta<T extends MetaType = any, Options = never> {
  readonly type: MetaType
  readonly value: MetaValue<T>
  readonly default: MetaValue<T>

  readonly label: string
  readonly prop: string

  readonly readonly: boolean
  readonly disabled: boolean
  readonly hidden: boolean
  readonly required: boolean

  readonly text: string
  readonly validators: Validator[]

  readonly error?: string
  readonly issue?: Issue
  validate(this: any, value: MetaValue<T>, key?: string): boolean

  formatter?: (this: any, value: MetaValue<T>, key: string, data: any) => string
  from?: <T>(this: any, value: any) => T
  to?: <T>(this: any, value: T, key: string) => T

  readonly model: any
  readonly options: Options
}

export interface MetaClass<
  T extends MetaType,
  Scene extends IMetaScenes<T> | never = never,
  Options = never,
> {
  new(options?: IMetaRawOptions<T, Options>): IMeta<T, Options>

  /**
   * 扩展字段元数据类型
   * @param options
   * @returns
   */
  extend(options: IMetaRawOptions<T>): MetaClass<T>

  default(val: MetaValue<T>): MetaClass<T>
  label(val: string): MetaClass<T>
  readonly(val?: boolean): MetaClass<T>
  disabled(val?: boolean): MetaClass<T>
  hidden(val?: boolean): MetaClass<T>
  required(val?: boolean): MetaClass<T>

  $scenes: {
    [key in keyof Scene]: MetaClass<T>
  }
  $options: Options
}

export type toIMeta<T extends MetaClass<any, any>> = T extends MetaClass<infer T, any> ? IMeta<T> : never
