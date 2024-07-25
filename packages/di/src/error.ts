import { isObject } from 'vine-kit'
import type { InjectionToken } from './types'

export class DIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DIError'
  }

  static noProviderError(...token: InjectionToken[]): DIError {
    return new DIError(`No provider for ${token.map(stringifyToken).join(', ')}`)
  }

  static hasProviderError(...token: InjectionToken[]): DIError {
    return new DIError(`Provider for ${token.map(stringifyToken).join(', ')} already exists`)
  }

  static invalidProviderError(provider: any): DIError {
    return new DIError(`Invalid provider: ${stringifyToken(provider)}`)
  }

  static circularError(target: object, token: InjectionToken) {
    return new DIError(`Circular dependency detected for ${stringifyToken(token)} in ${stringifyToken(target)}`)
  }

  static aliasCircularError(paths: InjectionToken[], token: InjectionToken) {
    return new DIError(`Circular alias detected for ${stringifyToken(token)} in ${paths.join(' -> ')}`)
  }
}

function stringifyToken(target: object | InjectionToken): string {
  if (isObject(target)) {
    return target.constructor.name
  }
  else if (typeof target === 'function') {
    return target.name
  }
  return target.toString()
}
