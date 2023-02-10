
import { Interface } from '../src/decorators'

@Interface()
export class IUserController {
  username: string
  signIn: () => Promise<void>
}

describe('common', () => {
  it('is run', () => {
    console.log(IUserController)
    debugger

    expect(1).toBe(1)
  })
})

// @Controller()
// @Implements(IUserController)
// @Inject()
// export class UserController implements IUserController {}
