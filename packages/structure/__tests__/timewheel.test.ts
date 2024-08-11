import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TimeWheel } from '@vine-kit/structure'

describe('timeWheel', () => {
  let timeWheel: TimeWheel
  beforeEach(() => {
    timeWheel = new TimeWheel()
  })

  it('should add a task and return an id', () => {
    const callback = vi.fn()
    const id = timeWheel.setTimeout(callback, 100)
    expect(typeof id).toBe('number')
  })

  it('should execute a single task after delay', async () => {
    const callback = vi.fn()
    timeWheel.setInterval(callback, 10)
    await new Promise(r => setTimeout(r, 15))
    expect(callback).toHaveBeenCalled()
  })

  it('should execute a repeating task multiple times', async () => {
    const callback = vi.fn()
    timeWheel.setInterval(callback, 10)
    await new Promise(r => setTimeout(r, 35))
    expect(callback).toHaveBeenCalled()
  })

  it('should not execute a cleared timeout task', async () => {
    const callback = vi.fn()
    const id = timeWheel.setTimeout(callback, 10)
    timeWheel.clearTimeout(id)
    await new Promise(r => setTimeout(r, 15))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should not execute a cleared interval task', async () => {
    const callback = vi.fn()
    const id = timeWheel.setInterval(callback, 10)
    timeWheel.clearTimeout(id)
    await new Promise(r => setTimeout(r, 35))
    expect(callback).not.toHaveBeenCalled()
  })

  it('should handle tasks with arguments', async () => {
    const callback = vi.fn()
    timeWheel.setTimeout(callback, 10, 'arg1', 'arg2')
    await new Promise(r => setTimeout(r, 10))
    expect(callback).toHaveBeenCalledWith('arg1', 'arg2')
  })
})
