import { describe, expect, it } from 'vitest'
import * as g from '@vine-kit/model'

describe('validator', () => {
  it('invalid_literal', () => {
    const validator = g.literal(1)

    expect(validator.validate(1)).toBe(true)
    expect(validator.validate(2)).toBe(false)
  })

  it('invalid_string email', () => {
    const validator = g.email()

    expect(validator.validate('test@test.com')).toBe(true)

    expect(validator.validate(1)).toBe(false)
    expect(validator.validate('email')).toBe(false)
    expect(validator.validate('email@')).toBe(false)
  })

  it('invalid_string url', () => {
    const validator = g.url()

    expect(validator.validate('https://www.google.com')).toBe(true)

    expect(validator.validate('test@test.com')).toBe(false)
    expect(validator.validate(1)).toBe(false)
    expect(validator.validate('email')).toBe(false)
  })

  it('invalid_string startsWith', () => {
    const validator = g.startsWith('test')

    expect(validator.validate('test')).toBe(true)
    expect(validator.validate('test1')).toBe(true)
    expect(validator.validate('test2')).toBe(true)

    expect(validator.validate('')).toBe(false)
  })

  it('invalid_string endsWith', () => {
    const validator = g.endsWith('test')

    expect(validator.validate('test')).toBe(true)
    expect(validator.validate('2323test')).toBe(true)
    expect(validator.validate('32test')).toBe(true)

    expect(validator.validate('')).toBe(false)
  })

  it('invalid_string regex', () => {
    const validator = g.regex(/^[0-9]+$/)

    expect(validator.validate('123')).toBe(true)
    expect(validator.validate(123)).toBe(true)

    expect(validator.validate('123a')).toBe(false)
    expect(validator.validate('')).toBe(false)
  })

  it('too_small', () => {
    const validator = g.min(1)

    expect(validator.validate([1, 2, 3])).toBe(true)
    expect(validator.validate([1])).toBe(true)
    expect(validator.validate('1')).toBe(true)

    expect(validator.validate([])).toBe(false)
    expect(validator.validate('')).toBe(false)
    expect(validator.validate(0)).toBe(false)
  })

  it('too_big', () => {
    const validator = g.max(1)

    expect(validator.validate([1])).toBe(true)
    expect(validator.validate(1)).toBe(true)
    expect(validator.validate('a')).toBe(true)

    expect(validator.validate([1, 23.3])).toBe(false)
    expect(validator.validate('ads')).toBe(false)
    expect(validator.validate(3)).toBe(false)
  })
})
