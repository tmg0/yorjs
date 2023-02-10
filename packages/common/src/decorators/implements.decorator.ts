import { Controller, Interface, Provider } from '@yorjs/core'

export const Implements = <T extends { new(...args: any[]): {} }>(i: T) => (target: any) => {
  return (target as Controller<any> | Provider<any>).implements(i as unknown as Interface) as any
}
