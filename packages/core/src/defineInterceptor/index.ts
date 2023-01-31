import { Provider } from '../defineProvider'

export type InterceptorGetter = (context?: Provider<any>) => (result?: any) => void

export class Interceptor {
  public getter: InterceptorGetter
  public errorHandler?: (context?: Provider<any>) => void

  constructor (getter: InterceptorGetter) {
    this.getter = getter
  }

  error (handler: (context?: Provider<any>) => void) {
    this.errorHandler = handler
    return this
  }
}

export const defineInterceptor = (getter: InterceptorGetter): Interceptor => {
  return new Interceptor(getter)
}
