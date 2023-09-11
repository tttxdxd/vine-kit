import { defineLazy } from '@vine-kit/core'
import { z } from 'zod'
import type { IMeta } from './types/meta'
import type { IModel } from './types/model'
import { Model } from './model'
import { Meta } from './meta'

export class Schema {
  private _schema: Record<string, any>
  private _required: Record<string, boolean>
  private type!: z.ZodTypeAny

  constructor(private readonly model: IModel<any>) {
    this._schema = {}
    this._required = {}
    defineLazy(this, 'type', () => ({ value: z.object(this._schema).required(this._required as any) }))
  }

  attach(key: string, val: IModel<any> | IMeta<any, any>) {
    const schema = Meta.isMeta(val)
      ? val.type
      : val.$schema.type

    this._required[key] = Meta.isMeta(val) ? val.required : true
    this._schema[key] = schema
  }

  validate(val: Record<string, any>) {
    const result = this.type.safeParse(val)

    if (!result.success) {
      // parse error
      this.model.error = result.error
    }

    return result.success
  }

  async validateAsync(val: Record<string, any>) {
    const result = await this.type.safeParseAsync(val)

    if (!result.success) {
      // parse error

      this.model.error = result.error
    }

    return result.success
  }
}
