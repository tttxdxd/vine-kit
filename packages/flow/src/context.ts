import { isUndefined } from '@vine-kit/core'

export class Context<T extends Record<string, any>> {
  public value: T

  constructor(value: T) {
    this.value = value
  }

  get(): T
  get<K extends keyof T>(key: K): T[K]
  get(key?: any): any {
    return key !== undefined ? this.value[key] : this.value
  }

  set(val: T): this
  set<K extends keyof T>(key: K, val: T[K]): this
  set(key: any, value?: any) {
    if (value === undefined)
      this.value = key
    else
      (this.value as any)[key] = value
    return this
  }

  static create<T extends Record<string, any>>(value: T): Context<T> {
    return new Context(value)
  }
}

export function defineContext<T extends Record<string, any>>(value: T) {
  return class DefineContext extends Context<T> {
    constructor() {
      super(value)
    }
  }
}

export class FlowContext<T = any> {
  protected readonly requestData?: T
  protected readonly container

  protected _if_?: boolean
  protected _switch_?: string

  constructor(requestData?: T, contexts: (new () => any)[] = []) {
    this.container = new Map()
    this.requestData = requestData

    for (const C of contexts)
      this.container.set(C, new C())
  }

  getRequestData() {
    return this.requestData
  }

  get<C extends new () => any>(cls: C): InstanceType<C>
  get<C extends new () => any>(cls: C): InstanceType<C> {
    const instance = this.container.get(cls)

    if (isUndefined(instance))
      throw new Error(`${cls.name} is not defined in flow context`)

    return instance
  }

  set<C extends new () => any>(cls: C, instance: InstanceType<C>) {
    this.container.set(cls, instance)
    return this
  }

  setIfResult(result: boolean) {
    this._if_ = result
  }

  getIfResult() {
    if (isUndefined(this._if_))
      throw new Error('if result is not defined')

    return this._if_
  }

  setSwitchResult(result: string) {
    this._switch_ = result
  }

  getSwitchResult() {
    if (isUndefined(this._switch_))
      throw new Error('if result is not defined')

    return this._switch_
  }
}
