import { beforeEach, describe, expect, it } from 'vitest'

import { Container, Scope } from '../src'

describe('di Container', () => {
  let container: Container
  const tokenSymbol = Symbol.for('tokenSymbol')

  beforeEach(() => {
    container = new Container()
  })

  it('can bind a factory', () => {
    let count = 1
    container.bindFactory<string>(tokenSymbol, () => `hello world ${count++}`, Scope.Transient)

    expect(container.get<string>(tokenSymbol)).toBe('hello world 1')
    expect(container.get<string>(tokenSymbol)).toBe('hello world 2')
    expect(container.get<string>(tokenSymbol)).toBe('hello world 3')
  })

  it('can bind a factory in singleton scope', () => {
    let count = 1
    container.bindFactory<string>(tokenSymbol, () => `hello world ${count++}`, Scope.Singleton)

    expect(container.get<string>(tokenSymbol)).toBe('hello world 1')
    expect(container.get<string>(tokenSymbol)).toBe('hello world 1')
    expect(container.get<string>(tokenSymbol)).toBe('hello world 1')
  })

  it('can bind a class', () => {
    interface Helloable { hello: () => string }
    container.bindClass<Helloable>(tokenSymbol, class {
      count = 1
      hello() {
        return `hello world ${this.count++}`
      }
    }, Scope.Transient)

    expect(container.get<Helloable>(tokenSymbol).hello()).toBe('hello world 1')
    expect(container.get<Helloable>(tokenSymbol).hello()).toBe('hello world 1')
    expect(container.get<Helloable>(tokenSymbol).hello()).toBe('hello world 1')
  })

  it('can bind a class in singleton scope', () => {
    interface Helloable { hello: () => string }
    container.bindClass<Helloable>(tokenSymbol, class {
      count = 1
      hello() {
        return `hello world ${this.count++}`
      }
    }, Scope.Singleton)

    expect(container.get<Helloable>(tokenSymbol).hello()).toBe('hello world 1')
    expect(container.get<Helloable>(tokenSymbol).hello()).toBe('hello world 2')
    expect(container.get<Helloable>(tokenSymbol).hello()).toBe('hello world 3')
  })

  it('can bind a value', () => {
    container.bindValue(tokenSymbol, 0)

    expect(container.get(tokenSymbol)).toBe(0)
  })

  it('can rebind a value', () => {
    container.bindValue(tokenSymbol, 0)
    container.rebind({ token: tokenSymbol, useValue: 1 })

    expect(container.get(tokenSymbol)).toBe(1)
  })

  it('snapshot and restore', () => {
    container.bindValue(tokenSymbol, 0)
    container.snapshot()
    expect(container.get(tokenSymbol)).toBe(0)

    container.rebind({ token: tokenSymbol, useValue: 1 })
    expect(container.get(tokenSymbol)).toBe(1)

    container.restore()
    expect(container.get(tokenSymbol)).toBe(0)
  })

  it('can get a non-existing token', () => {
    expect(() => container.get(tokenSymbol)).toThrowError()
  })
})
