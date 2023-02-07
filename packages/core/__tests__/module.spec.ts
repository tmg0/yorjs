import { useModule } from '../index'
import { module, providerA } from './core.spec'

describe('use module', () => {
  it('should have controller method in module', () => {
    const { do: doM } = useModule(module)
    expect(doM('a')).toBe('A')
  })

  it('should inject impls when use provider', () => {
    const { doA } = module.useExport(providerA)
    expect(doA()).toBe('A')
  })
})
