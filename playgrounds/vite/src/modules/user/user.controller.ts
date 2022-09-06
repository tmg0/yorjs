import { reactive, ref } from 'vue'
import { defineController } from '@yor/core'
import { UserService } from './interfaces/user-service.interface'
import { UserServiceImpl } from './user.service'

const UserController = defineController((userService: UserService) => {
  const token = ref('')
  const usernameSignInForm = reactive({ username: '', password: '' })

  const signIn = async () => {
    const { token: t } = await userService.signIn(usernameSignInForm)
    token.value = t
  }

  return {
    token,
    usernameSignInForm,
    signIn
  }
}).dependencies(UserServiceImpl)

export { UserController }
