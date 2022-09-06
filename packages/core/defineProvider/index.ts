import { Interceptor } from '../defineInterceptor'
import { flatten } from '../_utils/shared'

export interface ProviderMetadata {
  dependencies: any
}

export class Provider<T> {
  public instance?: T
  public getter: (args?: any) => T
  public interceptors?: Interceptor[]
  public metadata: ProviderMetadata = { dependencies: [] }

  constructor(getter: (args?: any) => T) {
    this.getter = getter
  }

  dependencies(...dependencies: Array<unknown>) {
    this.metadata.dependencies = flatten(dependencies)
    return this
  }

  useInterceptors(...interceptors: Array<unknown>) {
    this.interceptors = flatten(interceptors)
    return this
  }
}

export const defineProvider = <T>(getter: (args?: any) => T): Provider<T> => {
  return new Provider(getter)
}
