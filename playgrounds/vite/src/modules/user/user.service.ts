import { defineProvider } from '@yorjs/core'
import { IUserRepository, IUserService } from './user.interface'

export const userService = defineProvider().implements(IUserService).inject(IUserRepository).build(repo => ({
  async signIn(username, password) {
    const { data } = await repo.signIn({ username, password })
    return data
  }
}))
