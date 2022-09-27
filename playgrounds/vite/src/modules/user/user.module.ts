import { defineModule } from '@yorjs/core'
import { RequestProviderImpl } from '../../common/request.provider'
import { UserController } from './user.controller'
import { UserRepositoryImpl } from './user.repository'
import { UserServiceImpl } from './user.service'

const UserModule = defineModule({
  controller: UserController.dependencies(UserServiceImpl),
  providers: [UserServiceImpl.dependencies(UserRepositoryImpl), UserRepositoryImpl.dependencies(RequestProviderImpl)]
})

export { UserModule }
