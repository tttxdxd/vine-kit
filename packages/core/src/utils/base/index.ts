export function assert(condition: boolean, message: string): asserts condition
export function assert(condition: boolean, error: Error): asserts condition
export function assert(condition: boolean, factory: () => Error | string): asserts condition
export function assert(condition: boolean, messageOrError: string | Error | (() => Error | string)): asserts condition {
  if (!condition) {
    if (typeof messageOrError === 'string') {
      throw new TypeError(messageOrError)
    }
    else if (messageOrError instanceof Error) {
      throw messageOrError
    }
    else {
      throw messageOrError()
    }
  }
}
