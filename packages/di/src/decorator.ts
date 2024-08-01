import 'reflect-metadata'
import type { Constructor } from '@vine-kit/core'
import { ReflectUtil, isObject, isUndefined, notUndefined } from '@vine-kit/core'

import { container } from './container'
import type { InjectionToken } from './types'
import type { Scope } from './provider'
import { OPTIONAL_PARAMS_METADATA, OPTIONAL_PROPERTY_METADATA, PARAMS_DI_METADATA } from './constants'

export function Injectable(token?: InjectionToken, scope?: Scope): ClassDecorator
export function Injectable(options?: { token?: InjectionToken, scope?: Scope }): ClassDecorator
export function Injectable(options: any, scope?: Scope): ClassDecorator {
  // 参数归一化
  if (!isObject(options)) {
    options = { token: options, scope }
  }

  return (target: any) => {
    const { token = target, scope } = options
    const paramtypes = Reflect.getMetadata(ReflectUtil.DESIGN_PARAMTYPES, target)
    const params = ReflectUtil.getMetadata(PARAMS_DI_METADATA, target)
    const args = paramtypes ?? []
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
      const params = ReflectUtil.getMetadata(PARAMS_DI_METADATA, target, propertyKey) ?? []

      params[parameterIndex] = token

      ReflectUtil.defineMetadata(PARAMS_DI_METADATA, params, target, propertyKey)
    }
    else if (notUndefined(propertyKey)) {
      // class property
      const key = token || Reflect.getMetadata(ReflectUtil.DESIGN_TYPE, target, propertyKey)

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
      const params = ReflectUtil.getMetadata(OPTIONAL_PARAMS_METADATA, target, propertyKey) ?? []
      params[parameterIndex] = true
      ReflectUtil.defineMetadata(OPTIONAL_PARAMS_METADATA, params, target, propertyKey)
    }
    else if (notUndefined(propertyKey)) {
      ReflectUtil.defineMetadata(OPTIONAL_PROPERTY_METADATA, true, target)
    }
    else {
      throw new Error('@Optional() is invalid')
    }
  }
}

export function Type(type: any) {
  return Reflect.metadata(ReflectUtil.DESIGN_TYPE, type)
}

export function ParamTypes(type: any) {
  return Reflect.metadata(ReflectUtil.DESIGN_PARAMTYPES, type)
}

export function ReturnType(type: any) {
  return Reflect.metadata(ReflectUtil.DESIGN_RETURNTYPE, type)
}

interface DecoratorFactoryOptions {
  type: 'class' | 'property' | 'method'
  normalize: (...args: any[]) => any
}
interface DecoratorTypeDict {
  class: ClassDecorator
  property: PropertyDecorator
  method: MethodDecorator
}

/**
 * Creates a decorator factory.
 */
export class DecoratorFactory {
  /**
   * Creates a new decorator factory.
   *
   * @param options - The options for creating the decorator factory.
   * @param options.type - Specifies the type of decorator to create ('class', 'property', or 'method').
   * @param options.normalize - A function that normalizes the arguments passed to the decorator.
   * @returns A decorator factory function and additional metadata properties.
   */
  static create<T extends DecoratorFactoryOptions>(options: T):
    ((...args: Parameters<T['normalize']>) => DecoratorTypeDict[T['type']]) & {
      readonly key: unique symbol
      readonly targets: Constructor[]
      readonly values: ReturnType<T['normalize']>[]
    } {
    const key = Symbol('')
    const decorator = (...args: any[]) => {
      return (target: any, propertyKey?: string | symbol) => {
        const value = options.normalize?.(...args)

        ReflectUtil.defineMetadata(key, value, target, propertyKey)
      }
    }
    Object.defineProperty(decorator, 'key', {
      get() {
        return key
      },
      enumerable: false,
      configurable: false,
    })
    Object.defineProperty(decorator, 'targets', {
      get() {
        return ReflectUtil.getMetadataTargets(key)
      },
      enumerable: false,
      configurable: false,
    })
    Object.defineProperty(decorator, 'values', {
      get() {
        return ReflectUtil.listMetadata(key)
      },
      enumerable: false,
      configurable: false,
    })
    return decorator as any
  }
}
