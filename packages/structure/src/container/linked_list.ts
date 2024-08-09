import type { ISequentialContainer } from '../interface'
import { AbstractContainer } from './base'

class ListNode<T> {
  constructor(public val: T, public prev: ListNode<T> | null = null, public next: ListNode<T> | null = null) { }
}

export class LinkedList<T> extends AbstractContainer<T> implements ISequentialContainer<T> {
  protected _length: number = 0
  private _head: ListNode<T> | null = null
  private _tail: ListNode<T> | null = null

  constructor(initialValue?: Iterable<T> | ArrayLike<T>) {
    super()
    const list = initialValue ? Array.from(initialValue) : []

    list.forEach((item) => {
      this.pushBack(item)
    })
  }

  pushBack(item: T): number {
    const newNode = new ListNode(item, this._tail, null)

    if (this._tail) {
      this._tail.next = newNode
      this._tail = newNode
    }
    else {
      this._head = newNode
      this._tail = newNode
    }
    this._length++
    return this._length
  }

  pushFront(item: T): number {
    const newNode = new ListNode(item, null, this._head)
    if (this._head) {
      this._head.prev = newNode
      this._head = newNode
    }
    else {
      this._tail = newNode
      this._head = newNode
    }
    this._length++
    return this._length
  }

  popBack(): T | undefined {
    if (!this._tail)
      return undefined
    const temp = this._tail

    if (this._tail === this._head) {
      this._tail = null
      this._head = null
    }
    else {
      this._tail = this._tail.prev
      this._tail!.next = null
    }
    this._length--
    return temp.val
  }

  popFront(): T | undefined {
    if (!this._head)
      return undefined
    const temp = this._head
    if (this._tail === this._head) {
      this._tail = null
      this._head = null
    }
    else {
      this._head = this._head.next
      this._head!.prev = null
    }
    this._length--
    return temp.val
  }

  front(): T | undefined {
    if (!this._head)
      return undefined
    return this._head.val
  }

  back(): T | undefined {
    if (!this._tail)
      return undefined
    return this._tail.val
  }

  clear(): void {
    this._head = null
    this._tail = null
    this._length = 0
  }

  toArray(): T[] {
    const result: T[] = []
    let currentNode = this._head
    while (currentNode) {
      result.push(currentNode.val)
      currentNode = currentNode.next
    }
    return result
  }
}
