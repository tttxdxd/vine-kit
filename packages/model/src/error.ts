import type { ValidationIssue } from './interface'

export class ValidationError extends Error {
  constructor(public issues: ValidationIssue[]) {
    super()
  }

  toString() {
    return JSON.stringify(this.issues, null, 2)
  }
}
