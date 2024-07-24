import { describe, expect, it } from 'vitest'
import { IF, IFNodeComponent, NodeComponent, Sequence, createFlow, defineContext } from '../src'

const TotalContext = defineContext({ total: 0 })

class Add extends NodeComponent {
  async process() {
    const total = this.getContext(TotalContext)
    total.set('total', total.get('total') + 1)
  }
}

class Subtract extends NodeComponent {
  async process() {
    const total = this.getContext(TotalContext)
    total.set('total', total.get('total') - 1)
  }
}

describe('flow', () => {
  it('basic flow', async () => {
    const flow = createFlow({
      nodes: [Add, Subtract],
      contexts: [TotalContext],
    })
    const response = await flow.run()

    expect(response).toMatchObject({ isSuccess: true })
    expect(response.getContext(TotalContext).get('total')).toEqual(0)
  })

  it('flow with sequence', async () => {
    const flow = createFlow({
      nodes: [Sequence(Add, Add)],
      contexts: [TotalContext],
    })
    const response = await flow.run()

    expect(response).toMatchObject({ isSuccess: true })
    expect(response.getContext(TotalContext).get('total')).toEqual(2)
  })

  it('flow with if', async () => {
    class GraterThanFive extends IFNodeComponent {
      async if() {
        return this.getContext(TotalContext).get('total') > 5
      }
    }

    const flow = createFlow({
      nodes: [IF(GraterThanFive, Add, Subtract)],
      contexts: [TotalContext],
    })
    const response = await flow.run()

    expect(response).toMatchObject({ isSuccess: true })
    expect(response.getContext(TotalContext).get('total')).toEqual(1)
  })
})
