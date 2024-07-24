type Fn<I, O> = (source: I) => O

export function pipe<T>(initialValue: T): T
export function pipe<T, A>(i: T, fn1: Fn<T, A>): A
export function pipe<T, A, B>(i: T, fn1: Fn<T, A>, fn2: Fn<A, B>): B
export function pipe<T, A, B, C>(i: T, fn1: Fn<T, A>, fn2: Fn<A, B>, fn3: Fn<B, C>): C
export function pipe<T, A, B, C, D>(i: T, fn1: Fn<T, A>, fn2: Fn<A, B>, fn3: Fn<B, C>, fn4: Fn<C, D>): D
export function pipe<T, A, B, C, D, E>(i: T, fn1: Fn<T, A>, fn2: Fn<A, B>, fn3: Fn<B, C>, fn4: Fn<C, D>, fn5: Fn<D, E>): E
export function pipe<T, A, B, C, D, E, F>(
  i: T,
  fn1: Fn<T, A>,
  fn2: Fn<A, B>,
  fn3: Fn<B, C>,
  fn4: Fn<C, D>,
  fn5: Fn<D, E>,
  fn6: Fn<E, F>
): F
export function pipe<T, A, B, C, D, E, F, G>(
  i: T,
  fn1: Fn<T, A>,
  fn2: Fn<A, B>,
  fn3: Fn<B, C>,
  fn4: Fn<C, D>,
  fn5: Fn<D, E>,
  fn6: Fn<E, F>,
  fn7: Fn<F, G>,
): G
export function pipe<T, A, B, C, D, E, F, G, H>(
  i: T,
  fn1: Fn<T, A>,
  fn2: Fn<A, B>,
  fn3: Fn<B, C>,
  fn4: Fn<C, D>,
  fn5: Fn<D, E>,
  fn6: Fn<E, F>,
  fn7: Fn<F, G>,
  fn8: Fn<G, H>,
): H
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  i: T,
  fn1: Fn<T, A>,
  fn2: Fn<A, B>,
  fn3: Fn<B, C>,
  fn4: Fn<C, D>,
  fn5: Fn<D, E>,
  fn6: Fn<E, F>,
  fn7: Fn<F, G>,
  fn8: Fn<G, H>,
  fn9: Fn<H, I>,
): I
export function pipe<T, A, B, C, D, E, F, G, H, I>(
  i: T,
  fn1: Fn<T, A>,
  fn2: Fn<A, B>,
  fn3: Fn<B, C>,
  fn4: Fn<C, D>,
  fn5: Fn<D, E>,
  fn6: Fn<E, F>,
  fn7: Fn<F, G>,
  fn8: Fn<G, H>,
  fn9: Fn<H, I>,
  ...fns: Fn<any, any>[]
): unknown

export function pipe(initialValue: any, ...callbacks: any[]): any {
  return callbacks.reduce((ctx: any, cb: (arg0: any) => any) => cb(ctx), initialValue)
}
