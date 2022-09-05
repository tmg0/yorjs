import { Provider } from '../defineProvider'

export const useProvider = <T>(options: Provider<T>): T => {
  const { getter, metadata } = options

  if (!metadata.dependencies.length) return getter()

  const dependencies: any = []

  metadata.dependencies.forEach((provider: any) => {
    dependencies.push(useProvider(provider))
  })

  return getter(...dependencies)
}
