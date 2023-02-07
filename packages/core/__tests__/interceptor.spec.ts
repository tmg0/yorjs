import { useProvider } from '../index'
import { providerB } from './core.spec'

describe('define interactor', () => {
  it('should log in console before and after event', async () => {
    const { doB } = useProvider(providerB)
    expect(await doB()).toBe('B')
  })
})
