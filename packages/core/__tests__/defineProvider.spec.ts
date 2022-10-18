import { defineInterface, defineProvider } from '../index'

describe('define provider', () => {
  it('should have provider dependencies in metadata', () => {
    interface SignInDto {
      username: string
      password: string
    }

    interface UserApi {
      signIn(data: SignInDto): Promise<{ token: string }>
    }

    const userApi = defineProvider<UserApi>(() => ({
      signIn(_data) {
        return Promise.resolve({ token: 'TOKEN' })
      }
    })).implements(defineInterface<UserApi>())

    const userService = defineProvider((api: UserApi) => ({
      signIn() {
        api.signIn({ username: 'USERNAME', password: 'PASSWORD' })
      }
    })).dependencies(userApi)

    expect(userService.metadata.dependencies.length).toBe(1)
  })
})
