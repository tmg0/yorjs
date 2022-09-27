import { defineProvider } from '@yorjs/core'

export const localStorageProviderImpl = defineProvider<Storage>(() => localStorage)
