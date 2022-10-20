import { defineInterface } from '@yorjs/core'
import type { SignInDto } from '../dto/sign-in.dto'
import type { AccessTokenDto } from '../dto/access-token.dto'
import type { UserDto } from '../dto/user.dto'

export const IUserService = defineInterface< {
  signIn(data: SignInDto): Promise<AccessTokenDto>
  fetchUser(): Promise<UserDto>
}>()
