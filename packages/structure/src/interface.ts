/****
 * Defines the generic container interface.
 */
export interface IContainer<T = void> {
  /**
   * Clears all items from the container.
   */
  clear: () => void
  /**
   * Returns the number of items in this container.
   */
  size: () => number
  /**
   * Checks if the container is empty.
   */
  isEmpty: () => boolean
  /**
   * Converts the container's items into an array.
   */
  toArray: () => T[]
}

/**
 * Defines a sequential container interface.
 */
export interface ISequentialContainer<T = void> extends IContainer<T> {
  /**
   * Adds an item to the back of the container.
   * @param item - The item to add.
   * @returns The new size of the container.
   */
  pushBack: (item: T) => number

  /**
   * Adds an item to the front of the container.
   * @param item - The item to add.
   * @returns The new size of the container.
   */
  pushFront: (item: T) => number

  /**
   * Removes and returns the item from the back.
   * @returns The removed item, or undefined if empty.
   */
  popBack: () => T | undefined

  /**
   * Removes and returns the item from the front.
   * @returns The removed item, or undefined if empty.
   */
  popFront: () => T | undefined

  /**
   * Returns the item at the front without removing it.
   * @returns The front item, or undefined if empty.
   */
  front: () => T | undefined

  /**
   * Returns the item at the back without removing it.
   * @returns The back item, or undefined if empty.
   */
  back: () => T | undefined
}

/**
 * Defines a queue interface (FIFO).
 */
export interface IQueue<T = void> extends IContainer<T> {
  /**
   * Adds an item to the queue.
   * @param item - The item to add.
   */
  enqueue: (item: T) => void

  /**
   * Removes and returns the item from the front.
   * @returns The removed item, or undefined if empty.
   */
  dequeue: () => T | undefined

  /**
   * Returns the front item without removing it.
   * @returns The front item, or undefined if empty.
   */
  peek: () => T | undefined
}

/**
 * Defines a stack interface (LIFO).
 */
export interface IStack<T = void> extends IContainer<T> {
  /**
   * Adds an item to the stack.
   * @param item - The item to add.
   */
  push: (item: T) => void

  /**
   * Removes and returns the item from the top.
   * @returns The removed item, or undefined if empty.
   */
  pop: () => T | undefined

  /**
   * Returns the top item without removing it.
   * @returns The top item, or undefined if empty.
   */
  top: () => T | undefined
}

export interface IHeap<T = void> extends IContainer<T> {
  /**
   * Adds an item to the heap.
   * O(log n)
   * @param item - The item to add.
   */
  push: (item: T) => void

  /**
   * Removes and returns the item from the top.
   * O(log n)
   * @returns The removed item, or undefined if empty.
   */
  pop: () => T | undefined

  /**
   * Returns the top item without removing it.
   * O(1)
   * @returns The top item, or undefined if empty.
   */
  peek: () => T | undefined
}

export interface IComparator<T = void> {
  (a: T, b: T): number
}
