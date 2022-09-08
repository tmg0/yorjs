import { defineProvider } from '@yorjs/core'
import { LoggingInterceptor } from '../../common/logging.interceptor'
import { AccessGuard } from '../../common/access.guard'
import { UserRepository } from './interfaces/user-repository.interface'
import { UserService } from './interfaces/user-service.interface'
import { UserRepositoryImpl } from './user.repository'

const UserServiceImpl = defineProvider<UserService>((userRepository: UserRepository) => ({
  signIn(data) {
    return userRepository.signIn(data)
  },

  fetchUser() {
    return userRepository.fetchUser()
  }
}))
  .dependencies(UserRepositoryImpl)
  .useInterceptors(LoggingInterceptor)
  .useGuards(AccessGuard)

export { UserServiceImpl }
