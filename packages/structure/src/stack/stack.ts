import { MIN_ALLOCATE_SIZE } from '../constants'
import { Deque } from '../container'
import { AbstractStack } from './base'

export class Stack<T> extends AbstractStack<T> {
  constructor(initialValue?: Iterable<T> | ArrayLike<T>, allocateSize = MIN_ALLOCATE_SIZE) {
    super(Deque, initialValue, allocateSize)
  }
}
