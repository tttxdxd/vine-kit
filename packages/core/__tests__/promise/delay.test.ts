import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PromiseUtil } from '@vine-kit/core'

describe('promiseUtil.deferred', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should resolve after the specified delay', async () => {
    const promise = PromiseUtil.delay(1000)

    vi.advanceTimersByTime(1000)

    await expect(promise).resolves.toBeUndefined()
  })

  it('should resolve with the provided value', async () => {
    const value = 'testValue'
    const promise = PromiseUtil.delay(1000, value)

    vi.advanceTimersByTime(1000)

    await expect(promise).resolves.toBe(value)
  })

  it('should handle zero delay', async () => {
    const promise = PromiseUtil.delay(0)

    vi.runAllTimers()

    await expect(promise).resolves.toBeUndefined()
  })
})
