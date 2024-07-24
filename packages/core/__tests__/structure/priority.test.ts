import { beforeEach, describe, expect, it } from 'vitest'
import { PriorityQueue } from '@vine-kit/core'

describe('priority queue', () => {
  let queue: PriorityQueue<number>

  beforeEach(() => {
    queue = new PriorityQueue<number>()
  })

  it('should initialize an empty queue', () => {
    expect(queue.empty()).toBe(true)
    expect(queue.size()).toBe(0)
  })

  it('should push elements to the queue', () => {
    queue.push(2, 3, 4)
    queue.push(1)

    expect(queue.empty()).toBe(false)
    expect(queue.size()).toBe(4)
    expect(queue.peek()).toBe(1)
  })

  it('should pop elements from the queue', () => {
    queue.push(1, 2, 3, 4)

    const firstElement = queue.pop()
    expect(firstElement).toBe(1)
    expect(queue.size()).toBe(3)
    expect(queue.peek()).toBe(2)

    expect(queue.pop()).toBe(2)
    expect(queue.pop()).toBe(3) 
    expect(queue.pop()).toBe(4)

    expect(queue.empty()).toBe(true)
    expect(queue.size()).toBe(0)
    expect(queue.peek()).toBeUndefined()
  })

  it('should clear the queue', () => {
    queue.push(1, 2, 3)
    queue.clear()

    expect(queue.empty()).toBe(true)
    expect(queue.size()).toBe(0)
    expect(queue.peek()).toBeUndefined()
  })

  it('should handle edge cases', () => {
    const emptyQueueValue = queue.pop()
    expect(emptyQueueValue).toBeUndefined()

    queue.push(1)
    const singleElement = queue.pop()
    expect(singleElement).toBe(1)
    expect(queue.empty()).toBe(true)
    expect(queue.size()).toBe(0)
    expect(queue.peek()).toBeUndefined()
  })
})
