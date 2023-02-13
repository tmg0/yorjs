import { flatten } from '@yorjs/shared'
import type { Interceptor } from '../defineInterceptor'
import type { Guard } from '../defineGuard'
import { Interface } from '../defineInterface'

type DependencyPartials<T> = { [P in keyof T]: Provider<T[P], string> }
type InterfacePartials<T> = { [P in keyof T]: T[P] extends Interface ? T[P]['getter'] : any }

export interface ProviderOptions {
  singleton?: boolean
}

export interface ProviderMetadata<T> {
  dependencies: any
  interface: Interface<T>
  injectors: Interface[]
}

export class Provider<T, N extends string = any> {
  public name = '' as N
  public token = Symbol('TOKEN')
  public instance?: T
  public getter: (...args: any[]) => T
  public interceptors?: Interceptor[]
  public guards?: Guard[]
  public metadata: ProviderMetadata<T> = { dependencies: [], interface: new Interface<T>(), injectors: [] }
  public singleton = true

  constructor (getter: (...args: any[]) => T = () => ({} as T), options: ProviderOptions = { singleton: true }) {
    this.getter = getter
    this.singleton = !!options?.singleton
    this.metadata.interface.implements.push(this)
  }

  dependencies (...dependencies: DependencyPartials<Parameters<Provider<T, string>['getter']>>) {
    this.metadata.dependencies = flatten(dependencies)
    return this
  }

  implements<I extends Interface> (i: I): Provider<I['getter'], N> {
    this.metadata.interface = i
    this.metadata.interface.implements.push(this as Provider<any>)
    return this
  }

  inject<I extends Interface[]> (...i: I) {
    this.metadata.injectors = flatten(i)
    return this
  }

  useInterceptors (...interceptors: Interceptor[]) {
    this.interceptors = flatten(interceptors)
    return this
  }

  useGuards (...guards: Guard[]) {
    this.guards = flatten(guards)
    return this
  }
}

class ProviderFactory<T, D extends Interface[], N extends string = ''> {
  public name = '' as N
  public instance = new Provider<T, N>()

  constructor (name?: N) {
    this.name = (name || '') as N
  }

  implements<I extends Interface<T>> (i: I): ProviderFactory<I['getter'], D, N> {
    this.instance.implements(i)
    return this
  }

  inject<I extends Interface[]> (...i: I) {
    if (i && i.length > 0) { this.instance.inject(...i) }

    return this as unknown as ProviderFactory<T, I, N>
  }

  setup (getter: (...args: InterfacePartials<D>) => T, options: ProviderOptions = { singleton: true }) {
    this.instance.getter = getter as (...args: any[]) => T
    this.instance.singleton = !!options.singleton
    this.instance.name = this.name
    return this.instance
  }
}

export const defineProvider = <T extends string>(name?: T) => {
  return new ProviderFactory(name)
}
