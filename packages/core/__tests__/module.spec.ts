import { useExports, useModule } from '../index'
import { moduleA, moduleB } from './core.spec'

describe('use module', () => {
  it('should have controller method in module', () => {
    const { do: doM } = useModule(moduleA)
    expect(doM('a')).toBe('A')
  })

  it('should inject impls when use provider', () => {
    const { pa: { doA } } = useExports(moduleA)
    expect(doA()).toBe('A')
  })

  it('should use default provider without implements as interface', () => {
    const { do: doB } = useModule(moduleB)
    expect(doB('c')).toBe('C')
  })
})
