import { defineProvider } from '@yorjs/core'
import { UserRepository } from './interfaces/user-repository.interface'
import { SignInDto } from './dto/sign-in.dto'

export const UserRepositoryImpl = defineProvider<UserRepository>(() => ({
  signIn(data: SignInDto) {
    return Promise.resolve({ token: 'TOKEN', ...data })
  },

  fetchUser() {
    return Promise.resolve({ username: 'USERNAME' })
  }
}))
