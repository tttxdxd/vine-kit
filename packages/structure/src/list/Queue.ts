import { AbstractContainer } from './base'
import { Deque } from './deque'
import type { IQueue } from './interface'

const MIN_ALLOCATE_SIZE = 1 << 12

export class Queue<T> extends AbstractContainer<T> implements IQueue<T> {
  private _deque: Deque<T>
  protected get _length() {
    return this._deque.size()
  }

  constructor(initialValue?: Iterable<T> | ArrayLike<T>, allocateSize = MIN_ALLOCATE_SIZE) {
    super()
    const list = initialValue ? Array.from(initialValue) : []
    this._deque = new Deque(list, allocateSize)
  }

  enqueue(...item: T[]) {
    item.forEach(i => this._deque.pushBack(i))
    return this._length
  }

  dequeue(): T | undefined {
    return this._deque.popFront()
  }

  peek(): T | undefined {
    return this._deque.front()
  }

  clear(): void {
    this._deque.clear()
  }

  toArray(): T[] {
    return this._deque.toArray()
  }
}
