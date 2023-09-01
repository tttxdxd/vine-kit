/**
 * Resolves a Promise after a specified amount of time.
 *
 * ```js
 * import { delay } from '@vine-kit/core'
 *
 * delay(300, "foo").then(result => {
 *   // Executed after 300 milliseconds
 *   result //=> "foo"
 * })
 * ```
 *
 * @param ms Milliseconds to wait before resolving.
 * @param value Argument to be resolved by this Promise.
 */
export function delay(ms: number, value: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms, value)
  })
}

export const sleep = delay
