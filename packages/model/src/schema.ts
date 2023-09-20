import type { NonEmptyArray } from '@vine-kit/core'
import { get, last, set } from '@vine-kit/core'

import type { ISchemaType } from './types/type'
import type { IMeta } from './types/meta'
import type { IModel, ModelRawShape, ModelStore } from './types/model'
import { Meta } from './meta'
import type { Issue } from './types/schema'
import { ValidationError } from './error'

export class Schema<T extends ModelRawShape = any> {
  private model: IModel
  private type!: ISchemaType
  defaultValue: ModelStore<T>

  constructor(model: IModel<T>) {
    this.model = model
    this.defaultValue = this.getDefaultValue()
  }

  getDefaultValue(): ModelStore<T> {
    const defaultValue: any = {}

    this.each((meta, path) => {
      set(defaultValue, path, meta.default)
      return true
    })
    return defaultValue
  }

  each(callback: (meta: IMeta, path: NonEmptyArray<string>) => boolean, parentPath: string[] = []): boolean {
    const view = this.model.$views

    let isBreak = false
    for (const key in view) {
      const path = [...parentPath, key] as unknown as NonEmptyArray<string>
      const meta = view[key]

      if (Meta.isMeta(meta))
        isBreak = !callback(meta, path)
      else
        isBreak = !this.each(callback, path)

      if (isBreak)
        break
    }

    return true
  }

  validate(val: Record<string, any>) {
    const issues: Issue[] = []
    this.each((meta, path) => {
      const value = get(val, path)
      const isValid = meta.validate(value, last(path))

      if (!isValid)
        issues.push(meta.issue!)

      return isValid
    })

    if (issues.length) {
      this.model.error = ValidationError.fromSchema(issues, this.model)
      return false
    }

    return true
  }

  getViewByPath(path: NonEmptyArray<string | number>) {
    let view: any = this.model.$views

    for (const key of path)
      view = view[key]

    return view
  }
}
