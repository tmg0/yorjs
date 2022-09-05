import { flatten } from '@yor/shared'

export interface ProviderMetadata {
  dependencies: any
}

export class Provider<T> {
  public provider: (args?: any) => T
  public metadata: ProviderMetadata = { dependencies: [] }

  constructor(provider: (args?: any) => T) {
    this.provider = provider
  }

  dependencies(...dependencies: Array<unknown>) {
    this.metadata.dependencies = flatten(dependencies)
    return this
  }
}

export const defineProvider = <T>(cb: (args?: any) => T): Provider<T> => {
  return new Provider(cb)
}
