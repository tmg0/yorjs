import { defineGuard, useProvider } from '@yorjs/core'
import { WebStorageProviderImpl } from './web-storage.provider'

export const AccessGuard = defineGuard(() => {
  const ls = useProvider(WebStorageProviderImpl)
  return !!ls.get('token')
}).error((context) => {
  console.log(context)
})
