
import { useProvider } from '../useProvider'
import type { Module } from '../defineModule'

export const useExports = <T extends Module<any>>(module: T) => {
  const result: Record<string, any> = {}

  module.exports.forEach((provider) => {
    if (provider.name) { result[provider.name] = useProvider(provider) as any }
  })

  return result
}
