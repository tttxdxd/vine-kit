export interface AbstractType<T> {
  prototype: T
}

export interface Type<T> {
  new(...args: any[]): T
}

export type InjectionToken<T = any> = Type<T> | string | symbol
