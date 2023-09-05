export function toArray<T>(value: T | T[] = []): T[] {
  return Array.isArray(value) ? value : [value]
}

export function uniq<T>(value: T[]): T[] {
  return Array.from(new Set(value))
}

export function every<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (value: T) => boolean): boolean {
  return Array.isArray(iterable) ? iterable.every(fn) : Array.from(iterable).every(fn)
}

export function some<T>(iterable: Iterable<T> | ArrayLike<T>, fn: (value: T) => boolean): boolean {
  return Array.isArray(iterable) ? iterable.some(fn) : Array.from(iterable).some(fn)
}
