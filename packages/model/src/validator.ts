import { isArrayLike, isBoolean, isEmail, isEmpty, isEndsWith, isNumber, isStartsWith, isString, isURL, memoize } from '@vine-kit/core'
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

  withMessage(message?: string) {
    if (isEmpty(message))
      return this

    this.message = message
    return this
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
        case IssueCode.invalid_string:
          issue = {
            code: validator.code,
            message: validator.message,
            path,
            ...validator.value,
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

      if (!issue.message)
        issue.message = errorMap(issue).message

      return issue
    }
  }

  static new<T extends Validator>(code: IssueCode, validate: (val: any) => boolean, value?: any): T {
    return new Validator(code, validate, value) as any
  }

  static custom(validate: (val: any) => boolean, message: string) {
    return Validator.new<IValidatorType>(IssueCode.custom, validate).withMessage(message)
  }
}

/**
 * 用于验证输入是否是指定的值
 * @param expected 指定的值
 * @returns
 */
export function literal(expected: any) {
  return Validator.new<IValidatorType>(IssueCode.invalid_literal, val => val === expected, { expected })
}

/**
 * 用于验证字符串是否为合法的电子邮件地址。
 */
export const email = memoize(() =>
  Validator.new<IValidatorString>(IssueCode.invalid_string, isEmail, { validation: 'email' }),
)

/**
 * 用于验证字符串是否为合法的URL。
 */
export const url = memoize(() =>
  Validator.new<IValidatorString>(IssueCode.invalid_string, isURL, { validation: 'url' }),
)

/**
 * 用于验证字符串是否匹配指定的正则表达式。
 * @param regex 正则表达式对象。
 */
export const regex = memoize(
  (regex: RegExp, message?: string) => Validator.new<IValidatorString>(IssueCode.invalid_string, val => regex.test(val), { validation: 'regex' }).withMessage(message),
  (regex: RegExp, message) => `${regex.source}:${message}`,
)

/**
 * 用于验证字符串是否以指定字符串开始。
 * @param searchString 要搜索的字符串。
 */
export const startsWith = memoize((searchString: string) =>
  Validator.new<IValidatorString>(IssueCode.invalid_string, val => isStartsWith(val, searchString), { startsWith: searchString }),
)

/**
 * 用于验证字符串是否以指定字符串结束。
 * @param searchString 要搜索的字符串。
 */
export const endsWith = memoize((searchString: string) =>
  Validator.new<IValidatorString>(IssueCode.invalid_string, val => isEndsWith(val, searchString), { endsWith: searchString }),
)

/**
 * 用于验证大小是否大于等于指定值。
 * @param minimum 最小值。
 */
export const gte = memoize((minimum: number) =>
  Validator.new<IValidatorString & IValidatorNumber>(IssueCode.too_small, val => (isArrayLike(val) ? val.length : val) >= minimum, { minimum, inclusive: true }),
)

/**
 * 用于验证大小是否大于指定值。
 * @param minimum 最小值。
 */
export const gt = memoize((minimum: number) =>
  Validator.new<IValidatorString & IValidatorNumber>(IssueCode.too_small, val => (isArrayLike(val) ? val.length : val) > minimum, { minimum, inclusive: true }),
)

/**
 * 用于验证大小是否小于等于指定值。
 * @param maximum 最大值。
 */
export const lte = memoize((maximum: number) =>
  Validator.new<IValidatorString & IValidatorNumber>(IssueCode.too_big, val => (isArrayLike(val) ? val.length : val) <= maximum, { maximum, inclusive: true }),
)
/**
 * 用于验证大小是否小于指定值。
 * @param maximum 最大值。
 */
export const lt = memoize((maximum: number) =>
  Validator.new<IValidatorString & IValidatorNumber>(IssueCode.too_big, val => (isArrayLike(val) ? val.length : val) < maximum, { maximum, inclusive: true }),
)

/**
 * 用于验证大小是否大于等于指定值。
 * @param minimum 最小值。
 */
export const min = gte

/**
 * 用于验证大小是否小于等于指定值。
 * @param maximum 最大值。
 */
export const max = lte
