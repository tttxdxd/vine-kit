import { Vector } from '../container'
import { AbstractQueue } from './base'

export class VectorQueue extends AbstractQueue<any> {
  constructor(initialValue?: Iterable<any> | ArrayLike<any>) {
    super(Vector, initialValue)
  }
}
