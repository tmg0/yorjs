import { reactive, ref, watch } from 'vue'
import { defineController } from '@yor/core'
import { UserService } from './interfaces/user-service.interface'
import { UserServiceImpl } from './user.service'

const UserController = defineController((userService: UserService) => {
  const token = ref('')
  const usernameSignInForm = reactive({ username: '', password: '' })
  const user = reactive({ username: '' })

  watch(token, (val: string) => {
    console.log(val)
  })

  const signIn = async () => {
    const { token: t } = await userService.signIn(usernameSignInForm)
    token.value = t
  }

  const fetchUser = async () => {
    if (!token.value) return
    const { username } = await userService.fetchUser()
    user.username = username
  }

  return {
    user,
    token,
    usernameSignInForm,
    signIn,
    fetchUser
  }
}).dependencies(UserServiceImpl)

export { UserController }
