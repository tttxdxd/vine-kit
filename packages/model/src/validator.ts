import { isArrayLike, isBoolean, isEmail, isEmpty, isEndsWith, isNumber, isStartsWith, isString, isURL, memoize } from '@vine-kit/core'
import type { MetaType, MetaValueToType } from './types/meta'
import type { Issue } from './types/schema'
import { toParsedType } from './util'
import { IssueCode, ParsedType, errorMap, template } from './locales'
import type { IValidate, IValidateAsync, IValidateSync, IValidator, IValidatorNumber, IValidatorString, IValidatorType, IValidatorTypeAsync } from './types/validator'

export class Validator<Code extends IssueCode = any> {
  code: Code
  validate: IValidate
  value: any
  message!: string
  async: boolean

  constructor(code: Code, validate: IValidate, value?: any) {
    this.code = code
    this.validate = validate
    this.value = value
    this.async = false
  }

  withMessage(message?: string) {
    if (isEmpty(message))
      return this

    this.message = message
    return this
  }

  withAsync() {
    this.async = true
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
    for (const validator of validators) {
      if (validator.validate(val))
        continue

      return Validator._parseValidate(validator, val, path)
    }
  }

  static async validateAsync(validators: Validator[], val: any, path: string[]) {
    for (const validator of validators) {
      if (await validator.validate(val))
        continue

      return Validator._parseValidate(validator, val, path)
    }
  }

  static new<T extends Validator>(code: IssueCode, validate: IValidate, value?: any): T {
    return new Validator(code, validate, value) as any
  }

  static custom(validate: IValidateSync, message: string) {
    return Validator.new<IValidatorType>(IssueCode.custom, validate).withMessage(message)
  }

  protected static _parseValidate(validator: Validator<any>, val: any, path: string[]) {
    let issue: Issue

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
      case IssueCode.invalid_enum_value:
        issue = {
          code: validator.code,
          message: validator.message,
          path,
          received: val,
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
          received: val,
          path,
        }
        issue.message = validator.message ? template(validator.message, issue) : validator.message
        break
    }

    if (!issue.message)
      issue.message = errorMap(issue).message

    return issue
  }
}

/**
 * Validator 用于验证输入是否是指定的枚举值
 * @param options 枚举值列表
 */
export function enums<T extends number | string | boolean, V extends MetaValueToType<T>>(options: T[]): IValidator<V> {
  return Validator.new(IssueCode.invalid_enum_value, val => options.includes(val), { options }) as any
}

/**
 * Validator 用于验证输入是否是指定的值
 * @param expected 指定的值
 */
export function literal(expected: any) {
  return Validator.new<IValidatorType>(IssueCode.invalid_literal, val => val === expected, { expected })
}

/**
 * Validator 自定义验证
 * @param validate
 */
export function custom(validate: IValidateSync, message?: string) {
  return Validator.new<IValidatorType>(IssueCode.custom, validate, {}).withMessage(message)
}

/**
 * Validator 自定义验证
 * @param validate
 */
export function customAsync(validate: IValidateAsync, message?: string) {
  return Validator.new<IValidatorTypeAsync>(IssueCode.custom, validate, {}).withMessage(message).withAsync()
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
