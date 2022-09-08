import { defineInterceptor, defineProvider, useProvider } from '../'
import { Provider } from '../src/defineProvider'

describe('define interactor', () => {
  it('should log in console before and after event', async () => {
    const arr: string[] = []

    const logging = defineInterceptor((context: Provider<any>) => {
      arr.push('Before...')

      return () => {
        arr.push('After...')
      }
    })

    const provider = defineProvider(() => ({
      do(): Promise<void> {
        arr.push('Doing')

        return new Promise((resolve) => {
          setTimeout(() => {
            arr.push('Done')
            resolve()
          }, 3000)
        })
      }
    })).useInterceptors(logging)

    const events = useProvider(provider)

    await events.do()

    expect(arr.includes('Done')).toBe(true)
  })
})
