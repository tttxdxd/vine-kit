import { ValidationError } from './error'
import type { Field } from './field'
import type { ValidationResult } from './interface'
import type { BaseView, FieldDB, FieldForm, FieldTable, ViewDatabaseOptions, ViewFormOptions, ViewTableOptions } from './plugins'
import type { View } from './view'

const globalPlugins: Map<string, BaseView> = new Map()

export function registerPlugin(plugin: BaseView): void {
  globalPlugins.set(plugin.name.toLowerCase(), plugin)
  globalPlugins.set(plugin.name, plugin)
}
export interface SafeParseSuccess<Output> {
  success: true
  data: Output
  error?: never
}
export interface SafeParseError {
  success: false
  error: ValidationError
  data?: never
}

export type SafeParseReturnType<Output = any> = SafeParseSuccess<Output> | SafeParseError

export interface ModelOptions {
  name: string
  schema: Record<string, Field>

  description?: string

  db?: ViewDatabaseOptions
  form?: ViewFormOptions
  table?: ViewTableOptions
}
export type BuildModelOptions<T> = {
  name: string
  description?: string
  schema: Record<string, T>

} & T

// 模型类
export class Model<
  Output = any,
  Input = any,
> {
  readonly _output!: Output
  readonly _input!: Input

  readonly name: string
  readonly description: string
  readonly schema: Record<string, Field>
  readonly fields: Field[]
  readonly keys: string[]

  readonly options: ModelOptions

  constructor(options: ModelOptions) {
    this.name = options.name
    this.description = options.description ?? ''
    this.schema = options.schema
    this.keys = Object.keys(options.schema)
    this.fields = Object.values(options.schema)
    this.options = options

    Object.entries(this.schema).forEach(([key, field]) => {
      // force set key
      (field as any).key = key
    })
  }

  toDBView(): View<FieldDB> {
    return this.toView('db')
  }

  toFormView(): View<FieldForm> {
    return this.toView('form')
  }

  toTableView(): View<FieldTable> {
    return this.toView('table')
  }

  toView<T>(pluginName: string): View<T> {
    const plugin = globalPlugins.get(pluginName)
    if (!plugin) {
      throw new Error(`Plugin "${pluginName}" not found`)
    }
    return plugin.toView(this)
  }

  async validate(data: unknown): Promise<ValidationResult<Output>> {
    const errors: Record<string, string> = {}

    await Promise.all(this.fields.map(async (field) => {
      const result = await field.validate(data[field.key])
      if (!result.valid) {
        errors[field.key] = result.message
      }
    }))

    if (Object.keys(errors).length === 0) {
      return { valid: true }
    }

    return { valid: false, error: new ValidationError('Validation failed', errors) }
  }

  async parse(data: Record<string, unknown>): Promise<Output> {
    const result = await this.safeParse(data)
    if (result.valid) {
      return result.data
    }
    throw result.error
  }

  async safeParse(data: unknown): Promise<SaveParseResult<Output>> {
    const result = await this.validate(data)
    if (!result.valid) {
      throw result.error
    }
    return { valid: true, data }
  }

  fromJSON(data: Record<string, unknown>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(this.schema).map(([key, field]) => [
        key,
        field.options.from ? field.options.from(data[key]) : data[key],
      ]),
    )
  }

  toJSON(data: Record<string, any>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(this.schema).map(([key, field]) => [
        key,
        field.options.to ? field.options.to(data[key]) : data[key],
      ]),
    )
  }

  pick(...schema: string[]): Model {
    const newschema = Object.fromEntries(
      Object.entries(this.schema).filter(([key]) => schema.includes(key)),
    )
    return new Model({ ...this.options, name: `${this.name}Picked`, schema: newschema })
  }

  omit(...schema: string[]): Model {
    const newschema = Object.fromEntries(
      Object.entries(this.schema).filter(([key]) => !schema.includes(key)),
    )
    return new Model({ ...this.options, name: `${this.name}Omitted`, schema: newschema })
  }

  required(...schema: string[]): Model {
    const newschema = { ...this.schema }
    schema.forEach((field) => {
      if (newschema[field]) {
        newschema[field].custom({
          validate: val => val !== undefined && val !== null,
          message: `${field} is required`,
        })
      }
    })
    return new Model({ ...this.options, name: `${this.name}Required`, schema: newschema })
  }
}

export function model(options: ModelOptions): Model {
  return new Model(options)
}
