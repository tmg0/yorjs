import { Provider } from '../defineProvider'

export const useProvider = <T>(options: Provider<T>): T => {
  const { provider, metadata } = options

  if (!metadata.dependencies.length) return provider()

  const dependencies: any = []

  metadata.dependencies.forEach((provider: any) => {
    dependencies.push(useProvider(provider))
  })

  return provider(...dependencies)
}
