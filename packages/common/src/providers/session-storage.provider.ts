import { defineProvider } from '@yorjs/core'

export const sessionStorageProvider = defineProvider(() => sessionStorage)
