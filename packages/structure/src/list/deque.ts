// TODO

import { AbstractContainer } from './base'
import type { IDeque } from './interface'

export class Deque<T> extends AbstractContainer<T> implements IDeque<T> {
  private _list: T[]

  constructor() {
    super()
    this._list = []
    this._length = 0
  }

  pushBack(item: T): void {
    this._list.push(item)
    this._length++
  }

  pushFront(item: T): void {
    this._list.unshift(item)
    this._length++
  }

  popBack(): T | undefined {
    this._length--
    return this._list.pop()
  }

  popFront(): T | undefined {
    this._length--
    return this._list.shift()
  }

  front(): T | undefined {
    return this._list[0]
  }

  back(): T | undefined {
    return this._list[this._list.length - 1]
  }

  clear(): void {
    this._list = []
    this._length = 0
  }

  toArray(): T[] {
    return this._list.slice()
  }
}
