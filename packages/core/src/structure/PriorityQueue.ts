import type { CompareFn } from './base'
import { AbstractContainer, Compare } from './base'

/**
 * 优先队列 最小堆
 * @example
 * // 小顶堆
 * const minHeap = new PriorityQueue()
 * // 大顶堆
 * const maxHeap = new PriorityQueue([], (l, r) => r - l)
 */
export class PriorityQueue<T> extends AbstractContainer<T> {
  private _list: T[]
  private _cmp: CompareFn<T>

  constructor(initialValue?: Iterable<T> | ArrayLike<T>, compareFn: CompareFn<T> = Compare) {
    super()
    this._list = initialValue ? Array.from(initialValue) : []
    this._length = this._list.length
    this._cmp = compareFn

    // 通过遍历堆化构建 时间复杂度为 O(n)
    for (let i = this.parent(this._length); i >= 0; i--) {
      this.shiftDown(i)
    }
  }

  clear() {
    this._list = []
    this._length = 0
  }

  /**
   * 元素入堆
   * 时间复杂度 O(log n)
   * @param item
   */
  push(item: T): void
  /**
   * 元素入堆
   * 时间复杂度 O(log n)
   * @param items
   */
  push(...items: T[]): void
  push(...items: T[]) {
    this._list.push(...items)

    for (let i = 0; i < items.length; i++) {
      this.shiftUp(this._length++)
    }
  }

  pop(): T | undefined {
    if (this._length === 0)
      return
    const front = this._list[0]
    const last = this._list.pop()!
    this._length -= 1
    if (this._length) {
      this._list[0] = last
      this.shiftDown(0)
    }
    return front
  }

  /**
   * 访问堆顶元素
   */
  peek() {
    return this._list[0]
  }

  /**
   * 从节点 i 开始，从底至顶堆化
   * @param i
   */
  private shiftUp(i: number) {
    const item = this._list[i]
    while (i > 0) {
      const p = this.parent(i)
      const parentItem = this._list[p]
      if (this._cmp(item, parentItem) > 0)
        break
      this._list[i] = parentItem
      i = p
    }
    this._list[i] = item
  }

  /**
   * 从节点 i 开始，从顶至底堆化
   * @param i
   */
  private shiftDown(i: number) {
    const item = this._list[i]
    const halfLength = this._length >> 1
    while (i < halfLength) {
      const l = this.left(i)
      const r = l + 1
      let min = l
      let minItem = this._list[min]
      if (r < this._length && this._cmp(minItem, this._list[r]) > 0) {
        min = r
        minItem = this._list[r]
      }
      if (this._cmp(item, minItem) < 0)
        break
      this._list[i] = minItem
      i = min
    }
    this._list[i] = item
  }

  private parent(i: number) {
    return (i - 1) >> 1
  }

  private left(i: number) {
    return i << 1 | 1
  }

  private right(i: number) {
    return (i << 1) + 2
  }

  private swap(i: number, j: number) {
    const temp = this._list[i]
    this._list[i] = this._list[j]
    this._list[j] = temp
  }
}
