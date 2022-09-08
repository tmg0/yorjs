import { defineGuard } from '@yorjs/core'

export const AccessGuard = defineGuard(() => {
  return !!localStorage.getItem('access_token')
}).error((context) => {
  console.log(context)
})
