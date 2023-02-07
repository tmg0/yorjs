import { isFunction, isPromise } from '@yorjs/shared'
import type { Interceptor } from '../defineInterceptor'
import type { Provider } from '../defineProvider'

export interface InjectHooks<T> {
  created(token: symbol, context: T): void
}

export const injectInterceptors = <T, I>(context: Provider<T>, interceptors: Interceptor[], instance: I): I => {
  if (interceptors.length) {
    for (const key in instance) {
      if (!isFunction(instance[key])) { continue }

      const event: any = instance[key]
      instance[key] = function (...args: any) {
        const afterInterceptors: any[] = []

        interceptors.forEach(({ getter: before }) => {
          afterInterceptors.push(before(context))
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
                after(promiseRes)
              })
              resolve(promiseRes)
            })
            .catch((error: any) => {
              interceptors.forEach(({ errorHandler }) => {
                errorHandler && errorHandler(error)
              })
              reject(error)
            })
        })
      } as any
    }
  }

  return instance
}

export const useProvider = <T>(options: Provider<T>, hooks?: InjectHooks<T>): T => {
  const interceptors = options.interceptors || []
  const guards = options.guards || []

  if (options.singleton && options.instance) {
    if (hooks) { hooks.created(options.token, options.instance) }
    return options.instance
  }

  for (const guard of guards) {
    if (!guard.getter(options)) {
      guard.errorHandler && guard.errorHandler(options)
      break
    }
  }

  const { getter, metadata } = options

  if (!metadata.dependencies.length) {
    const instance = getter()
    options.instance = instance
    injectInterceptors(options, interceptors, instance)
    if (hooks) { hooks.created(options.token, instance) }
    return instance
  }

  const dependencies: any = []

  metadata.dependencies.forEach((provider: any) => {
    dependencies.push(useProvider(provider, hooks))
  })

  const instance = getter(...dependencies)

  injectInterceptors(options, interceptors, instance)

  options.instance = instance

  if (hooks) { hooks.created(options.token, instance) }
  return instance
}
