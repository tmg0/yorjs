export class Interface<T = any> {
  public token = Symbol('INTERFACE')
  public getter!: T
}

export const defineInterface = <T = any>(): Interface<T> => {
  return new Interface<T>()
}
