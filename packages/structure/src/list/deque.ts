import { AbstractContainer } from './base'
import type { IDeque } from './interface'

const MIN_ALLOCATE_SIZE = 1 << 12

export class Deque<T> extends AbstractContainer<T> implements IDeque<T> {
  private _map: (T | undefined)[][]
  private _bucketStart: number
  private _bucketEnd: number
  private _start: number
  private _end: number
  private _bucketSize: number

  constructor(initialValue?: Iterable<T> | ArrayLike<T>, bucketSize = MIN_ALLOCATE_SIZE) {
    super()
    const list = initialValue ? Array.from(initialValue) : []
    const bucketNum = Math.max(Math.ceil(list.length / bucketSize), 1)

    this._map = []
    this._bucketStart = 0
    this._bucketEnd = bucketNum - 1
    this._start = 0
    this._end = list.length % bucketSize - 1
    this._bucketSize = bucketSize
    this._length = list.length

    for (let i = 0; i < bucketNum; ++i) {
      const start = i * bucketSize
      this._map.push(Array.from({ length: bucketSize }))

      for (let j = 0; j < bucketSize && start + j < list.length; ++j) {
        this._map[i][j] = list[start + j]
      }
    }
  }

  pushBack(item: T): number {
    if (this._end + 1 === this._bucketSize) {
      this._map.push(Array.from({ length: this._bucketSize }))
      this._bucketEnd++
      this._end = 0
    }
    else {
      this._end++
    }

    this._map[this._bucketEnd][this._end] = item
    this._length++
    return this._length
  }

  pushFront(item: T): number {
    if (this._start === 0) {
      this._map.unshift(Array.from({ length: this._bucketSize }))
      this._bucketEnd++
      this._start = this._bucketSize - 1
    }
    else {
      this._start--
    }

    this._map[this._bucketStart][this._start] = item
    this._length++
    return this._length
  }

  popBack(): T | undefined {
    if (this._length === 0)
      return undefined

    const temp = this._map[this._bucketEnd][this._end]
    this._map[this._bucketEnd][this._end--] = undefined
    this._length--

    if (this._end === -1) {
      this._bucketEnd--
      this._end = this._bucketSize - 1
    }

    return temp
  }

  popFront(): T | undefined {
    if (this._length === 0)
      return undefined

    const temp = this._map[this._bucketStart][this._start]
    this._map[this._bucketStart][this._start++] = undefined
    this._length--

    if (this._start === this._bucketSize) {
      this._bucketStart++
      this._start = 0
    }
    return temp
  }

  front(): T | undefined {
    return this._map[this._bucketStart][this._start]
  }

  back(): T | undefined {
    return this._map[this._bucketEnd][this._end]
  }

  clear(): void {
    this._map = [Array.from({ length: this._bucketSize })]
    this._bucketStart = 0
    this._bucketEnd = 0
    this._start = 0
    this._end = 0
    this._length = 0
  }

  toArray(): T[] {
    if (this._length === 0)
      return []
    const result = []
    for (let i = this._bucketStart; i <= this._bucketEnd; ++i) {
      const start = i === this._bucketStart ? this._start : 0
      const end = i === this._bucketEnd ? this._end : this._bucketSize
      result.push(...this._map[i].slice(start, end + 1))
    }
    return result as T[]
  }
}
