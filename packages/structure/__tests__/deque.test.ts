import { describe, expect, it } from 'vitest'

import { Deque } from '@vine-kit/structure'

describe('deque', () => {
  it('should initialize as empty', () => {
    const deque = new Deque<number>()
    expect(deque.size()).toBe(0)
    expect(deque.toArray()).toEqual([])
    expect(deque.front()).toBeUndefined()
    expect(deque.back()).toBeUndefined()
  })

  it('should pushBack correctly', () => {
    const deque = new Deque<number>()
    expect(deque.pushBack(1)).toBe(1)
    expect(deque.pushBack(2)).toBe(2)
    expect(deque.toArray()).toEqual([1, 2])
  })

  it('should pushFront correctly', () => {
    const deque = new Deque<number>()
    expect(deque.pushFront(1)).toBe(1)
    expect(deque.pushFront(2)).toBe(2)
    expect(deque.toArray()).toEqual([2, 1])
  })

  it('should popBack correctly', () => {
    const deque = new Deque<number>([1, 2, 3])
    expect(deque.popBack()).toBe(3)
    expect(deque.popBack()).toBe(2)
    expect(deque.toArray()).toEqual([1])
  })

  it('should popFront correctly', () => {
    const deque = new Deque<number>([1, 2, 3])
    expect(deque.popFront()).toBe(1)
    expect(deque.popFront()).toBe(2)
    expect(deque.toArray()).toEqual([3])
  })

  it('should return the correct front and back elements', () => {
    const deque = new Deque<number>([1, 2, 3])
    expect(deque.front()).toBe(1)
    expect(deque.back()).toBe(3)
  })

  it('should clear the deque correctly', () => {
    const deque = new Deque<number>([1, 2, 3])
    deque.clear()
    expect(deque.toArray()).toEqual([])
  })

  it('should expand on pushBack', () => {
    const count = 10240
    const deque = new Deque<number>()
    const list = []
    for (let i = 0; i < count; ++i) {
      expect(deque.pushBack(i)).toBe(list.push(i))
      expect(deque.size()).toBe(list.length)
    }
    expect(deque.size()).toBe(count)
  })

  it('should expand on pushFront', () => {
    const count = 10240
    const deque = new Deque<number>()
    const list = []
    for (let i = 0; i < count; ++i) {
      expect(deque.pushFront(i)).toBe(list.unshift(i))
      expect(deque.size()).toBe(list.length)
    }
    expect(deque.size()).toBe(count)
  })
})
