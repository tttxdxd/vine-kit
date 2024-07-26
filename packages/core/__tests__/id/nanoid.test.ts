import { describe, expect, it } from 'vitest'
import { IdUtil } from '@vine-kit/core'

describe('idUtil.nanoid', () => {
  const { customAlphabet, customRandom, nanoid, random, urlAlphabet } = IdUtil

  it(`generates URL-friendly IDs`, () => {
    for (let i = 0; i < 100; i++) {
      const id = nanoid()
      expect(id.length).toBe(21)
      expect(typeof id).toBe('string')
      for (const char of id) {
        expect(urlAlphabet.includes(char)).toBe(true)
      }
    }
  })

  it(`changes ID length`, () => {
    expect(nanoid(10).length).toBe(10)
  })

  it(`accepts string`, () => {
    expect(nanoid('10' as any).length).toBe(10)
  })

  it(`has no collisions`, () => {
    const used: Record<string, true> = {}
    for (let i = 0; i < 50 * 1000; i++) {
      const id = nanoid()
      expect(used[id]).toBe(undefined)
      used[id] = true
    }
  })

  it(`has flat distribution`, () => {
    const COUNT = 100 * 1000
    const LENGTH = nanoid().length

    const chars: Record<string, number> = {}
    for (let i = 0; i < COUNT; i++) {
      const id = nanoid()
      for (const char of id) {
        if (!chars[char])
          chars[char] = 0
        chars[char] += 1
      }
    }

    expect(Object.keys(chars).length).toBe(urlAlphabet.length)

    let max = 0
    let min = Number.MAX_SAFE_INTEGER
    for (const k in chars) {
      const distribution = (chars[k] * urlAlphabet.length) / (COUNT * LENGTH)
      if (distribution > max)
        max = distribution
      if (distribution < min)
        min = distribution
    }
    expect(max - min <= 0.05).toBe(true)
  })

  it(`node / customAlphabet / has options`, () => {
    const nanoidA = customAlphabet('a', 5)
    expect(nanoidA()).toBe('aaaaa')
  })

  it(`node / customAlphabet / has flat distribution`, () => {
    const COUNT = 50 * 1000
    const LENGTH = 30
    const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
    const nanoid2 = customAlphabet(ALPHABET, LENGTH)

    const chars: Record<string, number> = {}
    for (let i = 0; i < COUNT; i++) {
      const id = nanoid2()
      for (const char of id) {
        if (!chars[char])
          chars[char] = 0
        chars[char] += 1
      }
    }

    expect(Object.keys(chars).length).toBe(ALPHABET.length)

    let max = 0
    let min = Number.MAX_SAFE_INTEGER
    for (const k in chars) {
      const distribution = (chars[k] * ALPHABET.length) / (COUNT * LENGTH)
      if (distribution > max)
        max = distribution
      if (distribution < min)
        min = distribution
    }
    expect(max - min <= 0.05).toBe(true)
  })

  it(`node / customAlphabet / changes size`, () => {
    const nanoidA = customAlphabet('a')
    expect(nanoidA(10)).toBe('aaaaaaaaaa')
  })

  it(`node / customRandom / supports generator`, () => {
    const sequence = [2, 255, 3, 7, 7, 7, 7, 7, 0, 1]
    function fakeRandom(size: any) {
      let bytes: any[] = []
      for (let i = 0; i < size; i += sequence.length) {
        bytes = bytes.concat(sequence.slice(0, size - i))
      }
      return bytes
    }
    const nanoid4 = customRandom('abcde', 4, fakeRandom)
    const nanoid18 = customRandom('abcde', 18, fakeRandom)
    expect(nanoid4()).toBe('adca')
    expect(nanoid18()).toBe('cbadcbadcbadcbadcc')
  })

  it(`node / urlAlphabet / is string`, () => {
    expect(typeof urlAlphabet).toBe('string')
  })

  it(`node / urlAlphabet / has no duplicates`, () => {
    for (let i = 0; i < urlAlphabet.length; i++) {
      expect(urlAlphabet.lastIndexOf(urlAlphabet[i])).toBe(i)
    }
  })

  it(`node / random / generates small random buffers`, () => {
    for (let i = 0; i < urlAlphabet.length; i++) {
      expect(random(10).length).toBe(10)
    }
  })

  it(`node / random / generates random buffers`, () => {
    const numbers: Record<string, number> = {}
    const bytes = random(1000)
    expect(bytes.length).toBe(1000)
    for (const byte of bytes) {
      if (!numbers[byte])
        numbers[byte] = 0
      numbers[byte] += 1
      expect(typeof byte).toBe('number')
      expect(byte <= 255).toBe(true)
      expect(byte >= 0).toBe(true)
    }
  })
})
