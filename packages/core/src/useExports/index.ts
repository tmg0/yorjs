import { isString } from '@yorjs/shared'
import type { Provider } from '../defineProvider'
import { useProvider } from '../useProvider'
import type { Module } from '../defineModule'

export const useExports = <T>(module: Module<any>, provider: string | Provider<T>): T => {
  if (isString(provider)) {
    const p = module.exports.filter(({ name }) => name === provider)

    if (!p.length) { throw new Error(`do not have provider named ${provider}`) }
    if (p.length > 1) { throw new Error(`have more than one provider named ${provider}`) }

    const [r] = p

    return useProvider(r) as T
  }

  if (module.exports.some(({ token }) => token === provider.token)) {
    return useProvider(provider) as T
  } else {
    throw new Error('should export current provider in this module')
  }
}
