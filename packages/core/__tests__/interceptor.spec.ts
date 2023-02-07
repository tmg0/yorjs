import { defineInterceptor, useProvider } from '../index'
import { providerB } from './core.spec'

describe('define interactor', () => {
  it('should log before and after event action', async () => {
    const logs: string[] = []

    const interactor = defineInterceptor(() => {
      logs.push('Before')
      return () => { logs.push('After') }
    })

    providerB.useInterceptors(interactor)
    const { doB } = useProvider(providerB)

    await doB()

    expect(logs.includes('After')).toBe(true)
  })
})
