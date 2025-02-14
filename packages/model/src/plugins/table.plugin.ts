import type { DeepRequired } from '@vine-kit/core'

import type { Field, Model } from '..'
import type { BasePluginOptions } from './base.plugin'
import { BasePlugin } from './base.plugin'

export interface TablePluginOptions extends BasePluginOptions<FieldTable> {
}

export type ViewTable = DeepRequired<TablePluginOptions>

export interface FieldTableOptions {
  label?: string
  width?: string | number
  hidden?: boolean
  sortable?: boolean
  filterable?: boolean
}

export type FieldTable = DeepRequired<FieldTableOptions>

export class TablePlugin extends BasePlugin<ViewTable> {
  readonly name = 'Table'
  static readonly DEFAULT_TABLE_OPTIONS = {
    label: '',
    width: '',
    hidden: false,
    sortable: false,
    filterable: false,
  }

  transformModel(model: Model): ViewTable {
    const name = model.options.name ?? model.name
    const keys = model.keys
    const fields = model.fields.map(field => this.transformField(field.key, field)).filter(field => field !== null) as FieldTable[]
    const options = model.options.table || {}

    return { name, keys, fields, ...options }
  }

  transformField(key: string, field: Field): FieldTable | null {
    if (field.options.table === false) {
      return null
    }

    const options = field.options.table || {}
    const label = field.options.label ?? options.label ?? key
    const table = { ...TablePlugin.DEFAULT_TABLE_OPTIONS, label, ...options }

    return table
  }
}
