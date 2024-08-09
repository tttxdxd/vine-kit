import { AbstractContainer } from '../container/base'
import type { IComparator, IHeap } from '../interface'

export class Comparator {
  static compare<T>(a: T, b: T) {
    if (a > b)
      return 1
    else if (a < b)
      return -1
    else return 0
  }

  static reverse<T>(a: T, b: T) {
    if (a > b)
      return -1
    else if (a < b)
      return 1
    else return 0
  }
}

export class Heap<T> extends AbstractContainer<T> implements IHeap<T> {
  private _heap: T[] = []
  protected get _length() {
    return this._heap.length
  }

  constructor(private _compareFn: IComparator<T> = Comparator.compare, initialValue?: Iterable<T> | ArrayLike<T>) {
    super()
    this._heap = initialValue ? Array.from(initialValue) : []
    this._heap.forEach((_, index) => {
      this._shiftUp(index)
    })
  }

  push(item: T): void {
    this._heap.push(item)
    this._shiftUp(this._length - 1)
  }

  pop(): T | undefined {
    if (this.isEmpty())
      return undefined

    this._swap(0, this._length - 1)
    const temp = this._heap.pop()
    this._shiftDown(0)
    return temp
  }

  peek(): T | undefined {
    if (this.isEmpty())
      return undefined
    return this._heap[0]
  }

  clear(): void {
    this._heap = []
  }

  toArray(): T[] {
    const result: T[] = []
    const clone = new Heap(this._compareFn, this._heap)
    while (!clone.isEmpty()) {
      result.push(clone.pop()!)
    }
    return result
  }

  private _shiftUp(i: number): void {
    while (true) {
      if (i === 0)
        break
      const p = this._parent(i)
      if (this._compareFn(this._heap[p], this._heap[i]) < 0)
        break
      this._swap(i, p)
      i = p
    }
  }

  private _shiftDown(i: number): void {
    while (true) {
      const l = this._left(i)
      const r = this._right(i)
      let ma = i

      if (l < this._length && this._compareFn(this._heap[ma], this._heap[l]) > 0) {
        ma = l
      }
      if (r < this._length && this._compareFn(this._heap[ma], this._heap[r]) > 0) {
        ma = r
      }
      if (ma === i)
        break
      this._swap(i, ma)
      i = ma
    }
  }

  private _left(index: number): number {
    return index * 2 + 1
  }

  private _right(index: number): number {
    return index * 2 + 2
  }

  private _parent(index: number): number {
    return Math.floor((index - 1) / 2)
  }

  private _swap(i: number, j: number): void {
    const temp = this._heap[i]
    this._heap[i] = this._heap[j]
    this._heap[j] = temp
  }
}

export class PriorityQueue<T> extends Heap<T> { }
