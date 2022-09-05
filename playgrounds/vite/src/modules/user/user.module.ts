import { defineModule } from '../../../../../packages/core'
import { UserController } from './user.controller'

const UserModule = defineModule({ controller: UserController })

export { UserModule }
