import { useProvider } from '../useProvider'
import type { Controller } from '../defineController'
import type { Provider } from '../defineProvider'

const injectImpls = (ctx: Provider<any> | Controller<any>, _providers: Provider<unknown>[] = []) => {
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

export interface ModuleOptions<T> {
  controller: Controller<T>
  providers?: Provider<unknown>[]
  exports?: Provider<unknown>[]
}

export class Module<T> {
  public controller: Controller<T>
  public providers: Provider<unknown>[]
  public exports: Provider<unknown>[]

  constructor(options: ModuleOptions<any>) {
    this.controller = options.controller
    this.providers = options.providers || []
    this.exports = options.exports || this.providers || []

    this.controller.dependencies(...injectImpls(this.controller), this.providers)

    this.providers.forEach((provider) => {
      provider.dependencies(...injectImpls(provider))
    })
  }

  useExport<T>(provider: Provider<T>): T {
    if (this.exports.some(({ token }) => token === provider.token))
      return useProvider(provider)
    else
      throw new Error('should export current provider in this module')
  }
}

export const defineModule = <T>(options: ModuleOptions<T>): Module<T> => {
  return new Module<T>(options)
}
