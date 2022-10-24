import { defineModule } from '@yorjs/core'
import { requestProvider } from '../../common/request.provider'
import { userRepository } from './user.repository'
import { userService } from './user.service'
import { userController } from './user.controller'

export const userModule = defineModule({
  controller: userController,
  providers: [userService, userRepository, requestProvider]
})
