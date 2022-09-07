import { Module } from '../defineModule'
import { useProvider } from '../useProvider'

type ReactiveController<T extends object> = ReturnType<Module<T>['controller']['getter']>

export const useModule = <T extends object>(module: Module<T>): ReactiveController<T> => {
  const { getter, metadata } = module.controller

  if (!metadata.dependencies.length) return getter()

  const dependencies: any = []

  metadata.dependencies.forEach((provider) => {
    dependencies.push(useProvider(provider))
  })

  return getter(...dependencies)
}
