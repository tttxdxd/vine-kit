import { ZodIssueCode, ZodParsedType, defaultErrorMap, setErrorMap, util } from 'zod'

// Import your language translation files
import { NOOP, get, isPlainObject, isString, memoize } from '@vine-kit/core'
import translation from './zod.json'

const formatters: Record<string, any> = {
  datetime: memoize((date: Date) => {
    return `${date.getFullYear()}`
  }, NOOP),
}

function t(key: string, options?: Record<string, any>) {
  const str = get(translation, key)
  if (!isString(str))
    throw new Error(`Missing translation for key "${key}"`)
  if (!isPlainObject(options))
    return str

  const interpolateRegex = /{{(\w+),? ?(\w+)?}}/g
  return str.replace(interpolateRegex, (match, name, format) => {
    const value = options[name] || match
    const formatter = formatters[format]

    if (formatter)
      return formatter(value)
    return value
  })
}

setErrorMap((issue, _ctx) => {
  let message: string = ''
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = t('errors.invalid_type_received_undefined')
      }
      else {
        message = t('errors.invalid_type', {
          received: issue.received,
          expected: issue.expected,
        })
      }
      break
    case ZodIssueCode.invalid_literal:
      message = message = t('errors.invalid_literal', {
        expected: JSON.stringify(issue.expected, util.jsonStringifyReplacer),
      })
      break
    case ZodIssueCode.unrecognized_keys:
      message = t('errors.unrecognized_keys', {
        keys: util.joinValues(issue.keys, ', '),
      })
      break
    case ZodIssueCode.invalid_union:
      message = t('errors.invalid_union')
      break
    case ZodIssueCode.invalid_union_discriminator:
      message = t('errors.invalid_union_discriminator', {
        options: util.joinValues(issue.options),
      })
      break
    case ZodIssueCode.invalid_enum_value:
      message = t('errors.invalid_enum_value', {
        options: util.joinValues(issue.options),
        received: issue.received,
      })
      break
    case ZodIssueCode.invalid_arguments:
      message = t('errors.invalid_arguments')
      break
    case ZodIssueCode.invalid_return_type:
      message = t('errors.invalid_return_type')
      break
    case ZodIssueCode.invalid_date:
      message = t('errors.invalid_date')
      break
    case ZodIssueCode.invalid_string:
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
    case ZodIssueCode.too_small:
      message = t(
        `errors.too_small.${issue.type}.${issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'}`, {
          minimum: issue.type === 'date' ? new Date(issue.minimum as any) : issue.minimum,
        })
      break
    case ZodIssueCode.too_big:
      message = t(
        `errors.too_big.${issue.type}.${issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'}`, {
          maximum: issue.type === 'date' ? new Date(issue.maximum as any) : issue.maximum,
        })
      break
    case ZodIssueCode.invalid_intersection_types:
      message = t('errors.invalid_intersection_types')
      break
    case ZodIssueCode.not_multiple_of:
      message = t('errors.not_multiple_of', {
        multipleOf: issue.multipleOf,
      })
      break
    case ZodIssueCode.not_finite:
      message = t('errors.not_finite')
      break
    case ZodIssueCode.custom:
      message = t('errors.custom')
      break
    default:
      message = defaultErrorMap(issue, _ctx).message
  }
  return { message }
})
