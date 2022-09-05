import { flatten } from '@yor/shared'

export interface ControllerMetadata {
  dependencies: any
}

export class Controller<T> {
  public controller: (args?: any) => T
  public metadata: ControllerMetadata = { dependencies: [] }

  constructor(controller: (args?: any) => T) {
    this.controller = controller
  }

  dependencies(...dependencies: Array<unknown>) {
    this.metadata.dependencies = flatten(dependencies)
    return this
  }
}

export const defineController = <T>(cb: (args?: any) => T): Controller<T> => {
  return new Controller(cb)
}
