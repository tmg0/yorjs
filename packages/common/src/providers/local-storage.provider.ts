import { defineProvider } from '@yorjs/core'

export const localStorageProvider = defineProvider<Storage>(() => localStorage)
