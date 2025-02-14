import { type DeepRequired, StringUtil } from '@vine-kit/core'

import type { Field, Model } from '..'
import type { BasePluginOptions } from './base.plugin'
import { BasePlugin } from './base.plugin'

interface DBIndexKey {
  name: string
  columns: string[]
}

interface DBForeignKey {
  name: string
  column: string
  referencedTable: string
  referencedColumn: string
}

export interface DatabasePluginOptions extends BasePluginOptions<FieldDB> {
  indexes?: DBIndexKey[]
  uniques?: DBIndexKey[]
  foreignKeys?: DBForeignKey[]
  primaryKey?: string
}

export type ViewDB = DeepRequired<DatabasePluginOptions>

export interface FieldDBOptions {
  name?: string
  comment?: string
  type?: string
  primaryKey?: boolean
  autoIncrement?: boolean
  unique?: boolean
  index?: boolean
  defaultValue?: string | null
  onUpdate?: string
}

export type FieldDB = DeepRequired<FieldDBOptions>

export class DatabasePlugin extends BasePlugin<ViewDB> {
  readonly name = 'DB'
  static readonly DEFAULT_DB_OPTIONS = {
    comment: '',
    primaryKey: false,
    autoIncrement: false,
    unique: false,
    index: false,
    defaultValue: null,
    onUpdate: '',
  }

  constructor() {
    super()
  }

  transformModel(model: Model): ViewDB {
    const name = StringUtil.toSnakeCase(model.options.name ?? '')
    const options = model.options.db ?? {}
    const fields = model.fields.map(field => this.transformField(field.key, field)).filter((field): field is FieldDB => field !== null)

    return {
      name,
      keys: model.keys,
      fields,
      primaryKey: options.primaryKey ?? '',
      indexes: options.indexes ?? [],
      uniques: options.uniques ?? [],
      foreignKeys: options.foreignKeys ?? [],
    }
  }

  transformField(key: string, field: Field): FieldDB | null {
    if (field.options.db === false) {
      return null
    }

    const options = field.options.db || {}
    const name = this.transformName(key, field)
    const type = this.transformType(key, field)
    const comment = options.comment ?? field.options.description ?? ''
    const db = { ...DatabasePlugin.DEFAULT_DB_OPTIONS, name, type, comment, ...options }

    return db
  }

  transformName(key: string, field: Field): string {
    const options = field.options.db || {}
    const name = options.name ?? key
    return StringUtil.toSnakeCase(name)
  }

  transformType(_key: string, field: Field): string {
    switch (field.type) {
      case 'string':
        return 'VARCHAR'
      case 'number':
        return 'INT'
      case 'boolean':
        return 'BOOLEAN'
      case 'date':
        return 'DATETIME'
      default:
        return field.type
    }
  }
}
