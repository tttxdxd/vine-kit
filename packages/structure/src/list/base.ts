import type { IContainer } from './interface'

/**
 * Represents an abstract container.
 * @template T The type of elements stored in the container.
 */
export abstract class AbstractContainer<T> implements IContainer<T> {
  protected _length = 0 // Number of elements in the container

  /**
   * Returns the number of elements in the container.
   * @returns The number of elements in the container.
   */
  size() {
    return this._length
  }

  /**
   * Checks if the container is empty.
   * @returns True if the container is empty, false otherwise.
   */
  isEmpty() {
    return this._length === 0
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.toArray()[Symbol.iterator]()
  }

  abstract clear(): void
  abstract toArray(): T[]
}

export type CompareFn<T> = (l: T, r: T) => number

export const Compare: CompareFn<any> = (l, r) => {
  if (l > r)
    return 1
  if (l < r)
    return -1
  return 0
}

export const CompareReverse: CompareFn<any> = (l, r) => {
  if (l > r)
    return -1
  if (l < r)
    return 1
  return 0
}
