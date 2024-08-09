import { Vector } from '../container'
import { AbstractStack } from './base'

export class VectorStack<T> extends AbstractStack<T> {
  constructor(initialValue?: Iterable<T> | ArrayLike<T>) {
    super(Vector, initialValue)
  }
}
