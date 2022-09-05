import { defineProvider } from '../../../../packages/core'
import { UserRequest } from './interfaces/user-request.interface'
import { SignInDto } from './dto/sign-in.dto'

export const UserRequestImpl = defineProvider<UserRequest>(() => ({
  signIn(data: SignInDto) {
    return Promise.resolve({ token: 'TOKEN', ...data })
  }
}))
