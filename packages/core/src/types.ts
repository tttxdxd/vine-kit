/**
 * Promise, or maybe not
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * Null or whatever
 */
export type Nullable<T> = T | null | undefined

/**
 * Array, or not yet
 */
export type Arrayable<T> = T | Array<T>

export type Identity<T> = T
export type Prettify<T> = { [K in keyof T]: T[K] } & object

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }

export type NonEmptyArray<T> = [T, ...T[]]
