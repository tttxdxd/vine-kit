export type Identity<T> = T
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }
