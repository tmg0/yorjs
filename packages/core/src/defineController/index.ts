import { flatten } from '@yorjs/shared'
import type { Provider } from '../defineProvider'
import type { Interface } from '../defineInterface'

type InterfacePartials<T> = { [P in keyof T]: T[P] extends Interface ? T[P]['getter'] : any }

export interface ControllerMetadata {
  dependencies: Provider<unknown>[]
  interface?: Interface
}

export class Controller<T extends object> {
  public getter: (args?: any) => T
  public metadata: ControllerMetadata = { dependencies: [] }

  constructor(getter: (args?: any) => T) {
    this.getter = getter
  }

  dependencies(...dependencies: Array<unknown>) {
    this.metadata.dependencies = flatten(dependencies) as Provider<unknown>[]
    return this
  }
}

export const defineController = <I extends Interface[]>(...i: I) => {
  return <T extends object>(getter: (...args: InterfacePartials<I>) => T): Controller<T> => {
    const instance = new Controller(getter as ((...args: any[]) => T))
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
