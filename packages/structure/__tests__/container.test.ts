import { Deque, LinkedList, Vector } from '@vine-kit/structure'
import { describe, expect, it } from 'vitest'

const containerList = [Deque, LinkedList, Vector]

describe('container', () => {
  containerList.forEach((Container) => {
    describe(Container.name, () => {
      it('should be able to create a container', () => {
        const container = new Container()
        expect(container).toBeInstanceOf(Container)
      })

      it('should be able to push items into the container', () => {
        const container = new Container([1, 2])
        expect(container.size()).toEqual(2)
        expect(container.toArray()).toEqual([1, 2])
      })

      it('should initialize as empty', () => {
        const deque = new Container<number>()
        expect(deque.size()).toBe(0)
        expect(deque.toArray()).toEqual([])
        expect(deque.front()).toBeUndefined()
        expect(deque.back()).toBeUndefined()
      })

      it('should pushBack correctly', () => {
        const deque = new Container<number>()
        expect(deque.pushBack(1)).toBe(1)
        expect(deque.pushBack(2)).toBe(2)
        expect(deque.toArray()).toEqual([1, 2])
      })

      it('should pushFront correctly', () => {
        const deque = new Container<number>()
        expect(deque.pushFront(1)).toBe(1)
        expect(deque.pushFront(2)).toBe(2)
        expect(deque.toArray()).toEqual([2, 1])
      })

      it('should popBack correctly', () => {
        const deque = new Container<number>([1, 2, 3])
        expect(deque.popBack()).toBe(3)
        expect(deque.popBack()).toBe(2)
        expect(deque.toArray()).toEqual([1])
      })

      it('should popFront correctly', () => {
        const deque = new Container<number>([1, 2, 3])
        expect(deque.popFront()).toBe(1)
        expect(deque.popFront()).toBe(2)
        expect(deque.toArray()).toEqual([3])
      })

      it('should return the correct front and back element', () => {
        const deque = new Container<number>([1])
        expect(deque.front()).toBe(1)
        expect(deque.back()).toBe(1)
      })

      it('should return the correct front and back elements', () => {
        const deque = new Container<number>([1, 2, 3])
        expect(deque.front()).toBe(1)
        expect(deque.back()).toBe(3)
      })

      it('should clear the deque correctly', () => {
        const deque = new Container<number>([1, 2, 3])
        deque.clear()
        expect(deque.toArray()).toEqual([])
      })

      it('should expand on pushBack', () => {
        const count = 1024
        const deque = new Container<number>([], 10)
        const list = []
        for (let i = 0; i < count; ++i) {
          expect(deque.pushBack(i)).toBe(list.push(i))
          expect(deque.size()).toBe(list.length)
        }
        expect(deque.size()).toBe(count)

        for (let i = 0; i < count; ++i) {
          expect(deque.popBack()).toBe(list.pop())
        }
        expect(deque.size()).toBe(0)
      })

      it('should expand on pushFront', () => {
        const count = 1024
        const deque = new Container<number>([], 10)
        const list = []
        for (let i = 0; i < count; ++i) {
          expect(deque.pushFront(i)).toBe(list.unshift(i))
          expect(deque.size()).toBe(list.length)
        }
        expect(deque.size()).toBe(count)

        for (let i = 0; i < count; ++i) {
          expect(deque.popFront()).toBe(list.shift())
        }
        expect(deque.size()).toBe(0)
      })

      it('should handle random insertions and deletions correctly', () => {
        const container = new Container<number>()
        const reference = [] as number[]
        const operationsCount = 1000

        function getRandomInt(min: number, max: number): number {
          min = Math.ceil(min)
          max = Math.floor(max)
          return Math.floor(Math.random() * (max - min + 1)) + min
        }

        for (let i = 0; i < operationsCount; i++) {
          const operation = getRandomInt(1, 6)
          let value: number

          switch (operation) {
            case 1: // pushBack
            case 2: // pushBack
              value = getRandomInt(1, 1000)
              container.pushBack(value)
              reference.push(value)
              break
            case 3: // pushFront
            case 4: // pushFront
              value = getRandomInt(1, 1000)
              container.pushFront(value)
              reference.unshift(value)
              break
            case 5:
              expect(container.popFront()).toBe(reference.shift())
              break
            case 6:
              expect(container.popBack()).toBe(reference.pop())
              break
          }

          // 验证容器的状态与参考数组一致
          expect(container.toArray()).toEqual(reference)
        }
      })
    })
  })
})
