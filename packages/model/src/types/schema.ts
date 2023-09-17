import type { MetaType } from './meta'

export enum IssueCode {
  invalid_type = 'invalid_type',
  invalid_literal = 'invalid_literal',
  custom = 'custom',
  // invalid_union = 'invalid_union',
  // invalid_union_discriminator = 'invalid_union_discriminator',
  // invalid_enum_value = 'invalid_enum_value',
  // unrecognized_keys = 'unrecognized_keys',
  // invalid_arguments = 'invalid_arguments',
  // invalid_return_type = 'invalid_return_type',
  // invalid_date = 'invalid_date',
  invalid_string = 'invalid_string',
  too_small = 'too_small',
  too_big = 'too_big',
  // invalid_intersection_types = 'invalid_intersection_types',
  // not_multiple_of = 'not_multiple_of',
  // not_finite = 'not_finite',
}

export enum ParsedType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  undefined = 'undefined',
  unknown = 'unknown',
}

interface IssueBase {
  path: (string | number)[]
  message?: string
}

interface InvalidTypeIssue extends IssueBase {
  code: IssueCode.invalid_type
  expected: ParsedType
  received: ParsedType
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
  params?: { [k: string]: any }
}

type IssueOptionalMessage =
  | InvalidTypeIssue
  | InvalidLiteralIssue
  | TooSmallIssue
  | TooBigIssue
  | CustomIssue

export type Issue = IssueOptionalMessage & {
  fatal?: boolean
  message: string
}
