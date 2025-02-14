export interface ViewOptions {
  name: string
  description: string
  model: any
  schema: Record<string, any>
}

export class View<T = any, M = any> {
  readonly name: string
  readonly description: string
  readonly model: M
  readonly schema: Record<string, T>

  readonly keys: string[]
  readonly fields: T[]

  constructor(name: string, description: string, model: M, schema: Record<string, T>) {
    this.name = name
    this.description = description
    this.model = model
    this.schema = schema
    this.keys = Object.keys(schema)
    this.fields = Object.values(schema)
  }

  getField(key: string): T | undefined {
    return this.schema[key]
  }

  hasField(key: string): boolean {
    return key in this.schema
  }

  toJSON(): Record<string, T> {
    return this.schema
  }
}
