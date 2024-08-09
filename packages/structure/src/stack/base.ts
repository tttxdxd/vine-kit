import type { Constructor } from '@vine-kit/shared'
import { AbstractContainer } from '../container/base'
import type { ISequentialContainer, IStack } from '../interface'

export abstract class AbstractStack<T> extends AbstractContainer<T> implements IStack<T> {
  private _container: ISequentialContainer<T>
  protected get _length() {
    return this._container.size()
  }

  constructor(Container: Constructor<ISequentialContainer<T>>, initialValue?: Iterable<T> | ArrayLike<T>, ...args: any[]) {
    super()
    this._container = new Container(initialValue, ...args)
  }

  push(item: T) {
    return this._container.pushBack(item)
  }

  pop(): T | undefined {
    return this._container.popBack()
  }

  top(): T | undefined {
    return this._container.back()
  }

  clear(): void {
    this._container.clear()
  }

  toArray(): T[] {
    return this._container.toArray()
  }
}
