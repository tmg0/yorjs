import { Provider } from '../defineProvider'

export type Interceptor = (context: Provider<any>) => () => void

export const defineInterceptor = (getter: Interceptor): Interceptor => {
  return getter
}
