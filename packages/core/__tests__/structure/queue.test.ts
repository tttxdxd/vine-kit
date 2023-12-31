import { beforeEach, describe, expect, it } from 'vitest'
import { Queue } from '@vine-kit/core'

describe('queue', () => {
  let queue: Queue<number>

  beforeEach(() => {
    queue = new Queue<number>()
  })

  it('should initialize an empty queue', () => {
    expect(queue.empty()).toBe(true)
    expect(queue.size()).toBe(0)
  })

  it('should push elements to the queue', () => {
    queue.push(1)
    queue.push(2, 3, 4)

    expect(queue.empty()).toBe(false)
    expect(queue.size()).toBe(4)
    expect(queue.front()).toBe(1)
  })

  it('should pop elements from the queue', () => {
    queue.push(1, 2, 3, 4)

    const firstElement = queue.pop()
    expect(firstElement).toBe(1)
    expect(queue.size()).toBe(3)
    expect(queue.front()).toBe(2)

    queue.pop()
    queue.pop()
    queue.pop()

    expect(queue.empty()).toBe(true)
    expect(queue.size()).toBe(0)
    expect(queue.front()).toBeUndefined()
  })

  it('should clear the queue', () => {
    queue.push(1, 2, 3)
    queue.clear()

    expect(queue.empty()).toBe(true)
    expect(queue.size()).toBe(0)
    expect(queue.front()).toBeUndefined()
  })

  it('should handle edge cases', () => {
    const emptyQueueValue = queue.pop()
    expect(emptyQueueValue).toBeUndefined()

    queue.push(1)
    const singleElement = queue.pop()
    expect(singleElement).toBe(1)
    expect(queue.empty()).toBe(true)
    expect(queue.size()).toBe(0)
    expect(queue.front()).toBeUndefined()
  })
})
