import { reactive } from 'vue'
import { defineController, defineInterface, defineModule, defineProvider, useModule } from '../index'

const IP1 = defineInterface<{ do1: () => string }>()
const IP2 = defineInterface<{ do2: () => string }>()

const p1 = defineProvider().implements(IP1).build(() => ({
  do1() { return 'STR' }
}), { singleton: true })

const p2 = defineProvider().implements(IP2).inject(IP1).build(p1 => ({
  do2: p1.do1
}))

describe('use module', () => {
  it('should have controller method in module', () => {
    const IC = defineInterface<{ do: (v: string) => string }>()

    const c = defineController().implements(IC).inject(IP1, IP2).build((p1, p2) => {
      return {
        do(v) {
          if (typeof v === 'string')
            return p1.do1()
          return p2.do2()
        }
      }
    })

    const m = defineModule({ controller: c, providers: [p1, p2] })

    const { do: mDo } = useModule(m)

    expect(mDo('')).toBe('STR')
  })

  it('should have only one instance in same provider', async () => {
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

    const IUserController = defineInterface<{
      usernameSignInForm: {
        username: string
        password: string
      }

      signIn: () => void
      get: () => string
    }>()

    const userController = defineController().implements(IUserController).inject(IUserService).build((userService) => {
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

    const userModule = defineModule({
      controller: userController,
      providers: [userService, userRep, p]
    })

    const { get } = useModule(userModule)

    expect(get()).toBe('done')
  })
})
