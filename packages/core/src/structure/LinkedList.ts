import { isUndefined } from "..";
import { AbstractContainer } from "./base";

/**
 * 基于链表的队列
 */
export class LinkedList<T> extends AbstractContainer<T>  {
  private _head?: ListNode<T>
  private _tail?: ListNode<T>

  constructor() {
    super()
    this._head = undefined
    this._tail = undefined
    this._length = 0
  }

  clear(): void {
    this._head = undefined
    this._tail = undefined
    this._length = 0
  }

  push(item: T): void
  push(...items: T[]): void
  push(...items: T[]): void {
    for (const item of items) {
      const node = new ListNode(item)

      if (isUndefined(this._tail)) {
        this._head = node
        this._tail = node
      } else {
        this._tail.next = node
        this._tail = node
      }
    }
    this._length += items.length
  }

  pop() {
    if (isUndefined(this._head)) return

    const item = this._head.val
    this._head = this._head.next
    this._length -= 1
    return item
  }

  peek() {
    return this._head
  }

}

class ListNode<T> {
  val: T
  next?: ListNode<T>

  constructor(val: T) {
    this.val = val;
    this.next = undefined;
  }
}
