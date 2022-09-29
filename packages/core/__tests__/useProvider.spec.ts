import { defineGuard, defineProvider, useProvider } from '../'

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

const AccessGuard = defineGuard(() => {
  return true
})

const UserServiceImpl = defineProvider<UserService>((userApi: UserApi) => ({
  signIn(data: SignInDto) {
    return userApi.signIn(data)
  }
}), { singleton: true }).dependencies(UserApiImpl)

describe('use provider', () => {
  it('should have token field in user service', async () => {
    const { signIn } = useProvider(UserServiceImpl)

    const res = await signIn({ username: 'USERNAME', password: 'PASSWORD' })

    expect(res.token).toBe('TOKEN')
  })

  it('should use same instance in same provider', async () => {
    const s1 = useProvider(UserServiceImpl)
    const s2 = useProvider(UserServiceImpl)

    expect(s1).toBe(s2)
  })

  it('should guard before generate provider instance', () => {
    useProvider(UserServiceImpl.useGuards(AccessGuard))

    expect(1).toBe(1)
  })
})
