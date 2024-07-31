import type { Constructor } from '@vine-kit/core'

export type InjectionToken<T = any> = Constructor<T> | string | symbol
