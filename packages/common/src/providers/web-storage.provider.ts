import { defineProvider } from '@yorjs/core'
import { WebStorageProvider } from '../interfaces/web-storage-provider.interface'
import { localStorageProviderImpl } from './local-storage.provider'

export const webStorageProvider = defineProvider<WebStorageProvider>((storage: Storage) => ({
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
})).dependencies(localStorageProviderImpl)
