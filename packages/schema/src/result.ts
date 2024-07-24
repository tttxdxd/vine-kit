export interface ValidationError {
  path?: (string | number)[]
  message: string
}

export function defineSchemaError(message: string, path?: (string | number)[]): ValidationError {
  return { message, path }
}

export interface ResultOk<T> {
  type: 'ok'
  value: T
}

export interface ResultErr<T> {
  type: 'err'
  value: T
}

export function ok<T>(value: T) {
  return { type: 'ok', value }
}

export function err<T>(value: T) {
  return { type: 'err', value }
}
