import type { Constructor } from '@vine-kit/shared'

export type InjectionToken<T = any> = Constructor<T> | string | symbol
