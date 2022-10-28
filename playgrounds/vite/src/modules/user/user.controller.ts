import { defineController } from '@yorjs/core'
import { reactive } from 'vue'
import { IUserController, IUserService } from './user.interface'

export const userController = defineController().implements(IUserController).inject(IUserService).setup((service) => {
  const signInForm = reactive({ username: '', password: '' })

  const signIn = () => {
    service.signIn(signInForm.username, signInForm.password)
  }

  return {
    signInForm,
    signIn
  }
})
