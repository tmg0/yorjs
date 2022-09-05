import { Controller } from '../defineController'
import { Provider } from '../defineProvider'

export interface ModuleOptions {
  controller?: Controller<object>
  providers?: Provider<unknown>[]
}

export interface Module {
  controller?: Controller<object>
  providers: Provider<unknown>[]
}

export const defineModule = (options: ModuleOptions): Module => {
  return {
    controller: options.controller,
    providers: options.providers || []
  }
}
