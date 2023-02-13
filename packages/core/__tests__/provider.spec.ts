import { defineProvider } from '../src/defineProvider'
import { controllerA, providerA } from './core.spec'

describe('define provider', () => {
  it('should have provider dependencies in metadata', () => {
    expect(!!controllerA.dependencies).toBe(true)
  })

  it('should have provider name as enum', () => {
    expect(providerA.name).toBe('pa')
  })

  it('should have default interface in provider', () => {
    const noImplsP = defineProvider().setup(() => ({ do (str: string) { return 'done: ' + str } }))
    expect(noImplsP.metadata.interface.implements.length).toBe(1)
  })
})
