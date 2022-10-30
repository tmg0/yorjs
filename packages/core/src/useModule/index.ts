import type { Module } from '../defineModule'
import { useProvider } from '../useProvider'
import type { Provider } from '../defineProvider'
import { Controller } from '../defineController'

type ReactiveController<T> = ReturnType<Module<T>['controller']['getter']>

const injectImpls = (ctx: Controller<any>) => {
  const deps: Provider<any>[] = []
  const { injectors: i } = ctx.metadata

  for (const item of i) {
    if (item.implements.length > 1 && !ctx.dependencies.length)
      throw new Error('should declare dependencies if you have more than one implements')

    const [impl] = item.implements
    deps.push(impl)
  }
  return deps
}

export const useModule = <T >(module: Module<T>): ReactiveController<T> => {
  const { getter, metadata } = module.controller

  module.controller.dependencies(...injectImpls(module.controller))

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
