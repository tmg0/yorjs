import { defineModule } from '@yor/core'
import { UserController } from './user.controller'

const UserModule = defineModule({ controller: UserController })

export { UserModule }
