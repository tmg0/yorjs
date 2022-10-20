import { defineProvider } from '@yorjs/core'
import { IUserRepository } from './interfaces/user-repository.interface'
import { IUserService } from './interfaces/user-service.interface'

export const userService = defineProvider(IUserRepository)<typeof IUserService['getter']>(userRepository => ({
  signIn(data) {
    return userRepository.signIn(data)
  },

  fetchUser() {
    return userRepository.fetchUser()
  }
})).implements(IUserService)

