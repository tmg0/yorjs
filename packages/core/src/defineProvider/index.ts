import { flatten } from '@yorjs/shared'
import type { Interceptor } from '../defineInterceptor'
import type { Guard } from '../defineGuard'
import { Interface } from '../defineInterface'

type DependencyPartials<T> = { [P in keyof T]: Provider<T[P]> }
type InterfacePartials<T> = { [P in keyof T]: T[P] extends Interface ? T[P]['getter'] : any }
type ProviderImplements<T extends Provider<any>> = T['metadata']['interface']['getter']

export interface ProviderOptions {
  singleton?: boolean
}

export interface ProviderMetadata<T> {
  dependencies: any
  interface: Interface<T>
}

export class Provider<T> {
  public token = Symbol('TOKEN')
  public instance?: T
  public getter: (...args: any[]) => T
  public interceptors?: Interceptor[]
  public guards?: Guard[]
  public metadata: ProviderMetadata<T> = { dependencies: [], interface: new Interface<T>() }
  public singleton = false

  constructor(getter: (...args: any[]) => T = () => ({} as T), options: ProviderOptions = { singleton: false }) {
    this.getter = getter
    this.singleton = !!options?.singleton
  }

  dependencies(...dependencies: DependencyPartials<Parameters<Provider<T>['getter']>>) {
    this.metadata.dependencies = flatten(dependencies)
    return this
  }

  implements<I extends Interface>(i: I) {
    this.metadata.interface = i
    this.metadata.interface.implements.push(this)
    return this as Provider<I['getter']>
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
  class A<T, D extends Interface[]> {
    public instance = new Provider<T>()
    public deps = [] as unknown as D

    implements<I extends Interface<T>>(i: I): A<I['getter'], D> {
      this.instance.implements(i)
      return this
    }

    inject<I extends Interface[]>(...i: I) {
      if (i && i.length > 0) {
        const deps: Provider<any>[] = []

        for (const item of i) {
          if (item.implements.length > 1 && !this.instance.dependencies.length)
            throw new Error('should have only one implements without declare dependencies')

          const [impl] = item.implements
          deps.push(impl)
        }
        this.instance.dependencies(...deps)
      }

      return this as unknown as A<T, I>
    }

    build(getter: (...args: InterfacePartials<D>) => ProviderImplements<typeof this.instance>, options: ProviderOptions = { singleton: false }) {
      this.instance.getter = getter as (...args: any[]) => T
      this.instance.singleton = !!options.singleton
      return this.instance
    }
  }

  return new A()
}
