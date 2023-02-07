import { controller, providerA } from './core.spec'

describe('define provider', () => {
  it('should have provider dependencies in metadata', () => {
    expect(!!controller.dependencies).toBe(true)
  })

  it('should have provider name as enum', () => {
    expect(providerA.name).toBe('pa')
  })
})
