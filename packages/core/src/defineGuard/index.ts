import { Provider } from '../defineProvider'

export type GuardGetter = (context?: Provider<any>) => boolean

export class Guard {
  public getter: GuardGetter
  public errorHandler?: (context?: Provider<any>) => void

  constructor(getter: GuardGetter) {
    this.getter = getter
  }

  error(handler: (context?: Provider<any>) => void) {
    this.errorHandler = handler
    return this
  }
}

export const defineGuard = (getter: GuardGetter) => {
  return new Guard(getter)
}
