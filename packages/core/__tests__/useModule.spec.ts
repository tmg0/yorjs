import { reactive } from 'vue'
import { defineController, defineInterface, defineModule, defineProvider, useModule } from '../index'

describe('use module', () => {
  it('should have instance in a single provider', async () => {
    interface SignInDto {
      username: string
      password: string
    }

    interface SignInResDto extends SignInDto {
      token: string
    }

    const IUserRep = defineInterface<{
      signIn(data: SignInDto): Promise<SignInResDto>
    }>()

    const IUserService = defineInterface<{
      signIn(data: SignInDto): Promise<SignInResDto>
    }>()

    const IProvider = defineInterface<{
      get(): string
    }>()

    const userRep = defineProvider()(() => ({
      signIn(data: SignInDto) {
        return Promise.resolve({ token: 'TOKEN', ...data })
      }
    })).implements(IUserRep)

    const p = defineProvider()(() => ({
      get() {
        return ''
      }
    })).implements(IProvider)

    const userService = defineProvider(IUserRep, IProvider)((rep, p) => ({
      signIn(data: SignInDto) {
        return rep.signIn({ ...data, username: p.get() })
      }
    })).implements(IUserService)

    const userController = defineController(IUserService)((userService) => {
      const usernameSignInForm = reactive({ username: '', password: '' })

      const signIn = () => {
        return userService.signIn(usernameSignInForm)
      }

      return {
        usernameSignInForm,
        signIn
      }
    })

    const UserModule = defineModule({
      controller: userController,
      providers: [userService, userRep, p]
    })

    const user = useModule(UserModule)

    const { username } = await user.signIn()

    expect(username).toBe(user.usernameSignInForm.username)
  })
})
