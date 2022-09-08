import { Provider } from '../defineProvider'
import { isFunction, isPromise } from '../_utils/shared'

export const useProvider = <T>(options: Provider<T>): T => {
  const interceptors = options.interceptors || []

  if (options.instance) return options.instance

  const { getter, metadata } = options

  if (!metadata.dependencies.length) options.instance = getter()

  const dependencies: any = []

  metadata.dependencies.forEach((provider: any) => {
    dependencies.push(useProvider(provider))
  })

  options.instance = getter(...dependencies)

  if (interceptors.length) {
    for (const key in options.instance) {
      if (!isFunction(options.instance[key])) continue

      const event: any = options.instance[key]
      options.instance[key] = function (...args: any) {
        const afterInterceptors: any[] = []

        interceptors.forEach((before) => {
          afterInterceptors.push(before(options))
        })

        const res = event(args)

        if (!isPromise(res)) {
          afterInterceptors.forEach((after) => {
            after()
          })

          return res
        }

        return new Promise((resolve, reject) => {
          res
            .then((promiseRes: any) => {
              afterInterceptors.forEach((after) => {
                after()
              })
              resolve(promiseRes)
            })
            .catch(reject)
        })
      } as any
    }
  }

  return options.instance
}
