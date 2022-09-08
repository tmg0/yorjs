import { defineInterceptor, defineProvider, useProvider } from '../'
import { Provider } from '../src/defineProvider'

describe('define interactor', () => {
  it('should log in console before and after event', async () => {
    const logging = defineInterceptor((context: Provider<any>) => {
      console.log('Before...')

      return () => {
        console.log('After..')
      }
    })

    const provider = defineProvider(() => ({
      do(): Promise<string> {
        console.log('Doing')

        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('Done')
            resolve('Destory')
          }, 3000)
        })
      }
    })).useInterceptors(logging)

    const events = useProvider(provider)

    const message = await events.do()

    expect(message).toBe('Destory')
  })
})
