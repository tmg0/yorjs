import { defineInterface, defineProvider } from '../index'

describe('define provider', () => {
  it('should have provider dependencies in metadata', () => {
    interface SignInDto {
      username: string
      password: string
    }

    const IUserApi = defineInterface<{
      signIn(data: SignInDto): Promise<{ token: string }>
    }>()

    const IUserService = defineInterface<{
      signIn(data: SignInDto): Promise<{ token: string }>
    }>()

    // const userApi = defineProvider()(() => ({
    //   signIn(_data) {
    //     return Promise.resolve({ token: 'TOKEN' })
    //   }
    // })).implements(IUserApi)

    const userService = defineProvider().implements(IUserService).inject(IUserApi).setup(api => ({
      signIn(_data) {
        return api.signIn({ username: 'USERNAME', password: 'PASSWORD' })
      }
    }))

    expect(!!userService.dependencies).toBe(true)
  })
})
