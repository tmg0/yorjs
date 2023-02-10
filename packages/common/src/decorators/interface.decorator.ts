import { defineInterface } from '@yorjs/core'

export const Interface = () => (_: any) => {
  return defineInterface() as any
}
