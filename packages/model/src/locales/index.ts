import { get, isPlainObject, isString, memoize, notEmptyArray } from '@vine-kit/core'

import { ValidationError } from '../schema'
import { IssueCode, ParsedType } from '../types/schema'
import { joinValues } from '../util'
import en from './en.json'
import zh from './zh-CN.json'

type Lang = 'en' | 'zh-CN'
let lang: Lang = 'en'
const translation: any = {
  'en': en,
  'zh-CN': zh,
}

const formatters: Record<string, any> = {
  datetime: memoize((_lang: Lang, date: Date) => {
    return `${date.getFullYear()}`
  }, lang => lang),
}

export function t(key: string, options?: Record<string, any>) {
  const str = get(translation[lang], key)
  if (!isString(str))
    throw new Error(`Missing translation for key "${key}"`)
  if (!isPlainObject(options))
    return str

  const interpolateRegex = /{{(\w+),? ?(\w+)?}}/g
  return str.replace(interpolateRegex, (match, name, format) => {
    const value = options[name] || match
    const formatter = formatters[format]

    if (formatter)
      return formatter(lang, value)
    return value
  })
}

export function initLanguage(language: Lang) {
  if (language === 'en')
    return

  lang = language

  ValidationError._getMessageFromIssue = (issue, model) => {
    if (notEmptyArray(issue.path))
      return `${model.$schema.getViewByPath(issue.path)?.label ?? ''}(${ValidationError.joinPath(issue.path)}): ${issue.message}`

    return issue.message
  }
}

export function errorMap(issue: any, _ctx?: any) {
  let message: string = ''
  switch (issue.code) {
    case IssueCode.invalid_type:
      if (issue.received === ParsedType.undefined) {
        message = t('errors.invalid_type_received_undefined')
      }
      else {
        message = t('errors.invalid_type', {
          received: issue.received,
          expected: issue.expected,
        })
      }
      break
    case IssueCode.invalid_literal:
      message = message = t('errors.invalid_literal', {
        expected: JSON.stringify(issue.expected),
      })
      break
    // case IssueCode.unrecognized_keys:
    //   message = t('errors.unrecognized_keys', {
    //     keys: joinValues(issue.keys, ', '),
    //   })
    //   break
    // case IssueCode.invalid_union:
    //   message = t('errors.invalid_union')
    //   break
    // case IssueCode.invalid_union_discriminator:
    //   message = t('errors.invalid_union_discriminator', {
    //     options: joinValues(issue.options),
    //   })
    //   break
    // case IssueCode.invalid_enum_value:
    //   message = t('errors.invalid_enum_value', {
    //     options: joinValues(issue.options),
    //     received: issue.received,
    //   })
    //   break
    // case IssueCode.invalid_arguments:
    //   message = t('errors.invalid_arguments')
    //   break
    // case IssueCode.invalid_return_type:
    //   message = t('errors.invalid_return_type')
    //   break
    // case IssueCode.invalid_date:
    //   message = t('errors.invalid_date')
    //   break
    case IssueCode.invalid_string:
      if (typeof issue.validation === 'object') {
        if ('startsWith' in issue.validation) {
          message = t('errors.invalid_string.startsWith', {
            startsWith: issue.validation.startsWith,
          })
        }
        else if ('endsWith' in issue.validation) {
          message = t('errors.invalid_string.endsWith', {
            startsWith: issue.validation.endsWith,
          })
        }
      }
      else {
        message = t(`errors.invalid_string.${issue.validation}`, {
          validation: t(`validations.${issue.validation}`),
        })
      }
      break
    case IssueCode.too_small:
      message = t(
        `errors.too_small.${issue.type}.${issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'}`, {
          minimum: issue.type === 'date' ? new Date(issue.minimum as any) : issue.minimum,
        })
      break
    case IssueCode.too_big:
      message = t(
        `errors.too_big.${issue.type}.${issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'}`, {
          maximum: issue.type === 'date' ? new Date(issue.maximum as any) : issue.maximum,
        })
      break
    // case IssueCode.invalid_intersection_types:
    //   message = t('errors.invalid_intersection_types')
    //   break
    // case IssueCode.not_multiple_of:
    //   message = t('errors.not_multiple_of', {
    //     multipleOf: issue.multipleOf,
    //   })
    //   break
    // case IssueCode.not_finite:
    //   message = t('errors.not_finite')
    //   break
    case IssueCode.custom:
      message = t('errors.custom')
      break
    default:
      message = ''
  }
  return { message }
}
