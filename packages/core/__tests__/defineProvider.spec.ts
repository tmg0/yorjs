import { defineProvider } from '../'

describe('define provider', () => {
  it('should have provider dependencies metadata', () => {
    interface SignInDto {
      username: string
      password: string
    }

    interface UserApi {
      signIn(data: SignInDto): Promise<{ token: string }>
    }

    const UserApiImpl = defineProvider<UserApi>(() => ({
      signIn(data: SignInDto) {
        return Promise.resolve({ token: 'TOKEN' })
      }
    }))

    const UserService = defineProvider((userApi: UserApi) => ({
      signIn() {
        userApi.signIn({ username: 'USERNAME', password: 'PASSWORD' })
      }
    })).dependencies(UserApiImpl)

    expect(UserService.metadata.dependencies.length === 1).toBe(true)
  })
})
