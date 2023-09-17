import { isArrayLike, isBoolean, isEmail, isNumber, isString } from '@vine-kit/core'
import type { MetaType } from './types/meta'
import type { Issue } from './types/schema'
import { IssueCode, ParsedType } from './types/schema'
import { toParsedType } from './util'
import { errorMap } from './locales'
import type { IValidatorBoolean, IValidatorNumber, IValidatorString, IValidatorType } from './types/validator'

export class Validator<Code extends IssueCode = any> {
  code: Code
  validate: (val: any) => boolean
  value: any
  message!: string

  constructor(code: Code, validate: (val: any) => boolean, value?: any) {
    this.code = code
    this.validate = validate
    this.value = value
  }

  static string = new Validator(IssueCode.invalid_type, isString, ParsedType.string)
  static number = new Validator(IssueCode.invalid_type, isNumber, ParsedType.number)
  static boolean = new Validator(IssueCode.invalid_type, isBoolean, ParsedType.boolean)

  static fromMeta(type: MetaType) {
    if (type === String)
      return Validator.string
    else if (type === Number)
      return Validator.number
    else if (type === Boolean)
      return Validator.boolean

    throw new Error('Unknown meta type')
  }

  static validate(validators: Validator[], val: any, path: string[]) {
    let issue: Issue

    for (const validator of validators) {
      if (validator.validate(val))
        continue

      switch (validator.code) {
        case IssueCode.invalid_type:
          issue = {
            code: validator.code,
            message: '',
            expected: validator.value,
            received: toParsedType(val),
            path,
          }
          break
        case IssueCode.invalid_literal:
          issue = {
            code: validator.code,
            message: validator.message,
            expected: validator.value,
            received: val,
            path,
          }
          break
        case IssueCode.too_small:
          issue = {
            code: validator.code,
            message: validator.message,
            minimum: validator.value.minimum,
            inclusive: validator.value.inclusive,
            type: toParsedType(val) as any,
            path,
          }
          break
        default:
          issue = {
            code: IssueCode.custom,
            message: validator.message,
            path,
          }
          break
      }

      issue.message = errorMap(issue).message

      return issue
    }
  }
}

export function email(): IValidatorString {
  return new Validator(IssueCode.invalid_string, isEmail, 'email') as any
}

export const min = gte
export const max = lte

export function gte(minimum: number): IValidatorString & IValidatorNumber {
  return new Validator(IssueCode.too_small, val => (isArrayLike(val) ? val.length : val) >= minimum, { minimum, inclusive: true }) as any
}

export function gt(minimum: number): IValidatorString & IValidatorNumber {
  return new Validator(IssueCode.too_small, val => (isArrayLike(val) ? val.length : val) > minimum, { minimum, inclusive: false }) as any
}

export function lte(maximum: number): IValidatorString & IValidatorNumber {
  return new Validator(IssueCode.too_big, val => (isArrayLike(val) ? val.length : val) <= maximum, { maximum, inclusive: true }) as any
}

export function lt(maximum: number): IValidatorString & IValidatorNumber {
  return new Validator(IssueCode.too_big, val => (isArrayLike(val) ? val.length : val) < maximum, { maximum, inclusive: false }) as any
}

const a = gte(0)
