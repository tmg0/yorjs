import { defineModule } from '@yorjs/core'
import { requestProvider } from '../../common/request.provider'
import { userController } from './user.controller'
import { userService } from './user.service'
import { userRepository } from './user.repository'

export const userModule = defineModule({
  controller: userController,
  providers: [userService, userRepository, requestProvider]
})
