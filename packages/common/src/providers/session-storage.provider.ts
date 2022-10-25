import { defineInterface, defineProvider } from '@yorjs/core'

export const IStorage = defineInterface<Storage>()

export const sessionStorageProvider = defineProvider().implements(IStorage).build(() => sessionStorage)
