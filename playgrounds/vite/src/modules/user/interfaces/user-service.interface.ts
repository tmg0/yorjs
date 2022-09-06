import { SignInDto } from '../dto/sign-in.dto'
import { AccessTokenDto } from '../dto/access-token.dto'
import { UserDto } from '../dto/user.dto'

export interface UserService {
  signIn(data: SignInDto): Promise<AccessTokenDto>
  fetchUser(): Promise<UserDto>
}
