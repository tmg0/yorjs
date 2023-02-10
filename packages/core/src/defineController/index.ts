import { flatten } from '@yorjs/shared'
import type { Provider } from '../defineProvider'
import { Interface } from '../defineInterface'

type InterfacePartials<T> = { [P in keyof T]: T[P] extends Interface ? T[P]['getter'] : any }

export interface ControllerMetadata<T> {
  dependencies: Provider<unknown>[]
  interface: Interface<T, Controller<T>>
  injectors: Interface[]
}

export class Controller<T> {
  public getter: (args?: any) => T
  public metadata: ControllerMetadata<T> = { dependencies: [], interface: new Interface<T, Controller<T>>(), injectors: [] }

  constructor (getter: (args?: any) => T = () => ({} as T)) {
    this.getter = getter
  }

  implements<I extends Interface> (i: I): Controller<I['getter']> {
    this.metadata.interface = i
    this.metadata.interface.implements.push(this)
    return this
  }

  dependencies (...dependencies: Array<unknown>) {
    this.metadata.dependencies = flatten(dependencies) as Provider<unknown>[]
    return this
  }

  inject<I extends Interface[]> (...i: I) {
    this.metadata.injectors = flatten(i)
    return this
  }
}

export class ControllerFactory<T, D extends Interface[]> {
  public instance = new Controller<T>()

  implements<I extends Interface<T>> (i: I): ControllerFactory<I['getter'], D> {
    this.instance.implements(i)
    return this
  }

  inject<I extends Interface[]> (...i: I) {
    if (i && i.length > 0) { this.instance.inject(...i) }

    return this as unknown as ControllerFactory<T, I>
  }

  setup (getter: (...args: InterfacePartials<D>) => T) {
    this.instance.getter = getter as (...args: any[]) => T
    return this.instance
  }
}

export const defineController = () => {
  return new ControllerFactory()
}
