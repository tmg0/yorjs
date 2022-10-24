import { flatten } from '@yorjs/shared'
import type { Provider } from '../defineProvider'
import { Interface } from '../defineInterface'

type InterfacePartials<T> = { [P in keyof T]: T[P] extends Interface ? T[P]['getter'] : any }
type ControllerImplements<T extends Controller<any>> = T['metadata']['interface']['getter']

export interface ControllerMetadata<T> {
  dependencies: Provider<unknown>[]
  interface: Interface<T, Controller<T>>
  inject: Interface[]
}

export class Controller<T> {
  public getter: (args?: any) => T
  public metadata: ControllerMetadata<T> = { dependencies: [], interface: new Interface<T, Controller<T>>(), inject: [] }

  constructor(getter: (args?: any) => T = () => ({} as T)) {
    this.getter = getter
  }

  implements<I extends Interface>(i: I): Controller<I['getter']> {
    this.metadata.interface = i
    this.metadata.interface.implements.push(this)
    return this
  }

  dependencies(...dependencies: Array<unknown>) {
    this.metadata.dependencies = flatten(dependencies) as Provider<unknown>[]
    return this
  }

  inject<I extends Interface[]>(...i: I) {
    this.metadata.inject = flatten(i)
    return this
  }
}

export const defineController = () => {
  class Factory<T, D extends Interface[]> {
    public instance = new Controller<T>()
    public deps = [] as unknown as D

    implements<I extends Interface<T>>(i: I): Factory<I['getter'], D> {
      this.instance.implements(i)
      return this
    }

    inject<I extends Interface[]>(...i: I) {
      if (i && i.length > 0) {
        // const deps: Provider<any>[] = []

        // for (const item of i) {
        //   if (item.implements.length > 1 && !this.instance.dependencies.length)
        //     throw new Error('should have only one implements without declare dependencies')

        //   const [impl] = item.implements
        //   deps.push(impl)
        // }

        // if (deps && deps.length)
        //   this.instance.dependencies(...deps)
        this.instance.inject(...i)
      }

      return this as unknown as Factory<T, I>
    }

    build(getter: (...args: InterfacePartials<D>) => ControllerImplements<typeof this.instance>) {
      this.instance.getter = getter as (...args: any[]) => T
      return this.instance
    }
  }

  return new Factory()
}

