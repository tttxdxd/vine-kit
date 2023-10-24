import type { Model } from '@vine-kit/model'

export class FormController {
  model!: Model<any>

  async validate(): Promise<boolean> {
    return this.model.validateAsync()
  }
}
