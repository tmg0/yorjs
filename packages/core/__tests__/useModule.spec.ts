// import { reactive } from 'vue'
import { reactive } from 'vue'
import { defineController, defineProvider, defineModule, useModule } from '../'

describe('define controller', () => {
  it('should have controller dependencies in metadata', async () => {
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
      signIn(data: SignInDto) {
        return Promise.resolve({ token: 'TOKEN', ...data })
      }
    }))

    const UserServiceImpl = defineProvider<UserService>((userApi: UserApi) => ({
      signIn(data: SignInDto) {
        return userApi.signIn(data)
      }
    })).dependencies(UserApiImpl)

    const UserController = defineController((userService: UserService) => {
      const usernameSignInForm = reactive({ username: '', password: '' })

      const signIn = () => {
        return userService.signIn(usernameSignInForm)
      }

      return {
        usernameSignInForm,
        signIn
      }
    }).dependencies(UserServiceImpl)

    const UserModule = defineModule({ controller: UserController })

    const user = useModule(UserModule)

    const { username } = await user.signIn()

    expect(username).toBe(user.usernameSignInForm.username)
  })
})
