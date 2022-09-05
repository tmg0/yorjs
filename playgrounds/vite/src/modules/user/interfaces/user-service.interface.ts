import { SignInDto } from '../dto/sign-in.dto'
import { AccessTokenDto } from '../dto/access-token.dto'

export interface UserService {
  signIn(data: SignInDto): Promise<AccessTokenDto>
}
