import { assert } from '@vine-kit/core'

import type { Provider } from './provider'
import { Scope, isAliasProvider, isClassProvider, isFactoryProvider, isNormalToken, isProvider } from './provider'
import type { AbstractType, InjectionToken, Type } from './types'
import { DIError } from './error'

export class Container {
  private _registry: Map<InjectionToken, Provider> = new Map()
  private _snapshots: Array<typeof this._registry> = []

  has<T>(token: InjectionToken<T>): boolean {
    return this._registry.has(token)
  }

  bind<T>(provider: Provider<T>) {
    assert(isProvider(provider), () => DIError.invalidProviderError(provider))
    assert(!this.has(provider.token), () => DIError.hasProviderError(provider.token))

    if (isAliasProvider(provider)) {
      assert(!!this.resolveToken(provider.useAlias), () => DIError.noProviderError(provider.useAlias))
    }
    else
      if (isClassProvider(provider) || isFactoryProvider(provider)) {
        provider.scope = provider.scope ?? Scope.Singleton
        provider.args = provider.args ?? []
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

  bindAlias<T>(token: InjectionToken<T>, alias: InjectionToken<T>) {
    return this.bind({ token, useAlias: alias })
  }

  rebind<T>(provider: Provider<T>) {
    return this.remove(provider).bind(provider)
  }

  get<T>(token: InjectionToken<T>): T {
    assert(this.has(token), () => DIError.noProviderError(token))

    const provider = this._registry.get(token)!

    if (isClassProvider(provider)) {
      if (provider.scope !== Scope.Singleton || typeof provider.instance === 'undefined') {
        // eslint-disable-next-line new-cap
        provider.instance = new provider.useClass(...(provider.args.map(t => this.get(t))))
      }
      return provider.instance
    }
    else if (isFactoryProvider(provider)) {
      if (provider.scope !== Scope.Singleton || typeof provider.instance === 'undefined') {
        provider.instance = provider.useFactory()
      }
      return provider.instance
    }
    else if (isAliasProvider(provider)) {
      return this.get(provider.useAlias)
    }

    return provider.useValue
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

  private resolveToken(token: InjectionToken<any>) {
    let provider = this._registry.get(token)
    const paths: InjectionToken[] = [token]

    while (provider && isAliasProvider(provider)) {
      if (paths.includes(provider.useAlias)) {
        throw DIError.aliasCircularError(paths, token)
      }

      paths.push(provider.useAlias)
      provider = this._registry.get(provider.useAlias)
    }

    return provider
  }

  private getTokenName(token: InjectionToken) {
    return isNormalToken(token) ? token.toString() : token.name
  }
}

export const container = new Container()
