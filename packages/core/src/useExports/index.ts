import type { Module } from 'src/defineModule'
import type { Provider } from 'src/defineProvider'
import { useProvider } from 'src/useProvider'

export const isString = (str: any): str is string => typeof str === 'string'

export const useExports = <T>(module: Module<T>, provider: string | Provider<any>) => {
  if (isString(provider)) {
    const p = module.exports.filter(({ name }) => name === provider)

    if (!p.length)
      throw new Error(`do not have provider named ${provider}`)
    if (p.length > 1)
      throw new Error(`have more than one provider named ${provider}`)

    const [r] = p

    return useProvider(r) as T
  }

  if (module.exports.some(({ token }) => token === provider.token))
    return useProvider(provider)
  else
    throw new Error('should export current provider in this module')
}
