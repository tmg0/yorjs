import { Provider } from '../defineProvider'

export const useProvider = <T>(options: Provider<T>): T => {
  if (options.instance) return options.instance

  const { getter, metadata } = options

  if (!metadata.dependencies.length) options.instance = getter()

  const dependencies: any = []

  metadata.dependencies.forEach((provider: any) => {
    dependencies.push(useProvider(provider))
  })

  options.instance = getter(...dependencies)
  return options.instance
}
