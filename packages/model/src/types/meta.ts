import type * as z from 'zod'

export type MetaRawOptions<Z extends z.ZodTypeAny> = {
  /** 类型 */
  type: Z

  computed?: (this: any) => z.infer<Z>

  /** 字段 prop */
  prop?: string
  /** 字段 */
  label?: string

  /** 字段是否必填 */
  required?: boolean
  /** 字段是否只读 */
  readonly?: boolean
  /** 字段是否禁用 */
  disabled?: boolean
  /** 字段是否隐藏 */
  hidden?: boolean

  /** 字段输出格式化 */
  formatter?: (this: any, value: z.infer<Z>, key: string, data: any) => string

  fromJSON?: <T>(this: any, value: any) => z.infer<Z>
  toJSON?: <T>(this: any, value: z.infer<Z>, key: string) => T

  validators: (this: any, value: z.infer<Z>, key: string, data: any) => string[]

  model?: any
} & (Z extends z.ZodDefault<any> ?
  any : {
    default: z.infer<Z>
  })

export interface MetaRawShape<Z extends z.ZodTypeAny> {
  /** 类型 */
  type: Z

  default: z.infer<Z>
  computed?: (this: any) => z.infer<Z>

  /** 字段 prop */
  prop: string
  /** 字段 */
  label: string

  /** 字段是否必填 */
  required: boolean
  /** 字段是否只读 */
  readonly: boolean
  /** 字段是否禁用 */
  disabled: boolean
  /** 字段是否隐藏 */
  hidden: boolean

  /** 字段输出格式化 */
  formatter?: (this: any, value: z.infer<Z>, key: string) => string
  fromJSON?: <T>(this: any, value: any) => z.infer<Z>
  toJSON?: (this: any, value: z.infer<Z>, key: string) => any

  model?: any
}

export interface IMeta<
  Z extends z.ZodTypeAny,
  Shape extends MetaRawShape<Z>,
> {
  readonly shape: Shape
  readonly type: z.ZodTypeAny
  readonly value: z.infer<Z>

  readonly label: string
  readonly prop: string

  readonly readonly: boolean
  readonly disabled: boolean
  readonly hidden: boolean
  readonly required: boolean

  readonly text: string

  formatter?: (this: any, value: z.infer<Z>, key: string, data: any) => string
  readonly model: any
}

export interface MetaClass<
  Z extends z.ZodTypeAny,
  Shape extends MetaRawShape<Z>,
> {
  new<NShape extends MetaRawShape<Z>, T extends Omit<MetaRawOptions<Z>, 'type'>>(options?: T): IMeta<Z, NShape>

  /**
   * 扩展字段元数据类型
   * @param newShape
   * @returns
   */
  extend<
    EShape extends MetaRawShape<Z>,
  >(shape: Partial<Omit<MetaRawShape<Z>, 'type'>>): MetaClass<Z, EShape>

  default(val: z.infer<Z>): MetaClass<Z, Shape>
  label(val: string): MetaClass<Z, Shape>
  readonly(val: boolean): MetaClass<Z, Shape>
  disabled(val: boolean): MetaClass<Z, Shape>
  hidden(val: boolean): MetaClass<Z, Shape>
  required(val: boolean): MetaClass<Z, Shape>
}

export type toIMeta<T extends MetaClass<any, any>> = T extends MetaClass<infer Z, infer Shape> ? IMeta<Z, Shape> : never
