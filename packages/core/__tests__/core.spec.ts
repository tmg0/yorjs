import { defineController, defineField, defineInterceptor, defineInterface, defineModule, defineProvider, defineValidator } from '../index'

describe('jest', () => {
  it('runtime', () => {
    expect(1).toBe(1)
  })
})

export const IProviderA = defineInterface<{ doA:() => string }>()

export const IProviderB = defineInterface<{ doB:() => Promise<string> }>()

export const IController = defineInterface<{ do:(parmas: 'a' | 'b') => string | Promise<string> }>()

export const interactor = defineInterceptor(() => {
  console.log('Before')
  return () => { console.log('After') }
})

export const providerA = defineProvider('pa').implements(IProviderA).setup(() => ({ doA () { return 'A' } }))

export const providerB = defineProvider('pb').implements(IProviderB).setup(() => ({
  doB () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('B')
      }, 1000)
    })
  }
})).useInterceptors(interactor)

export const controller = defineController().implements(IController).inject(IProviderA, IProviderB).setup((a, b) => ({
  do (parmas) {
    return parmas === 'a' ? a.doA() : b.doB()
  }
}))

export const module = defineModule({
  controller,
  providers: [providerA, providerB]
})

export const validator = defineValidator().setup(() => ({
  stringField: defineField('').isString(),
  numberField: defineField(0).isNumber()
}))
