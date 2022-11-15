import { flatten } from '@yorjs/shared'
import type { Interceptor } from '../defineInterceptor'
import type { Guard } from '../defineGuard'
import { Interface } from '../defineInterface'
import { useProvider } from '../useProvider'

type DependencyPartials<T> = { [P in keyof T]: Provider<T[P]> }
type InterfacePartials<T> = { [P in keyof T]: T[P] extends Interface ? T[P]['getter'] : any }
type ProviderImplements<T extends Provider<any>> = T['metadata']['interface']['getter']

export interface ProviderOptions {
  singleton?: boolean
}

export interface ProviderMetadata<T> {
  dependencies: any
  interface: Interface<T>
  injectors: Interface[]
}

export class Provider<T> {
  public token = Symbol('TOKEN')
  public instance?: T
  public getter: (...args: any[]) => T
  public interceptors?: Interceptor[]
  public guards?: Guard[]
  public metadata: ProviderMetadata<T> = { dependencies: [], interface: new Interface<T>(), injectors: [] }
  public singleton = true

  constructor(getter: (...args: any[]) => T = () => ({} as T), options: ProviderOptions = { singleton: true }) {
    this.getter = getter
    this.singleton = !!options?.singleton
  }

  dependencies(...dependencies: DependencyPartials<Parameters<Provider<T>['getter']>>) {
    this.metadata.dependencies = flatten(dependencies)
    return this
  }

  implements<I extends Interface>(i: I): Provider<I['getter']> {
    this.metadata.interface = i
    this.metadata.interface.implements.push(this)
    return this
  }

  inject<I extends Interface[]>(...i: I) {
    this.metadata.injectors = flatten(i)
    return this
  }

  use() {
    return useProvider(this)
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

export const defineProvider = () => {
  class Factory<T, D extends Interface[]> {
    public instance = new Provider<T>()
    public deps = [] as unknown as D

    implements<I extends Interface<T>>(i: I): Factory<I['getter'], D> {
      this.instance.implements(i)
      return this
    }

    inject<I extends Interface[]>(...i: I) {
      if (i && i.length > 0)
        this.instance.inject(...i)

      return this as unknown as Factory<T, I>
    }

    setup(getter: (...args: InterfacePartials<D>) => ProviderImplements<typeof this.instance>, options: ProviderOptions = { singleton: true }) {
      this.instance.getter = getter as (...args: any[]) => T
      this.instance.singleton = !!options.singleton
      return this.instance
    }
  }

  return new Factory()
}
