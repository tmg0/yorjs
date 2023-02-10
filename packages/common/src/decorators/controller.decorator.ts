import { defineController } from '@yorjs/core'

export const Controller = () => <T extends { new(...args: any[]): {} }>(_: T) => {
  return defineController() as any
}
