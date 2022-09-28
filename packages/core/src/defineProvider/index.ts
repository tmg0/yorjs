import { flatten } from '@yorjs/shared'
import type { Interceptor } from '../defineInterceptor'
import type { Guard } from '../defineGuard'

type DependencyPartials<T> = { [P in keyof T]: Provider<T[P]> }

export interface ProviderMetadata {
  dependencies: any
}

export class Provider<T> {
  public token = Symbol('TOKEN')
  public getter: (...args: any[]) => T
  public interceptors?: Interceptor[]
  public guards?: Guard[]
  public metadata: ProviderMetadata = { dependencies: [] }

  constructor(getter: (...args: any[]) => T) {
    this.getter = getter
  }

  dependencies(...dependencies: DependencyPartials<Parameters<Provider<T>['getter']>>) {
    this.metadata.dependencies = flatten(dependencies)
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

export const defineProvider = <T>(getter: (...args: any[]) => T): Provider<T> => {
  return new Provider(getter)
}
