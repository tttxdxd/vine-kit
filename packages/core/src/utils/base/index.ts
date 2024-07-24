export function assert(condition: boolean, message: string): asserts condition
export function assert(condition: boolean, error: Error): asserts condition
export function assert(condition: boolean, messageOrError: string | Error): asserts condition {
  if (!condition)
    throw messageOrError instanceof Error ? messageOrError : new Error(messageOrError)
}
