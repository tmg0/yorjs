import { Controller } from '../defineController'
import { Provider } from '../defineProvider'

export interface ModuleOptions<T extends object> {
  controller: Controller<T>
  providers?: Provider<unknown>[]
}

export interface Module<T extends object> {
  controller: Controller<T>
  providers: Provider<unknown>[]
}

export const defineModule = <T extends object>(options: ModuleOptions<T>): Module<T> => {
  return { controller: options.controller, providers: [] }
}
