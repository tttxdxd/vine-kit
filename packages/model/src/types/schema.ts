import type { IssueCode, ParsedType } from '../locales'

interface IssueBase {
  path: (string | number)[]
  message?: string
}

interface InvalidTypeIssue extends IssueBase {
  code: IssueCode.invalid_type
  expected: ParsedType
  received: ParsedType
}

export type StringValidation =
  | 'email'
  | 'url'
  | 'emoji'
  | 'uuid'
  | 'regex'
  | 'cuid'
  | 'cuid2'
  | 'ulid'
  | 'datetime'
  | 'ip'
  | { includes: string; position?: number }
  | { startsWith: string }
  | { endsWith: string }

export interface InvalidStringIssue extends IssueBase {
  code: typeof IssueCode.invalid_string
  validation: StringValidation
}

interface InvalidLiteralIssue extends IssueBase {
  code: IssueCode.invalid_literal
  expected: unknown
  received: unknown
}

interface TooSmallIssue extends IssueBase {
  code: IssueCode.too_small
  minimum: number | bigint
  inclusive: boolean
  exact?: boolean
  type: ParsedType.number | ParsedType.string
}
interface TooBigIssue extends IssueBase {
  code: IssueCode.too_big
  minimum: number | bigint
  inclusive: boolean
  exact?: boolean
  type: ParsedType.number | ParsedType.string
}

interface CustomIssue extends IssueBase {
  code: typeof IssueCode.custom
  received: unknown
  params?: { [k: string]: any }
}

type IssueOptionalMessage =
  | InvalidTypeIssue
  | InvalidLiteralIssue
  | InvalidStringIssue
  | TooSmallIssue
  | TooBigIssue
  | CustomIssue

export type Issue = IssueOptionalMessage & {
  fatal?: boolean
  message: string
}
