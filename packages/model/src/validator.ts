export class Validator {
  validate: (value: any, key: string) => boolean

  constructor(validate: (value: any, key: string) => boolean) {
    this.validate = validate
  }
}
