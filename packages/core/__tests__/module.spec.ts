import { useModule } from '../index'
import { moduleA, providerA } from './core.spec'

describe('use module', () => {
  it('should have controller method in module', () => {
    const { do: doM } = useModule(moduleA)
    expect(doM('a')).toBe('A')
  })

  it('should inject impls when use provider', () => {
    const { doA } = moduleA.useExport(providerA)
    expect(doA()).toBe('A')
  })
})
