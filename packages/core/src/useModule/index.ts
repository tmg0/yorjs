import type { Module } from '../defineModule'
import { useProvider } from '../useProvider'
import type { Provider } from '../defineProvider'

type ReactiveController<T extends object> = ReturnType<Module<T>['controller']['getter']>

export const useModule = <T extends object>(module: Module<T>): ReactiveController<T> => {
  const { getter, metadata } = module.controller

  if (!metadata.dependencies.length)
    return getter()

  const dependencies: any[] = []
  const providers: Map<symbol, any> = new Map()

  const onInstanceCreated = (token: symbol, instance: Provider<any>) => {
    providers.set(token, instance)
  }

  if (module.providers && module.providers.length) {
    for (const provider of module.providers) {
      if (providers.get(provider.token))
        continue
      useProvider(provider, { created: onInstanceCreated })
    }
  }

  metadata.dependencies.forEach(({ token }) => {
    dependencies.push(providers.get(token))
  })

  return getter(...dependencies)
}
