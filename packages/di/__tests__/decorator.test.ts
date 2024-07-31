import { describe, expect, it } from 'vitest'

import { Inject, Injectable, Scope, container } from '../src'

describe('di decorator', () => {
  describe('injectable', () => {
    @Injectable()
    class B {
      value = 1
    }

    @Injectable()
    class A {
      constructor(public b?: B) { }

      @Inject()
      declare bAutowired: B
    }

    it('should create a singleton instance of class A', () => {
      expect(container.get(A)).toBeInstanceOf(A)
      expect(container.get(A)).toBe(container.get(A))
    })

    it('should create a transient instance of class A', () => {
      @Injectable({ scope: Scope.Transient })
      class TransientA {
        constructor() { }
      }

      expect(container.get(TransientA)).toBeInstanceOf(TransientA)
      expect(container.get(TransientA)).not.toBe(container.get(TransientA))
    })

    it('should create an instance of class A based on an alias', () => {
      @Injectable('A')
      class TransientA {
        constructor() { }
      }

      expect(container.get('A')).toBeInstanceOf(TransientA)
      expect(container.get('A')).toBe(container.get('A'))
    })
  })

  describe('inject', () => {
    @Injectable()
    class B {
      value = 1
    }

    @Injectable()
    class A {
      @Inject()
      declare b: B
    }

    it('should inject dependency B into class A via property with @Inject ', () => {
      const instanceA = container.get(A)
      expect(instanceA.b).toBeInstanceOf(B)
      expect(instanceA.b.value).toBe(1)
    })

    it('should inject dependency B into class A via constructor with @Inject ', () => {
      @Injectable()
      class A {
        constructor(
          @Inject(B)
          public b: B,
        ) { }
      }

      const instanceA = container.get(A)
      expect(instanceA.b).toBeInstanceOf(B)
      expect(instanceA.b.value).toBe(1)
    })

    it('should inject dependency B into class A via constructor', () => {
      @Injectable()
      class A2 {
        constructor(
          public b: B,
        ) { }
      }

      const instanceA = container.get(A2)
      expect(instanceA.b).toBeInstanceOf(B)
      expect(instanceA.b.value).toBe(1)
    })
  })
})
