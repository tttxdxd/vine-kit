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
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

export type NonEmptyArray<T> = [T, ...T[]]

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> =
  T extends object ?
    U extends object ?
  (Without<T, U> & U) | (Without<U, T> & T)
      : U : T

export type Concat<T extends readonly unknown[], U extends readonly unknown[]> = [...T, ...U]

export type Identify<T> = T extends object ? {
  [P in keyof T]: T[P]
} : T

export type ExtractRequiredKeys<T> = keyof Pick<T, {
  [K in keyof T]-?: undefined extends T[K] ? never : K extends string ? K : never
}[keyof T]>
