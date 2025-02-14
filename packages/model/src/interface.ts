export interface ParseContext {
  data: any
  issues: ValidationIssue[]
  path: (string | number)[]
  parent: ParseContext | null
}

export interface ParseInput {
  data: any
  path: (string | number)[]
  parent: ParseContext
}

export interface ValidationIssue {
  message: string
  path: (string | number)[]
}

export interface Validator<T = unknown> {
  validate: (val: T) => boolean | Promise<boolean>
  message: string | ((val: T) => string)
}
