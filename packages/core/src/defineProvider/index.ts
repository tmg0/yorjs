import { flatten } from '@yorjs/shared'
import type { Interceptor } from '../defineInterceptor'
import type { Guard } from '../defineGuard'
import type { Interface } from '../defineInterface'

type DependencyPartials<T> = { [P in keyof T]: Provider<T[P]> }

export interface ProviderOptions {
  singleton?: boolean
}

export interface ProviderMetadata {
  dependencies: any
  implements?: Interface
}

export class Provider<T> {
  public token = Symbol('TOKEN')
  public instance?: T
  public getter: (...args: any[]) => T
  public interceptors?: Interceptor[]
  public guards?: Guard[]
  public metadata: ProviderMetadata = { dependencies: [] }
  public singleton = false

  constructor(getter: (...args: any[]) => T, options: ProviderOptions) {
    this.getter = getter
    this.singleton = !!options?.singleton
  }

  dependencies(...dependencies: DependencyPartials<Parameters<Provider<T>['getter']>>) {
    this.metadata.dependencies = flatten(dependencies)
    return this
  }

  implements(i: Interface) {
    this.metadata.implements = i
    return this
  }

  useInterceptors(...interceptors: Interceptor[]) {
    this.interceptors = flatten(interceptors)
    return this
  }

  useGuards(...guards: Guard[]) {
    this.guards = flatten(guards)
    return this
  }
}

export const defineProvider = <T>(getter: (...args: any[]) => T, options: ProviderOptions = { singleton: false }): Provider<T> => {
  return new Provider(getter, options)
}
