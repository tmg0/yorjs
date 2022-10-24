import type { Controller } from '../defineController'
import type { Provider } from '../defineProvider'

const injectImpls = (ctx: Provider<any> | Controller<any>) => {
  const deps: Provider<any>[] = []
  const { inject: i } = ctx.metadata

  for (const item of i) {
    if (item.implements.length > 1 && !ctx.dependencies.length)
      throw new Error('should have only one implements without declare dependencies')

    const [impl] = item.implements
    deps.push(impl)
  }
  return deps
}

export interface ModuleOptions<T> {
  controller: Controller<T>
  providers?: Provider<unknown>[]
}

export class Module<T> {
  public controller: Controller<T>
  public providers: Provider<unknown>[]

  constructor(options: ModuleOptions<any>) {
    this.controller = options.controller
    this.providers = options.providers || []

    this.controller.dependencies(...injectImpls(this.controller))

    this.providers.forEach((provider) => {
      provider.dependencies(...injectImpls(provider))
    })
  }
}

export const defineModule = <T>(options: ModuleOptions<T>): Module<T> => {
  return new Module<T>(options)
}
