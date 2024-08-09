import { LinkedList } from '../container'
import { AbstractStack } from './base'

export class LinkedListStack<T> extends AbstractStack<T> {
  constructor(initialValue?: Iterable<T> | ArrayLike<T>) {
    super(LinkedList, initialValue)
  }
}
