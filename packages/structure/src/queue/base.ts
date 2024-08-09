import type { Constructor } from '@vine-kit/shared'
import { AbstractContainer } from '../container/base'
import type { IQueue, ISequentialContainer } from '../interface'

export class AbstractQueue<T> extends AbstractContainer<T> implements IQueue<T> {
  private _container: ISequentialContainer<T>
  protected get _length() {
    return this._container.size()
  }

  constructor(Container: Constructor<ISequentialContainer<T>>, initialValue?: Iterable<T> | ArrayLike<T>, ...args: any[]) {
    super()
    this._container = new Container(initialValue, ...args)
  }

  enqueue(...item: T[]) {
    item.forEach(i => this._container.pushBack(i))
    return this._length
  }

  dequeue(): T | undefined {
    return this._container.popFront()
  }

  peek(): T | undefined {
    return this._container.front()
  }

  clear(): void {
    this._container.clear()
  }

  toArray(): T[] {
    return this._container.toArray()
  }
}
