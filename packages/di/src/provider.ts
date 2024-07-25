import type { InjectionToken, Type } from './types'

export enum Scope {
  Singleton,
  Transient,
}

export interface ClassProvider<T> {
  token: InjectionToken<T>
  useClass: Type<T>
  scope?: Scope
  instance?: T
  args: any[]
}
export interface FactoryProvider<T> {
  token: InjectionToken<T>
  useFactory: (...args: any[]) => T
  scope?: Scope
  instance?: T
  args: any[]
}
export interface ValueProvider<T> {
  token: InjectionToken<T>
  useValue: T
  instance?: T
}
export interface AliasProvider<T> {
  token: InjectionToken<T>
  useAlias: InjectionToken<T>
}

export type Provider<T = any> = ClassProvider<T> | ValueProvider<T> | FactoryProvider<T> | AliasProvider<T>

export function isNormalToken(val: InjectionToken): val is string | symbol {
  return typeof val === 'string' || typeof val === 'symbol'
}

export function isToken(val: any): val is InjectionToken {
  if (typeof val === 'function') {
    return [Object, String, Number, Boolean].includes(val)
  }
  return isNormalToken(val)
}

export function isProvider(val: any): val is Provider {
  return typeof val === 'object' && isToken(val.token)
}
export function isClassProvider<T>(provider: Provider<T>): provider is ClassProvider<T> {
  return 'useClass' in provider
}
export function isFactoryProvider<T>(provider: Provider<T>): provider is FactoryProvider<T> {
  return 'useFactory' in provider
}
export function isValueProvider<T>(provider: Provider<T>): provider is ValueProvider<T> {
  return 'useValue' in provider
}
export function isAliasProvider<T>(provider: Provider<T>): provider is AliasProvider<T> {
  return 'useAlias' in provider
}
