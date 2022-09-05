// import { reactive } from 'vue'
import { defineProvider } from '../'
import { useProvider } from '../useProvider'

describe('define controller', () => {
  it('should have controller dependencies in metadata', () => {
    interface SignInDto {
      username: string
      password: string
    }

    interface UserApi {
      signIn(data: SignInDto): Promise<{ token: string }>
    }

    interface UserService {
      signIn(data: SignInDto): Promise<{ token: string }>
    }

    // const UserApiImpl = defineProvider<UserApi>(() => ({
    //   signIn(data: SignInDto) {
    //     return Promise.resolve({ token: 'TOKEN' })
    //   }
    // }))

    const UserServiceImpl = defineProvider<UserService>((userApi: UserApi) => ({
      signIn(data: SignInDto) {
        return userApi.signIn(data)
      }
    }))

    // const UserController = defineController((userService: UserService) => {
    //   const usernameSignInForm = reactive({ username: '', password: '' })

    //   const signIn = () => {
    //     userService.signIn(usernameSignInForm)
    //   }

    //   return {
    //     usernameSignInForm,
    //     signIn
    //   }
    // })

    // const UserModule = defineModule({
    //   controller: UserController.dependencies(UserServiceImpl),
    //   providers: [UserServiceImpl.dependencies(UserApiImpl), UserApiImpl]
    // })

    const userService = useProvider(UserServiceImpl)

    console.log(userService)

    expect(1).toBe(1)
  })
})
