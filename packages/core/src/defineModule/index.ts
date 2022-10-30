import type { Controller } from '../defineController'
import type { Provider } from '../defineProvider'

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
  }
}

export const defineModule = <T>(options: ModuleOptions<T>): Module<T> => {
  return new Module<T>(options)
}
