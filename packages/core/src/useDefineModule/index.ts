import type { ModuleOptions } from 'src/defineModule'
import { defineModule } from 'src/defineModule'
import { useModule } from 'src/useModule'

export const useDefineModule = <T>(options: ModuleOptions<T>): T => {
  return useModule(defineModule(options))
}
