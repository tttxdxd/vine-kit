export interface Deferred<T> {
  pending: boolean
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}

export function deferred<T = void>(): Deferred<T> {
  const deferred = { pending: true } as any
  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  }).finally(() => {
    deferred.pending = false
  })
  return deferred
}
