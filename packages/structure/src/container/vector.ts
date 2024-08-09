import type { ISequentialContainer } from '../interface'
import { AbstractContainer } from './base'

export class Vector<T> extends AbstractContainer<T> implements ISequentialContainer<T> {
  private _list: T[] = []
  protected get _length(): number {
    return this._list.length
  }

  constructor(initialValue?: Iterable<T> | ArrayLike<T>) {
    super()
    this._list = initialValue ? Array.from(initialValue) : []
  }

  pushBack(item: T): number {
    return this._list.push(item)
  }

  pushFront(item: T): number {
    return this._list.unshift(item)
  }

  popBack(): T | undefined {
    return this._list.pop()
  }

  popFront(): T | undefined {
    return this._list.shift()
  }

  front(): T | undefined {
    return this._list[0]
  }

  back(): T | undefined {
    return this._list[this._length - 1]
  }

  clear(): void {
    this._list = []
  }

  toArray(): T[] {
    return this._list
  }
}
