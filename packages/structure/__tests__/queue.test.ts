import { beforeEach, describe, expect, it } from 'vitest'

import { Queue } from '@vine-kit/structure'

describe('queue', () => {
  let queue: Queue<number>

  beforeEach(() => {
    queue = new Queue<number>()
  })

  it('should initialize an empty queue', () => {
    expect(queue.isEmpty()).toBe(true)
    expect(queue.size()).toBe(0)
  })

  it('should enqueue elements to the queue', () => {
    queue.enqueue(1)
    queue.enqueue(2, 3, 4)

    expect(queue.isEmpty()).toBe(false)
    expect(queue.size()).toBe(4)
    expect(queue.peek()).toBe(1)
  })

  it('should enqueue elements from the queue', () => {
    queue.enqueue(1, 2, 3, 4)

    const firstElement = queue.dequeue()
    expect(firstElement).toBe(1)
    expect(queue.size()).toBe(3)
    expect(queue.peek()).toBe(2)

    queue.dequeue()
    queue.dequeue()
    queue.dequeue()

    expect(queue.isEmpty()).toBe(true)
    expect(queue.size()).toBe(0)
    expect(queue.peek()).toBeUndefined()
  })

  it('should clear the queue', () => {
    queue.enqueue(1, 2, 3)
    queue.clear()

    expect(queue.isEmpty()).toBe(true)
    expect(queue.size()).toBe(0)
    expect(queue.peek()).toBeUndefined()
  })

  it('should handle edge cases', () => {
    const emptyQueueValue = queue.dequeue()
    expect(emptyQueueValue).toBeUndefined()

    queue.enqueue(1)
    const singleElement = queue.dequeue()
    expect(singleElement).toBe(1)
    expect(queue.isEmpty()).toBe(true)
    expect(queue.size()).toBe(0)
    expect(queue.peek()).toBeUndefined()
  })
})
