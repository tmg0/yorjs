import type { Provider } from '../defineProvider'

export class Interface<T = any, I = Provider<any>> {
  public token = Symbol('INTERFACE')
  public getter!: T
  public implements: I[] = []
}

export const defineInterface = <T = any>(): Interface<T> => {
  return new Interface<T>()
}
