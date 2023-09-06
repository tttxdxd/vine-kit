import { defineLazy } from '@vine-kit/core'
import { z } from 'zod'
import type { MetaClass } from './types/meta'
import type { IModel, ModelClass } from './types/model'
import { Model } from './model'

export class Schema {
  private _schema: Record<string, any>
  private type!: z.ZodTypeAny

  constructor() {
    this._schema = {}
    defineLazy(this, 'type', () => ({ value: z.object(this._schema) }))
  }

  attach(key: string, val: any) {
    // const schema = Model.isModel(val) ? val.$schema : val.shape.
    // this._schema[key] = val.type
    // TODO
  }

  validate(val: Record<string, any>) {
    const result = this.type.safeParse(val)

    if (result.success)
      return true

    return false
  }
}
