import type { IModel } from './types/model'

export class Controller {
  // message(msg: string, level: number) {

  // }

  // alert(msg: string) {

  // }

  // confirm(msg: string) { }
}

export class FormController {
  model!: IModel

  async validate(): Promise<boolean> {
    return this.model.validateAsync()
  }
}

export class TableController {

}
