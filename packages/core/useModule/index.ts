import { Module } from '../defineModule'
import { useProvider } from '../useProvider'

type ReactiveController<T extends object> = ReturnType<
  Module<T>['controller']['controller']
>

export const useModule = <T extends object>(module: Module<T>): ReactiveController<T> => {
  const { controller, metadata } = module.controller

  if (!metadata.dependencies.length) return controller()

  const dependencies: any = []

  metadata.dependencies.forEach((provider) => {
    dependencies.push(useProvider(provider))
  })

  return controller(...dependencies)
}
