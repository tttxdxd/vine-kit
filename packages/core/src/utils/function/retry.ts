import { isFunction, sleep } from '..'

type IFunction = (...args: unknown[]) => unknown

export interface RetryOptions {
  /**  */
  receiver?: unknown
  /** 最大重试次数 */
  retryTimes?: number
  /** 错误处理 */
  onError?: (error: unknown) => void
}

export interface RetryAsyncOptions extends RetryOptions {
  /** 重试延迟 */
  retryInterval?: number | ((current: number, maxTimes: number) => number)
}

export function retry<T extends IFunction>(this: unknown, retryFn: T, options: RetryOptions = {}): T {
  let defaultRetry = options.retryTimes ?? 1
  let error: unknown

  return ((...args: Parameters<T>) => {
    do {
      try {
        return retryFn.bind(options.receiver || this)(...args)
      }
      catch (err) {
        error = err
      }
    } while (defaultRetry-- > 0)

    if (options.onError)
      options.onError(error)
    else throw error
  }) as any
}

export function retryAsync<T extends IFunction>(this: unknown, retryFn: T, options: RetryAsyncOptions = {}): T {
  let defaultRetry = options.retryTimes ?? 1
  const defaultInterval = options.retryInterval ?? 0
  let error: unknown

  return (async (...args: Parameters<T>) => {
    do {
      try {
        return await retryFn.bind(options.receiver || this)(...args)
      }
      catch (err) {
        error = err
      }
      const waitMs = isFunction(defaultInterval) ? defaultInterval(defaultRetry, options.retryTimes ?? 1) : defaultInterval

      if (waitMs > 0)
        await sleep(waitMs)
    } while (defaultRetry-- > 0)

    if (options.onError)
      options.onError(error)
    else throw error
  }) as any
}
