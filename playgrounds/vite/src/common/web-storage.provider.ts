import { defineProvider } from '@yorjs/core'
import { LocalStorageProviderImpl } from './local-storage.provider'

export interface WebStorageProvider {
  get: (key: string) => string
  set: (key: string, value: any, expire?: number) => void
  remove: (key: string) => void
}

export const WebStorageProviderImpl = defineProvider<WebStorageProvider>((storage: Storage) => ({
  get(key, def = '') {
    const item = storage.getItem(key)

    if (item !== null) {
      try {
        const data = JSON.parse(item)

        if (!data.expire) return data.value

        if (data.expire >= new Date().getTime()) return data.value

        storage.removeItem(key)
      } catch (err) {
        return def
      }
    }

    return def
  },

  set(key, value, expire) {
    const stringifyValue = JSON.stringify({ value, expire: expire !== null ? new Date().getTime() + expire : null })
    storage.setItem(key, stringifyValue)
  },

  remove(key) {
    storage.removeItem(key)
  }
})).dependencies(LocalStorageProviderImpl)
