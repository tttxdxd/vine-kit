import { beforeEach, describe, expect, it } from 'vitest'

import { Stack } from '@vine-kit/structure'

describe('stack', () => {
  let stack: Stack<number>

  beforeEach(() => {
    stack = new Stack<number>()
  })

  it('should initialize an empty stack', () => {
    expect(stack.isEmpty()).toBe(true)
    expect(stack.size()).toBe(0)
  })

  it('should push items onto the stack', () => {
    stack.push(1)
    stack.push(2)
    stack.push(3)

    expect(stack.isEmpty()).toBe(false)
    expect(stack.size()).toBe(3)
    expect(stack.top()).toBe(3)
  })

  it('should pop items from the stack', () => {
    stack.push(1)
    stack.push(2)
    stack.push(3)

    const poppedItem = stack.pop()
    expect(poppedItem).toBe(3)
    expect(stack.size()).toBe(2)
    expect(stack.top()).toBe(2)

    stack.pop()
    stack.pop()

    expect(stack.isEmpty()).toBe(true)
    expect(stack.size()).toBe(0)
    expect(stack.top()).toBeUndefined()
  })

  it('should clear the stack', () => {
    stack.push(1)
    stack.push(2)
    stack.push(3)

    stack.clear()

    expect(stack.isEmpty()).toBe(true)
    expect(stack.size()).toBe(0)
    expect(stack.top()).toBeUndefined()
  })

  it('should handle edge cases', () => {
    const emptyStackItem = stack.pop()
    expect(emptyStackItem).toBeUndefined()

    stack.push(1)
    const singleItem = stack.pop()
    expect(singleItem).toBe(1)
    expect(stack.isEmpty()).toBe(true)
    expect(stack.size()).toBe(0)
    expect(stack.top()).toBeUndefined()
  })
})
