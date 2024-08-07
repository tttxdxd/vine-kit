import { AbstractContainer } from './base'

/**
 * Represents a stack data structure.
 */
export class Stack<T> extends AbstractContainer<T> {
  private _list: T[] // Array to store the stack elements

  /**
   * Creates a new instance of Stack.
   * @param initialValue Optional. An iterable or array-like object to initialize the stack with.
   */
  constructor(initialValue?: Iterable<T> | ArrayLike<T>) {
    super()
    this._list = initialValue ? Array.from(initialValue) : []
  }

  /**
   * Clears the stack by removing all elements.
   */
  clear(): void {
    this._list = []
    this._length = 0
  }

  /**
   * Pushes an item onto the top of the stack.
   * @param item The item to push onto the stack.
   * @returns The new length of the stack.
   */
  push(item: T): number {
    this._list.push(item) // Add the item to the end of the array
    this._length += 1
    return this._length
  }

  /**
   * Removes and returns the top item from the stack.
   * @returns The top item of the stack, or undefined if the stack is empty.
   */
  pop(): T | undefined {
    if (this._length === 0)
      return undefined // Stack is empty

    this._length -= 1
    return this._list.pop() // Remove and return the last item from the array
  }

  /**
   * Returns the top item of the stack without removing it.
   * @returns The top item of the stack, or undefined if the stack is empty.
   */
  top(): T | undefined {
    if (this._length === 0)
      return undefined // Stack is empty

    return this._list[this._length - 1] // Return the last item of the array
  }

  toArray(): T[] {
    return this._list.slice()
  }
}
