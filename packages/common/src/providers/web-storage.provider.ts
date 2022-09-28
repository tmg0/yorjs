import { defineProvider } from '@yorjs/core'
import type { WebStorage } from '../interfaces/web-storage.interface'
import { localStorageProvider } from './local-storage.provider'

export const webStorageProvider = defineProvider<WebStorage>((storage: Storage) => ({
  get(key, def = '') {
    const item = storage.getItem(key)

    if (item !== null) {
      try {
        const data = JSON.parse(item)

        if (!data.expire)
          return data.value

        if (data.expire >= new Date().getTime())
          return data.value

        storage.removeItem(key)
      }
      catch (err) {
        return def
      }
    }

    return def
  },

  set(key, value, expire) {
    const stringifyValue = JSON.stringify({
      value,
      expire: expire ? new Date().getTime() + expire : null
    })
    storage.setItem(key, stringifyValue)
  },

  remove(key) {
    storage.removeItem(key)
  },

  clear() {
    if (storage.length === 0)
      return

    const removedKeys: string[] = []

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (!key)
        continue
      removedKeys.push(key)
    }

    for (const key in removedKeys)
      storage.removeItem(removedKeys[key])
  }
})
).dependencies(localStorageProvider)
