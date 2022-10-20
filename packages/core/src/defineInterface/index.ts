import type { Provider } from '../defineProvider'

export class Interface<T = any> {
  public token = Symbol('INTERFACE')
  public getter!: T
  public implements: Provider<any>[] = []
}

export const defineInterface = <T = any>(): Interface<T> => {
  return new Interface<T>()
}
