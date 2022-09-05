import { reactive } from 'vue'
import { Module } from '../defineModule'

export const useModule = (module: Module) => {
  if (!module.controller) return undefined

  const { controller, metadata } = module.controller

  if (!metadata.dependencies.length) return reactive(controller())

  metadata.dependencies.forEach(({ provider, metadata }) => {})

  return reactive(controller(...metadata.dependencies))
}
