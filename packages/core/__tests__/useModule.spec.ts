import { reactive } from 'vue'
import { defineController, defineProvider, defineModule, useModule } from '../'

describe('use module', () => {
  it('should have instance in a single provider', async () => {
    interface SignInDto {
      username: string
      password: string
    }

    interface SignInResDto extends SignInDto {
      token: string
    }

    interface UserApi {
      signIn(data: SignInDto): Promise<SignInResDto>
    }

    interface UserService extends UserApi {}

    const UserApiImpl = defineProvider<UserApi>(() => ({
      signIn(data) {
        return Promise.resolve({ token: 'TOKEN', ...data })
      }
    }))

    const UserServiceImpl = defineProvider<UserService>((userApi: UserApi) => ({
      signIn(data) {
        return userApi.signIn(data)
      }
    }))

    const UserController = defineController((userService: UserService) => {
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
      controller: UserController.dependencies(UserServiceImpl),
      providers: [UserServiceImpl.dependencies(UserApiImpl)]
    })

    const user = useModule(UserModule)

    const { username } = await user.signIn()

    expect(username).toBe(user.usernameSignInForm.username)
  })
})
