import { defineProvider } from '@yorjs/core'
import { IUserRepository } from './interfaces/user-repository.interface'

export const USER_SIGN_IN = '/backend/user/sign-in'

export const userRepository = defineProvider()<typeof IUserRepository['getter']>(() => ({
  async signIn(_data) {
    return Promise.resolve({ })
  },

  fetchUser() {
    return Promise.resolve({ username: 'USERNAME' })
  }
})).implements(IUserRepository)
