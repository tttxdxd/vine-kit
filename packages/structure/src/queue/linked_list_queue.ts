import { LinkedList } from '../container'
import { AbstractQueue } from './base'

export class LinkedListQueue extends AbstractQueue<any> {
  constructor(initialValue?: Iterable<any> | ArrayLike<any>) {
    super(LinkedList, initialValue)
  }
}
