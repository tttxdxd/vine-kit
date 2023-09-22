import { notEmptyArray } from '@vine-kit/core'
import { ValidationError } from '../error'
import translation from './zh-CN.json'
import { defineTranslation, setTranslation } from '.'

const locale = defineTranslation({
  lang: 'zh-CN',
  translation,
})

setTranslation(locale)

ValidationError._getMessageFromIssue = (issue, model) => {
  if (notEmptyArray(issue.path))
    return `${model.$schema.getViewByPath(issue.path)?.label ?? ''}(${ValidationError.joinPath(issue.path)}): ${issue.message}`

  return issue.message
}

export default locale
