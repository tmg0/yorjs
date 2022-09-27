import { defineProvider } from '@yorjs/core'

export const LocalStorageProviderImpl = defineProvider<Storage>(() => localStorage)
