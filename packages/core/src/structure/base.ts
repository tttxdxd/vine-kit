/**
 * Represents an abstract container.
 * @template T The type of elements stored in the container.
 */
export abstract class AbstractContainer<T> {
  protected _length = 0 // Number of elements in the container

  /**
   * Gets the number of elements in the container.
   */
  get length() {
    return this._length
  }

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
  empty() {
    return this._length === 0
  }

  /**
   * Clears the container by removing all elements.
   * This method must be implemented by derived classes.
   */
  abstract clear(): void

  /**
   * Pushes an item onto the container.
   * This method must be implemented by derived classes.
   * @param item The item to push onto the container.
   */
  abstract push(item: T): void

  /**
   * Pushes multiple items onto the container.
   * This method must be implemented by derived classes.
   * @param items The items to push onto the container.
   */
  abstract push(...items: T[]): void
}

export type CompareFn<T> = (l: T, r: T) => number

export const Compare: CompareFn<any> = (l, r) => {
  if (l > r) return 1
  if (l < r) return -1
  return 0
}

export const CompareReverse: CompareFn<any> = (l, r) => {
  if (l > r) return -1
  if (l < r) return 1
  return 0
}
