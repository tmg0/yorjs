import { defineProvider } from '../'
import { useProvider } from '../useProvider'

describe('use provider', () => {
  it('should have sign in method in user service', async () => {
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
        return Promise.resolve({ token: 'TOKEN', ...data })
      }
    }))

    const UserServiceImpl = defineProvider<UserService>((userApi: UserApi) => ({
      signIn(data: SignInDto) {
        return userApi.signIn(data)
      }
    })).dependencies(UserApiImpl)

    const { signIn } = useProvider(UserServiceImpl)

    const res = await signIn({ username: 'USERNAME', password: 'PASSWORD' })

    expect(res.token).toBe('TOKEN')
  })
})
