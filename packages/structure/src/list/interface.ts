/**
 * Defines the generic container interface
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

export interface IList<T> extends Array<T>, IContainer<T> {

}

export interface ILinkedList<T = void> extends IContainer<T> {

}

/**
 * A queue is a FIFO data structure.
 */
export interface IQueue<T = void> extends IContainer<T> {
  /**
   * push an item onto the queue
   * O(1)
   */
  enqueue: (item: T) => void
  /**
   * pop the top item off the queue
   * O(1)
   */
  dequeue: () => T | undefined
  /**
   * peek the top item without popping it off the queue
   * O(1)
   */
  peek: () => T | undefined
}

/**
 * A stack is a LIFO data structure.
 */
export interface IStack<T = void> extends IContainer<T> {
  /**
   * push an item onto the stack
   * O(1)
   */
  push: (item: T) => void
  /**
   * pop the top item off the stack
   * O(1)
   */
  pop: () => T | undefined
  /**
   * peek the top item without popping it off the stack
   * O(1)
   */
  peek: () => T | undefined
}

/**
 * A deque is a double-ended queue.
 */
export interface IDeque<T = void> extends IContainer<T> {
  /**
   * push an item onto the deque
   * O(1)
   */
  pushBack: (item: T) => void
  /**
   * pop the top item off the deque
   * O(1)
   */
  pushFront: (item: T) => void
  /**
   * pop the top item off the deque
   * O(1)
   */
  popBack: () => T | undefined
  /**
   * pop the top item off the deque
   * O(1)
   */
  popFront: () => T | undefined
  /**
   * peek the top item without popping it off the deque
   * O(1)
   */
  front: () => T | undefined
  /**
   * peek the top item without popping it off the deque
   * O(1)
   */
  back: () => T | undefined
}
