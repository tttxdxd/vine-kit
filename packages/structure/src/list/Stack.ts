import { AbstractContainer } from './base'
import { Deque } from './deque'
import type { IStack } from './interface'

const MIN_ALLOCATE_SIZE = 1 << 12

export class Stack<T> extends AbstractContainer<T> implements IStack<T> {
  private _deque: Deque<T>
  protected get _length() {
    return this._deque.size()
  }

  constructor(initialValue?: Iterable<T> | ArrayLike<T>, allocateSize = MIN_ALLOCATE_SIZE) {
    super()
    const list = initialValue ? Array.from(initialValue) : []
    this._deque = new Deque(list, allocateSize)
  }

  push(item: T) {
    return this._deque.pushBack(item)
  }

  pop(): T | undefined {
    return this._deque.popBack()
  }

  top(): T | undefined {
    return this._deque.back()
  }

  clear(): void {
    this._deque.clear()
  }

  toArray(): T[] {
    return this._deque.toArray()
  }
}
