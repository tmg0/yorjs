import { SignInDto } from '../dto/sign-in.dto'
import { AccessTokenDto } from '../dto/access-token.dto'

export interface UserRequest {
  signIn(data: SignInDto): Promise<AccessTokenDto>
}
