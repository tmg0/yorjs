import { Provider } from '../defineProvider'

export type InterceptorGetter = (context: Provider<any>) => () => void

export class Interceptor {
  public getter: InterceptorGetter

  constructor(getter: InterceptorGetter) {
    this.getter = getter
  }
}

export const defineInterceptor = (getter: InterceptorGetter): Interceptor => {
  return new Interceptor(getter)
}
