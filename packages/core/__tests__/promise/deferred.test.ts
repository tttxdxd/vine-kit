import { describe, expect, it, vi } from 'vitest'
import { PromiseUtil } from '@vine-kit/core'

describe('promiseUtil.deferred', () => {
  it('should create a deferred object with pending status', () => {
    const result = PromiseUtil.deferred<number>()
    expect(result.pending).toBe(true)
  })

  it('should resolve the promise', async () => {
    const result = PromiseUtil.deferred<number>()
    const resolver = vi.fn()
    result.promise.then(resolver)
    result.resolve(1)
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 0)
    })
    expect(resolver).toHaveBeenCalledWith(1)
    expect(result.pending).toBe(false)
  })

  it('should reject the promise', async () => {
    const result = PromiseUtil.deferred<number>()
    const rejecter = vi.fn()
    result.promise.catch(rejecter)
    result.reject(new Error('Test error'))
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 0)
    })
    expect(rejecter).toHaveBeenCalledWith(new Error('Test error'))
    expect(result.pending).toBe(false)
  })

  it('should set pending to false after finally block', async () => {
    const result = PromiseUtil.deferred<number>()

    result.promise.finally(() => {
      expect(result.pending).toBe(false)
    })
    expect(result.pending).toBe(true)
    result.resolve(0)
  })
})
