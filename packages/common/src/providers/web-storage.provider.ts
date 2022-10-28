import { defineInterface, defineProvider } from '@yorjs/core'
import type { WebStorage } from '../interfaces/web-storage.interface'
import { IStorage } from './local-storage.provider'

export const IWebStorage = defineInterface<WebStorage>()

export const webStorageProvider = defineProvider().implements(IWebStorage).inject(IStorage).setup(storage => ({
  get(key: string, def = '') {
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

  remove(key: string) {
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
)
