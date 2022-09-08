import { Provider } from '../defineProvider'

export type GuardGetter = (context?: Provider<any>) => boolean | Promise<boolean>

export class Guard {
  public getter: GuardGetter

  constructor(getter: GuardGetter) {
    this.getter = getter
  }
}

export const defineGuard = (getter: GuardGetter) => {
  return new Guard(getter)
}
