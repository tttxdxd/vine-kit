import { describe, expect, it } from 'vitest'

import { Comparator, Heap } from '@vine-kit/structure'

describe('heap', () => {
  it('should be able to create a heap', () => {
    const heap = new Heap<number>()
    expect(heap).toBeInstanceOf(Heap)
  })

  it('should create a min heap', () => {
    const heap = new Heap()
    expect(heap.peek()).toBe(undefined)
    expect(heap.toArray()).toEqual([])

    heap.push(3)
    expect(heap.peek()).toBe(3)
    expect(heap.toArray()).toEqual([3])

    heap.push(2)
    expect(heap.peek()).toBe(2)
    expect(heap.toArray()).toEqual([2, 3])

    heap.push(1)
    expect(heap.peek()).toBe(1)
    expect(heap.toArray()).toEqual([1, 2, 3])

    heap.push(5)
    expect(heap.peek()).toBe(1)
    expect(heap.toArray()).toEqual([1, 2, 3, 5])

    heap.push(4)
    expect(heap.peek()).toBe(1)
    expect(heap.toArray()).toEqual([1, 2, 3, 4, 5])
  })

  it('should create a max heap', () => {
    const heap = new Heap(Comparator.reverse)
    expect(heap.peek()).toBe(undefined)
    expect(heap.toArray()).toEqual([])

    heap.push(3)
    expect(heap.peek()).toBe(3)
    expect(heap.toArray()).toEqual([3])

    heap.push(2)
    expect(heap.peek()).toBe(3)
    expect(heap.toArray()).toEqual([3, 2])

    heap.push(5)
    expect(heap.peek()).toBe(5)
    expect(heap.toArray()).toEqual([5, 3, 2])

    heap.push(1)
    expect(heap.peek()).toBe(5)
    expect(heap.toArray()).toEqual([5, 3, 2, 1])

    heap.push(4)
    expect(heap.peek()).toBe(5)
    expect(heap.toArray()).toEqual([5, 4, 3, 2, 1])
  })

  it('should create a custom heap', () => {
    const heap = new Heap<{ value: number }>((a, b) => a.value - b.value)

    expect(heap.peek()).toBe(undefined)
    expect(heap.toArray()).toEqual([])
    heap.push({ value: 3 })
    expect(heap.peek()).toEqual({ value: 3 })
    expect(heap.toArray()).toEqual([{ value: 3 }])
    heap.push({ value: 2 })
    expect(heap.peek()).toEqual({ value: 2 })
    expect(heap.toArray()).toEqual([{ value: 2 }, { value: 3 }])
    heap.push({ value: 1 })
    expect(heap.peek()).toEqual({ value: 1 })
    expect(heap.toArray()).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }])
    heap.push({ value: 5 })
    expect(heap.peek()).toEqual({ value: 1 })
    expect(heap.toArray()).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }, { value: 5 }])
    heap.push({ value: 4 })
    expect(heap.peek()).toEqual({ value: 1 })
    expect(heap.toArray()).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }])
  })

  it('should push an element to the heap', () => {
    const heap = new Heap()
    heap.push(3)
    heap.push(2)
    heap.push(1)
    heap.push(5)
    heap.push(4)

    expect(heap.peek()).toBe(1)
    expect(heap.toArray()).toEqual([1, 2, 3, 4, 5])
  })

  it('should pop an element from the heap', () => {
    const heap = new Heap()
    heap.push(3)
    heap.push(2)
    heap.push(1)
    heap.push(5)
    heap.push(4)

    expect(heap.pop()).toBe(1)
    expect(heap.peek()).toBe(2)
    expect(heap.toArray()).toEqual([2, 3, 4, 5])

    expect(heap.pop()).toBe(2)
    expect(heap.peek()).toBe(3)
    expect(heap.toArray()).toEqual([3, 4, 5])
  })

  it('should clear the heap', () => {
    const heap = new Heap()
    heap.push(3)
    heap.push(2)
    heap.push(1)
    heap.push(5)
    heap.push(4)

    expect(heap.peek()).toBe(1)
    expect(heap.toArray()).toEqual([1, 2, 3, 4, 5])

    heap.clear()
    expect(heap.peek()).toBe(undefined)
    expect(heap.toArray()).toEqual([])
  })
})
