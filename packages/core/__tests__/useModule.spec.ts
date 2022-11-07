import { defineController, defineInterface, defineModule, defineProvider, useModule } from '../index'

describe('use module', () => {
  const IP1 = defineInterface<{ do1: () => string }>()
  const IP2 = defineInterface<{ do2: () => string }>()

  const p1 = defineProvider().implements(IP1).setup(() => ({
    do1() { return 'STR' }
  }), { singleton: true })

  const p2 = defineProvider().implements(IP2).inject(IP1).setup(p1 => ({
    do2: p1.do1
  }))

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

  const m2 = defineModule({ controller: c, providers: [p1, p2], exports: [p1, p2] })
  const m = defineModule({ controller: c, imports: [m2] })

  it('should have controller method in module', () => {
    const { do: mDo } = useModule(m)
    expect(mDo('')).toBe('STR')
  })

  it('should inject impls when use provider', () => {
    const { do2 } = m.useExport(p2)
    expect(do2()).toBe('STR')
  })
})
