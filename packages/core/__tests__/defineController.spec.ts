import { reactive } from 'vue'
import { defineProvider, defineController } from '../'

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

    const UserApiImpl = defineProvider<UserApi>(() => ({
      signIn(data: SignInDto) {
        return Promise.resolve({ token: 'TOKEN' })
      }
    }))

    const UserServiceImpl = defineProvider((userApi: UserApi) => ({
      signIn() {
        userApi.signIn({ username: 'USERNAME', password: 'PASSWORD' })
      }
    })).dependencies(UserApiImpl)

    const UserController = defineController((userService: UserService) => {
      const usernameSignInForm = reactive({ username: '', password: '' })

      const signIn = () => {
        userService.signIn(usernameSignInForm)
      }

      return {
        usernameSignInForm,
        signIn
      }
    }).dependencies(UserServiceImpl)

    expect(UserController.metadata.dependencies.length).toBe(1)
  })
})
