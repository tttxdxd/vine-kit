/**
 * FIFO
 */

import { AbstractContainer } from './base'

const QUEUE_CONSTANT = {
  ALLOCATE_SIGMA: 0.5,
  MIN_ALLOCATE_SIZE: (1 << 12), // 4096
}

export class Queue<T> extends AbstractContainer<T> {
  private _list: (T | undefined)[]
  private _first = 0

  constructor(initialValue?: Iterable<T> | ArrayLike<T>) {
    super()
    this._list = initialValue ? Array.from(initialValue) : []
  }

  clear() {
    this._list = []
    this._first = 0
    this._length = 0
  }

  push(...items: T[]) {
    this.resize()
    this._list.push(...items)
    this._length += items.length
  }

  pop() {
    if (this._length === 0)
      return undefined

    const temp = this._list[this._first]

    this._list[this._first] = undefined
    this._length -= 1
    this._first += 1

    return temp
  }

  /**
   * O(1)
   */
  peek(): T | undefined {
    if (this._length === 0)
      return undefined

    return this._list[this._first]
  }

  toArray() {
    return this._list.slice(this._first, this._length) as T[]
  }

  private resize() {
    if (this._first === 0)
      return

    const capacity = this._list.length

    if (capacity > QUEUE_CONSTANT.MIN_ALLOCATE_SIZE && this._first > capacity * QUEUE_CONSTANT.ALLOCATE_SIGMA) {
      this._list = this._list.slice(this._first, this._first + this._length)
      this._first = 0
    }
  }
}
