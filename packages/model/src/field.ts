import type { FieldDBOptions, FieldFormOptions, FieldTableOptions } from './plugins'
import type { ParseContext, Validator } from './interface'
import type { SafeParseReturnType } from './model'
import { ValidationError } from './error'

export interface FieldOptions<T = any> {
  key?: string
  name?: string
  label?: string
  description?: string

  validators?: Validator<T>[]
  default?: T

  from?: (val: unknown) => any
  to?: (val: unknown) => any

  db?: FieldDBOptions | false
  form?: FieldFormOptions | false
  table?: FieldTableOptions | false
}

// 字段基类
export abstract class Field<
  Output = any,
  Input = Output,
> {
  readonly _output!: Output
  readonly _input!: Input

  readonly key!: string
  readonly type: string
  readonly options: FieldOptions<Input>
  readonly validators: Validator<Input>[]

  constructor(type: string, options: FieldOptions) {
    this.type = type
    this.options = options
    this.validators = [this.getTypeValidator()]
  }

  abstract getTypeValidator(): Validator

  custom(validator: Validator<Input>): this {
    this.validators.push(validator)
    return this
  }

  async validate(ctx: ParseContext): Promise<boolean> {
    for (const validator of this.validators) {
      if (!(await validator.validate(ctx.data as Input))) {
        const message = typeof validator.message === 'function'
          ? validator.message(ctx.data as Input)
          : validator.message

        ctx.issues.push({
          path: [...ctx.path],
          message,
        })
        return false
      }
    }

    return true
  }

  async parse(val: Input): Promise<Output> {
    const result = await this.safeParse(val)
    if (result.success) {
      return result.data
    }
    throw result.error
  }

  async safeParse(val: unknown): Promise<SafeParseReturnType<Output>> {
    const ctx: ParseContext = {
      data: val,
      issues: [],
      path: [],
      parent: null,
    }
    const success = await this.validate(ctx)
    if (success) {
      return { success: true, data: ctx.data }
    }
    return { success: false, error: new ValidationError(ctx.issues) }
  }
}

// 具体字段类型
export class StringField extends Field<string> {
  constructor(options: FieldOptions) {
    super('string', options)
  }

  getTypeValidator(): Validator {
    return {
      validate: (val): val is string => typeof val === 'string',
      message: 'Must be a string',
    }
  }

  min(value: number): this {
    return this.custom({
      validate: val => (val).length >= value,
      message: `Minimum length is ${value}`,
    })
  }

  max(value: number): this {
    return this.custom({
      validate: val => (val).length <= value,
      message: `Maximum length is ${value}`,
    })
  }
}

export class NumberField extends Field<number> {
  constructor(options: FieldOptions) {
    super('number', options)
  }

  getTypeValidator(): Validator {
    return {
      validate: (val): val is number => typeof val === 'number',
      message: 'Must be a number',
    }
  }

  min(value: number): this {
    return this.custom({
      validate: val => val >= value,
      message: `Minimum value is ${value}`,
    })
  }

  max(value: number): this {
    return this.custom({
      validate: val => val <= value,
      message: `Maximum value is ${value}`,
    })
  }
}

export class BooleanField extends Field<boolean> {
  constructor(options: FieldOptions) {
    super('boolean', options)
  }

  getTypeValidator(): Validator {
    return {
      validate: (val): val is boolean => typeof val === 'boolean',
      message: 'Must be a boolean',
    }
  }
}

export class DateField extends Field<Date> {
  constructor(options: FieldOptions) {
    super('date', options)
  }

  getTypeValidator(): Validator {
    return {
      validate: (val): val is Date => val instanceof Date,
      message: 'Must be a date',
    }
  }
}

export function string(options: FieldOptions): StringField {
  return new StringField(options)
}

export function number(options: FieldOptions): NumberField {
  return new NumberField(options)
}

export function boolean(options: FieldOptions): BooleanField {
  return new BooleanField(options)
}

export function date(options: FieldOptions): DateField {
  return new DateField(options)
}
