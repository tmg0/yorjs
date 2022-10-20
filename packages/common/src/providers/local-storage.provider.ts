import { defineInterface, defineProvider } from '@yorjs/core'

export const IStorage = defineInterface<Storage>()

export const localStorageProvider = defineProvider()(() => localStorage).implements(IStorage)
