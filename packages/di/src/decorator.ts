import 'reflect-metadata'
import { isObject, isUndefined, notUndefined } from '@vine-kit/core'
import { container } from './container'
import type { InjectionToken } from './types'
import type { Scope } from './provider'
import { DecoratorManager } from './manager'
import { OPTIONAL_PARAMS_METADATA, OPTIONAL_PROPERTY_METADATA, PARAMS_DI_METADATA, PARAMTYPES_METADATA, TYPE_METADATA } from './constants'

export function Injectable(token?: InjectionToken, scope?: Scope): ClassDecorator
export function Injectable(options?: { token?: InjectionToken, scope?: Scope }): ClassDecorator
export function Injectable(options: any, scope?: Scope): ClassDecorator {
  // 参数归一化
  if (!isObject(options)) {
    options = { token: options, scope }
  }

  return (target: any) => {
    const { token = target, scope } = options
    const paramtypes = Reflect.getMetadata(PARAMTYPES_METADATA, target)
    const params = DecoratorManager.getMetadata(PARAMS_DI_METADATA, target)
    const args = paramtypes
    // merge
    if (Array.isArray(params)) {
      for (let i = 0; i < params.length; i++) {
        if (notUndefined(params[i]))
          args[i] = params[i]
      }
    }

    container.bind({
      token,
      useClass: target,
      scope,
      args,
    })
  }
}

export function Inject(token?: InjectionToken): PropertyDecorator & ParameterDecorator {
  return (target: object, propertyKey: string | symbol | undefined, parameterIndex?: number) => {
    if (notUndefined(parameterIndex)) {
      // constructor params
      const params: any[] = DecoratorManager.getMetadata(PARAMS_DI_METADATA, target) ?? []

      params[parameterIndex] = token

      DecoratorManager.saveMetadata(PARAMS_DI_METADATA, params, target)
    }
    else if (notUndefined(propertyKey)) {
      // class property
      const key = token || Reflect.getMetadata(TYPE_METADATA, target, propertyKey)

      if (isUndefined(key)) {
        throw new Error('token is required')
      }

      Object.defineProperty(target, propertyKey, {
        get() {
          const value = container.get(key)
          Object.defineProperty(this, propertyKey, { value, enumerable: true })
          return value
        },
        enumerable: true,
        configurable: true,
      })
    }
    else {
      throw new Error(`@Inject(${token?.toString()}) is invalid`)
    }
  }
}

export function Optional(): PropertyDecorator & ParameterDecorator {
  return (target: object, propertyKey: string | symbol | undefined, parameterIndex?: number) => {
    if (notUndefined(parameterIndex)) {
      const params: any[] = DecoratorManager.getMetadata(OPTIONAL_PARAMS_METADATA, target) ?? []
      params[parameterIndex] = true
      DecoratorManager.saveMetadata(OPTIONAL_PARAMS_METADATA, params, target)
    }
    else if (notUndefined(propertyKey)) {
      DecoratorManager.attachMetadata(OPTIONAL_PROPERTY_METADATA, true, target)
    }
    else {
      throw new Error('@Optional() is invalid')
    }
  }
}

export function createParamDecorator(key: string, value: any): ClassDecorator {
  return (target: any) => {
    DecoratorManager.saveModule(key, target)
    DecoratorManager.attachMetadata(key, value, target)
  }
}
