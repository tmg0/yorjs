import { Provider } from '../defineProvider'

export interface ModuleOptions {
  controllers?: Provider<unknown>[]
  providers?: Provider<unknown>[]
}

export interface Module {
  controllers?: Provider<unknown>[]
  providers: Provider<unknown>[]
}

export const defineModule = (options: ModuleOptions): Module => {
  return {
    controllers: options.controllers || [],
    providers: options.providers || []
  }
}
