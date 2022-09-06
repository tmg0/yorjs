import { flatten } from '../_utils/shared'
import { Provider } from '../defineProvider'

export interface ControllerMetadata {
  dependencies: Provider<unknown>[]
}

export class Controller<T extends object> {
  public getter: (args?: any) => T
  public metadata: ControllerMetadata = { dependencies: [] }

  constructor(getter: (args?: any) => T) {
    this.getter = getter
  }

  dependencies(...dependencies: Array<unknown>) {
    this.metadata.dependencies = flatten(dependencies) as Provider<unknown>[]
    return this
  }
}

export const defineController = <T extends object>(
  getter: (args?: any) => T
): Controller<T> => {
  return new Controller<T>(getter)
}
