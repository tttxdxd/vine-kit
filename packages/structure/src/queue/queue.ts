import { MIN_ALLOCATE_SIZE } from '../constants'
import { Deque } from '../container'
import { AbstractQueue } from './base'

export class Queue<T> extends AbstractQueue<T> {
  constructor(initialValue?: Iterable<T> | ArrayLike<T>, allocateSize = MIN_ALLOCATE_SIZE) {
    super(Deque, initialValue, allocateSize)
  }
}
