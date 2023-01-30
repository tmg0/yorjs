import type { ModuleOptions } from '../defineModule'
import { defineModule } from '../defineModule'
import { useModule } from '../useModule'

export const useDefineModule = <T>(options: ModuleOptions<T>): T => {
  return useModule(defineModule(options))
}
