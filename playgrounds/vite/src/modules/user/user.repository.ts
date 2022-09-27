import { AxiosInstance } from 'axios'
import { defineProvider } from '@yorjs/core'
import { UserRepository } from './interfaces/user-repository.interface'
import { RequestMethod } from '../../common/request-method.enum'
import { WebStorageProvider } from 'src/common/web-storage.provider'

export const USER_SIGN_IN = '/backend/user/sign-in'

export const UserRepositoryImpl = defineProvider<UserRepository>((request: AxiosInstance, ls: WebStorageProvider) => ({
  async signIn(data) {
    const res = await request({ url: USER_SIGN_IN, method: RequestMethod.POST, data, headers: { accessToken: ls.get('token') } })
    return res.data
  },

  fetchUser() {
    return Promise.resolve({ username: 'USERNAME' })
  }
}))
