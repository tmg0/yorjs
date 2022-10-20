import { flatten } from '@yorjs/shared'
import type { Interceptor } from '../defineInterceptor'
import type { Guard } from '../defineGuard'
import type { Interface } from '../defineInterface'

type DependencyPartials<T> = { [P in keyof T]: Provider<T[P]> }
type InterfacePartials<T> = { [P in keyof T]: T[P] extends Interface ? T[P]['getter'] : any }

export interface ProviderOptions {
  singleton?: boolean
}

export interface ProviderMetadata {
  dependencies: any
  interface?: Interface
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
    this.metadata.interface = i
    this.metadata.interface.implements.push(this)
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

export const defineProvider = <I extends Interface[]>(...i: I) => {
  return <T>(getter: (...args: InterfacePartials<I>) => T, options: ProviderOptions = { singleton: false }) => {
    const instance = new Provider(getter as ((...args: any[]) => T), options)
    if (i && i.length > 0) {
      const deps: Provider<any>[] = []

      for (const item of i) {
        if (item.implements.length > 1 && !instance.dependencies.length)
          throw new Error('have more than 1 implements')

        const [impl] = item.implements
        deps.push(impl)
      }
      instance.dependencies(...deps)
    }
    return instance
  }
}
