import { reactive } from 'vue'
import { defineController, defineInterface, defineModule, defineProvider, useModule, useProvider } from '../index'

describe('use module', () => {
  const IP1 = defineInterface<{ do1: () => string }>()
  const IP2 = defineInterface<{ do2: () => string }>()

  const p1 = defineProvider().implements(IP1).setup(() => ({
    do1() { return 'STR' }
  }), { singleton: true })

  const p2 = defineProvider().implements(IP2).inject(IP1).setup(p1 => ({
    do2: p1.do1
  })) 

  it('should have controller method in module', () => {
    const IC = defineInterface<{ do: (v: string) => string }>()

    const c = defineController().implements(IC).inject(IP1, IP2).setup((p1, p2) => {
      return {
        do(v) {
          if (typeof v === 'string')
            return p1.do1()
          return p2.do2()
        }
      }
    })

    const m = defineModule({ controller: c, providers: [p1, p2] })

    const { do: mDo } = useModule(m)

    expect(mDo('')).toBe('STR')
  })

  it('should inject impls when use provider', () => {
    const { do2 } = useProvider(p2)
    expect(do2()).toBe('STR')
  })
})
