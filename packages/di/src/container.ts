import { assert } from '@vine-kit/core'

import type { Provider } from './provider'
import { Scope, isClassProvider, isFactoryProvider, isNormalToken, isProvider, isValueProvider } from './provider'
import type { AbstractType, InjectionToken, Type } from './types'

export class Container {
  private _registry: Map<InjectionToken, Provider> = new Map()
  private _snapshots: Array<typeof this._registry> = []

  has<T>(token: InjectionToken<T>): boolean {
    return this._registry.has(token)
  }

  bind<T>(provider: Provider<T>) {
    assert(isProvider(provider), 'invalid provider')
    assert(!this.has(provider.token), `${this.getTokenName(provider.token)} is already bound`)

    provider.scope = provider.scope ?? Scope.Singleton
    if (!isValueProvider(provider)) {
      provider.args = provider.args || []
    }

    this._registry.set(provider.token, provider)
    return provider
  }

  bindClass<T>(token: AbstractType<T> | Type<T>, scope?: Scope): Provider<T>
  bindClass<T>(token: InjectionToken<T>, type: Type<T>, scope?: Scope): Provider<T>
  bindClass(token: any, arg1?: any, arg2?: any) {
    if (isNormalToken(token))
      return this.bind({ token, useClass: arg1, scope: arg2, args: [] })
    return this.bind({ token, useClass: token, scope: arg1, args: [] })
  }

  bindFactory<T>(token: InjectionToken<T>, factory: () => T, scope?: Scope) {
    return this.bind({ token, useFactory: factory, scope, args: [] })
  }

  bindValue<T>(token: InjectionToken<T>, value: T, scope?: Scope) {
    return this.bind({ token, useValue: value, scope })
  }

  rebind<T>(provider: Provider<T>) {
    return this.remove(provider).bind(provider)
  }

  get<T>(token: InjectionToken<T>): T {
    assert(this.has(token), `${this.getTokenName(token)} is already bound`)

    const provider = this._registry.get(token)!

    if (provider.scope !== Scope.Singleton || typeof provider.instance === 'undefined') {
      provider.instance = isFactoryProvider(provider)
        ? provider.useFactory()
        // eslint-disable-next-line new-cap
        : isClassProvider(provider) ? new provider.useClass(...(provider.args.map(t => this.get(t)))) : provider.useValue
    }

    return provider.instance
  }

  remove<T>(tokenOrProvider: InjectionToken<T> | Provider<T>) {
    const token = isProvider(tokenOrProvider) ? tokenOrProvider.token : tokenOrProvider
    this._registry.delete(token)
    return this
  }

  /**
   * 创建当前注册表的快照并保存到快照数组中
   * 此功能用于记录注册表的当前状态，便于后续回溯或比较
   * @returns {this} 返回当前容器实例，支持链式调用
   */
  snapshot() {
    this._snapshots.push(new Map(this._registry))
    return this
  }

  /**
   * 从_snapshots数组中弹出（或移除并返回）最后一个Map对象，并将其赋值给_registry属性
   * 如果_snapshots数组为空，则保持_registry属性不变
   * 此功能用于撤销之前的修改，恢复到_snapshots数组中存储的最后一个注册表状态
   * @returns {this} 返回当前容器实例，支持链式调用
   */
  restore() {
    this._registry = this._snapshots.pop() || this._registry
    return this
  }

  /**
   * 清空注册表并返回当前实例
   *
   * @returns {this} 返回当前实例，允许链式操作
   */
  clear() {
    this._registry.clear()
    return this
  }

  private getTokenName(token: InjectionToken) {
    return isNormalToken(token) ? token.toString() : token.name
  }
}

export const container = new Container()
