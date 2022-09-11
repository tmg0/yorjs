import { Controller } from '../defineController'
import { Provider } from '../defineProvider'

export interface ModuleOptions<T extends object> {
  controller: Controller<T>
  providers?: Provider<unknown>[]
}

export class Module<T extends object> {
  public controller: Controller<T>
  public providers: Provider<unknown>[]

  constructor(options: ModuleOptions<any>) {
    this.controller = options.controller
    this.providers = options.providers || []
  }
}

export const defineModule = <T extends object>(options: ModuleOptions<T>): Module<T> => {
  return new Module<T>(options)
}
