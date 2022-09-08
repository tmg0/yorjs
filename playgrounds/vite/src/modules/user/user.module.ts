import { defineModule } from '@yorjs/core'
import { UserController } from './user.controller'

const UserModule = defineModule({ controller: UserController })

export { UserModule }
