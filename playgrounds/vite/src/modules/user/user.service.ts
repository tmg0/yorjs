import { defineProvider } from '../../../../../packages/core'
import { SignInDto } from './dto/sign-in.dto'
import { UserRequest } from './interfaces/user-request.interface'
import { UserService } from './interfaces/user-service.interface'
import { UserRequestImpl } from './user.request'

const UserServiceImpl = defineProvider<UserService>((userRequest: UserRequest) => ({
  signIn(data: SignInDto) {
    return userRequest.signIn(data)
  }
})).dependencies(UserRequestImpl)

export { UserServiceImpl }
