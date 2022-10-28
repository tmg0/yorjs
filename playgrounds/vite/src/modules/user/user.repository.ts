import { defineProvider } from '@yorjs/core'
import { IRequestProvider } from '../../common/request.provider'
import { IUserRepository } from './user.interface'

export const userRepository = defineProvider().implements(IUserRepository).inject(IRequestProvider).setup(req => ({
  signIn(data) {
    return req({
      url: '/user/sign-in',
      method: 'post',
      data
    })
  }
}))
