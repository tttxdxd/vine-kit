import type { DeepRequired } from '@vine-kit/core'

import type { Field, Model } from '..'
import type { BasePluginOptions } from './base.plugin'
import { BasePlugin } from './base.plugin'

export interface FormPluginOptions extends BasePluginOptions<FieldForm> {
}

export type ViewForm = DeepRequired<FormPluginOptions>

export interface FieldFormOptions {
  prop?: string
  label?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  hidden?: boolean
}

export type FieldForm = DeepRequired<FieldFormOptions>

export class FormPlugin extends BasePlugin<ViewForm> {
  readonly name = 'Form'
  static readonly DEFAULT_FORM_OPTIONS = {
    prop: '',
    label: '',
    placeholder: '',
    disabled: false,
    readonly: false,
    hidden: false,
  }

  transformModel(model: Model): ViewForm {
    const name = model.options.name ?? model.name
    const keys = model.keys
    const fields = model.fields.map(field => this.transformField(field.key, field)).filter((field): field is FieldForm => field !== null)
    const options = model.options.form || {}

    return { name, keys, fields, ...options }
  }

  transformField(key: string, field: Field): FieldForm | null {
    if (field.options.form === false) {
      return null
    }

    const options = field.options.form || {}
    const label = field.options.label ?? options.label ?? key
    const prop = options.prop ?? key
    const type = options.type ?? field.type
    const form = { ...FormView.DEFAULT_FORM_OPTIONS, label, prop, type, ...options }

    return form
  }
}
