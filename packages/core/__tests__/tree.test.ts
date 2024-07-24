import { describe, expect, it } from 'vitest'
import { TreeUtil } from '@vine-kit/core'

describe('tree', () => {
  it('base tree', () => {
    const list = [{ id: 1, label: 'Apple', parentId: 0 }, { id: 2, label: 'Balana', parentId: 0 }]
    const result = TreeUtil.build(list, 0)
    expect(result.length).toBe(2)
    expect(result).toMatchObject([
      { id: 1, label: 'Apple', parentId: 0, children: [] },
      { id: 2, label: 'Balana', parentId: 0, children: [] }
    ])
  })

  it('multiples ', () => {
    const list = [
      { id: 1, label: 'Apple', parentId: 0 },
      { id: 2, label: 'Balana', parentId: 0 },
      { id: 3, label: 'Apple 1', parentId: 1 },
      { id: 4, label: 'Apple 2', parentId: 1 },
    ]
    const result = TreeUtil.build(list, 0)
    expect(result.length).toBe(2)
    expect(result).toMatchObject([
      {
        id: 1, label: 'Apple', parentId: 0, children: [
          { id: 3, label: 'Apple 1', parentId: 1, children: [] },
          { id: 4, label: 'Apple 2', parentId: 1, children: [] }
        ]
      },
      { id: 2, label: 'Balana', parentId: 0, children: [] }
    ])
  })

  // it('special ', () => {
  //   const list = [
  //     { app: 'Test', server: 'TestServer', obj: 'TestObj' },
  //     { app: 'Test', server: 'Test2Server', obj: 'TestObj' },
  //     { app: 'Demo', server: 'DemoServer', obj: 'DemoObj' },
  //   ]
  //   const result = TreeUtil.build2(list, { parentIdKey: ['app', 'server'] })
  //   expect(result.length).toBe(2)
  //   expect(result).toMatchObject([
  //     {
  //       label: 'Test', parentId: '', children: [
  //         { label: 'TestServer', parentId: 'Test', children: [] },
  //         { label: 'Test2Server', parentId: 'Test', children: [] },
  //       ]
  //     },
  //     { label: 'Demo', parentId: '', children: [] }
  //   ])
  // })
})
