export interface ProviderMetadata {
  dependencies: any
}

export class Provider<T> {
  public provider: (args?: any) => T
  public metadata: ProviderMetadata = { dependencies: [] }

  constructor(provider: (args?: any) => T) {
    this.provider = provider
  }

  dependencies<T>(args: T) {
    this.metadata.dependencies = args
    return this
  }
}

export const defineProvider = <T>(cb: (args?: any) => T): Provider<T> => {
  return new Provider(cb)
}
