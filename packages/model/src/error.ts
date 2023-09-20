import { notEmptyArray } from '@vine-kit/core'
import type { IModel } from './types/model'
import type { Issue } from './types/schema'

export class ValidationError extends Error {
  static MAX_ISSUES_IN_MESSAGE = 1
  static ISSUE_SEPARATOR = '; '
  static UNION_SEPARATOR = ', or '

  issues: any[]

  constructor(message: string, issues: any[]) {
    super(message)
    this.name = 'ValidationError'
    this.issues = issues
  }

  static fromSchema(issues: Issue[], model: IModel<any>) {
    const maxIssuesInMessage = ValidationError.MAX_ISSUES_IN_MESSAGE
    const issueSeparator = ValidationError.ISSUE_SEPARATOR

    const message = issues
      // limit max number of issues printed in the reason section
      .slice(0, maxIssuesInMessage)
      // format error message
      .map(issue =>
        ValidationError.getMessageFromIssue(issue, model),
      )
      // concat as string
      .join(issueSeparator)

    return new ValidationError(message, issues)
  }

  static getMessageFromIssue(issue: Issue, model: IModel<any>) {
    const issueSeparator = ValidationError.ISSUE_SEPARATOR
    const unionSeparator = ValidationError.UNION_SEPARATOR

    // if (issue.code === 'invalid_union') {
    //   return issue.unionErrors
    //     .reduce<string[]>((acc, zodError) => {
    //       const newIssues = zodError.issues
    //         .map(issue =>
    //           ValidationError.getMessageFromIssue(issue, model),
    //         )
    //         .join(issueSeparator)

    //       if (!acc.includes(newIssues))
    //         acc.push(newIssues)

    //       return acc
    //     }, [])
    //     .join(unionSeparator)
    // }

    return ValidationError._getMessageFromIssue(issue, model)
  }

  static _getMessageFromIssue(issue: Issue, model: IModel<any>) {
    if (notEmptyArray(issue.path))
      return `${issue.message} at "${ValidationError.joinPath(issue.path)}"`

    return issue.message
  }

  static joinPath(path: Array<string | number>): string {
    return path.reduce<string>((acc, item) => {
      // handle numeric indices
      if (typeof item === 'number')
        return `${acc}[${item.toString()}]`

      // handle normal values
      const separator = acc.length === 0 ? '' : '.'
      return acc + separator + item
    }, '')
  }
}
