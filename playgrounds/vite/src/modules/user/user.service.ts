import { defineProvider } from '@yor/core'
import { LoggingInterceptor } from '../../common/logging.interceptor'
import { SignInDto } from './dto/sign-in.dto'
import { UserRepository } from './interfaces/user-repository.interface'
import { UserService } from './interfaces/user-service.interface'
import { UserRepositoryImpl } from './user.repository'

const UserServiceImpl = defineProvider<UserService>((userRepository: UserRepository) => ({
  signIn(data: SignInDto) {
    return userRepository.signIn(data)
  },

  fetchUser() {
    return userRepository.fetchUser()
  }
}))
  .dependencies(UserRepositoryImpl)
  .useInterceptors(LoggingInterceptor)

export { UserServiceImpl }
