import { defineInterface } from '@yorjs/core'
import type { AxiosPromise } from 'axios'
import type { AccessTokenDto } from './dto/access-token.dto'
import type { SignInDto } from './dto/sign-in.dto'

export const IUserRepository = defineInterface<{
  signIn(data: SignInDto): AxiosPromise<AccessTokenDto>
}>()

export const IUserService = defineInterface<{
  signIn(username: string, password: string): Promise<AccessTokenDto>
}>()

export const IUserController = defineInterface<{
  signInForm: {
    username: string
    password: string
  }

  signIn: () => void
}>()
