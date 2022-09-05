import { flatten } from '@yor/shared'
import { Provider } from '../defineProvider'

export interface ControllerMetadata {
  dependencies: Provider<unknown>[]
}

export class Controller<T extends object> {
  public controller: (args?: any) => T
  public metadata: ControllerMetadata = { dependencies: [] }

  constructor(controller: (args?: any) => T) {
    this.controller = controller
  }

  dependencies(...dependencies: Array<unknown>) {
    this.metadata.dependencies = flatten(dependencies) as Provider<unknown>[]
    return this
  }
}

export const defineController = <T extends object>(
  cb: (args?: any) => T
): Controller<T> => {
  return new Controller<T>(cb)
}
