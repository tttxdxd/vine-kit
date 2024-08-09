import { MIN_ALLOCATE_SIZE } from '../constants'
import type { ISequentialContainer } from '../interface'
import { AbstractContainer } from './base'

/**
 * A deque (double-ended queue) implementation using a bucketed array.
 */
export class Deque<T> extends AbstractContainer<T> implements ISequentialContainer<T> {
  private _map: (T | undefined)[][]
  private _bucketStart: number
  private _bucketEnd: number
  private _start: number
  private _end: number
  private _bucketSize: number
  private _bucketNum: number
  protected _length: number

  constructor(initialValue?: Iterable<T> | ArrayLike<T>, bucketSize = MIN_ALLOCATE_SIZE) {
    super()
    const list = initialValue ? Array.from(initialValue) : []
    const bucketNum = Math.max(Math.ceil(list.length / bucketSize), 1)

    this._bucketSize = bucketSize
    this._bucketNum = bucketNum
    this._map = []
    this._bucketStart = this._bucketEnd = 0
    this._start = this._end = (bucketSize - list.length % bucketSize) >> 1
    this._length = 0

    for (let i = 0; i < bucketNum; ++i) {
      this._map.push(Array.from({ length: bucketSize }))
    }
    list.forEach((item) => {
      this.pushBack(item)
    })
  }

  pushBack(item: T): number {
    if (this._length) {
      if (this._end < this._bucketSize - 1) {
        this._end += 1
      }
      else if (this._bucketEnd < this._bucketNum - 1) {
        this._bucketEnd++
        this._end = 0
      }
      else {
        this._bucketEnd = 0
        this._end = 0
      }
      if (this._needAllocate())
        this._allocate()
    }

    this._length++
    this._map[this._bucketEnd][this._end] = item
    return this._length
  }

  pushFront(item: T): number {
    if (this._length) {
      if (this._start > 0) {
        this._start--
      }
      else if (this._bucketStart > 0) {
        this._bucketStart--
        this._start = this._bucketSize - 1
      }
      else {
        this._bucketStart = this._bucketNum - 1
        this._start = this._bucketSize - 1
      }
      if (this._needAllocate())
        this._allocate()
    }

    this._map[this._bucketStart][this._start] = item
    this._length++
    return this._length
  }

  popBack(): T | undefined {
    if (this.isEmpty())
      return undefined

    const temp = this._map[this._bucketEnd][this._end]
    this._map[this._bucketEnd][this._end] = undefined
    this._length--

    if (this._length) {
      if (this._end > 0) {
        this._end--
      }
      else if (this._bucketEnd > 0) {
        this._bucketEnd--
        this._end = this._bucketSize - 1
      }
      else {
        this._bucketEnd = this._bucketNum - 1
        this._end = this._bucketSize - 1
      }
    }

    return temp
  }

  popFront(): T | undefined {
    if (this.isEmpty())
      return undefined

    const temp = this._map[this._bucketStart][this._start]
    this._map[this._bucketStart][this._start] = undefined
    this._length--

    if (this._length) {
      if (this._start < this._bucketSize - 1) {
        this._start++
      }
      else if (this._bucketStart < this._bucketNum - 1) {
        this._bucketStart++
        this._start = 0
      }
      else {
        this._bucketStart = 0
        this._start = 0
      }
    }

    return temp
  }

  front(): T | undefined {
    if (this.isEmpty())
      return undefined
    return this._map[this._bucketStart][this._start]
  }

  back(): T | undefined {
    if (this.isEmpty())
      return undefined
    return this._map[this._bucketEnd][this._end]
  }

  clear(): void {
    this._map = [Array.from({ length: this._bucketSize })]
    this._bucketStart = this._bucketEnd = this._length = 0
    this._start = this._end = this._bucketSize >> 1
  }

  toArray(): T[] {
    if (this.isEmpty())
      return []
    const result = []
    for (let i = this._bucketStart; i <= this._bucketEnd; ++i) {
      const start = i === this._bucketStart ? this._start : 0
      const end = i === this._bucketEnd ? this._end + 1 : this._bucketSize
      result.push(...this._map[i].slice(start, end))
    }
    return result as T[]
  }

  private _needAllocate(): boolean {
    return this._bucketEnd === this._bucketStart && this._end === this._start
  }

  private _allocate(): void {
    const addBucketNum = this._bucketNum >> 1 || 1
    const newMap: (T | undefined)[][] = []

    for (let i = 0; i < addBucketNum; i++) {
      newMap.push(Array.from({ length: this._bucketSize }))
    }
    for (let i = this._bucketStart; i < this._bucketNum; i++) {
      newMap.push(this._map[i])
    }
    for (let i = 0; i < this._bucketEnd; i++) {
      newMap.push(this._map[i])
    }
    newMap.push(this._map[this._bucketEnd].slice())
    for (let i = 0; i < this._bucketNum; ++i) {
      newMap.push(Array.from({ length: this._bucketSize }))
    }
    this._bucketStart = addBucketNum
    this._bucketEnd = this._bucketNum + addBucketNum
    this._map = newMap
    this._bucketNum = newMap.length
  }
}
