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
      get(): string
    }>()

    const IProvider = defineInterface<{
      get(): string
    }>()

    const p = defineProvider().implements(IProvider).build(() => ({
      get() {
        return 'done'
      }
    }))

    const userRep = defineProvider().implements(IUserRep).build(() => ({
      signIn(data: SignInDto) {
        return Promise.resolve({ token: 'TOKEN', ...data })
      }
    }))

    const userService = defineProvider().implements(IUserService).inject(IUserRep, IProvider).build((rep, p) => ({
      signIn(data) {
        return rep.signIn(data)
      },
      get() {
        return p.get()
      }
    }))

    const userController = defineController(IUserService)((userService) => {
      const usernameSignInForm = reactive({ username: '', password: '' })

      const signIn = () => {
        return userService.signIn(usernameSignInForm)
      }

      const get = () => {
        return userService.get()
      }

      return {
        usernameSignInForm,
        signIn,
        get
      }
    })

    const UserModule = defineModule({
      controller: userController,
      providers: [userService, userRep, p]
    })

    const user = useModule(UserModule)

    expect(user.get()).toBe('done')
  })
})
