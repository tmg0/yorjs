import { defineController, defineField, defineInterface, defineModule, defineProvider, defineValidator } from '../index'

describe('jest', () => {
  it('runtime', () => {
    expect(1).toBe(1)
  })
})

export const IProviderA = defineInterface<{ doA:() => string }>()

export const IProviderB = defineInterface<{ doB:() => Promise<string> }>()

export const IController = defineInterface<{ do:(parmas: 'a' | 'b') => string | Promise<string> }>()

export const providerA = defineProvider('pa').implements(IProviderA).setup(() => ({ doA () { return 'A' } }))

export const providerB = defineProvider('pb').implements(IProviderB).setup(() => ({
  doB () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('B')
      }, 500)
    })
  }
}))

export const providerC = defineProvider('pc').setup(() => ({ doC () { return 'C' } }))
export const providerD = defineProvider('pd').inject(providerC).setup(p => ({ doC () { return p.doC() } }))

export const controllerA = defineController().implements(IController).inject(IProviderA, IProviderB).setup((a, b) => ({
  do (parmas) {
    return parmas === 'a' ? a.doA() : b.doB()
  }
}))

export const controllerB = defineController().implements(IController).inject(IProviderA, IProviderB).setup((a, b) => ({
  do (parmas) {
    return parmas === 'a' ? a.doA() : b.doB()
  }
}))

export const moduleA = defineModule({
  controller: controllerA,
  providers: [providerA, providerB]
})

export const moduleB = defineModule({
  providers: [providerC, providerD]
})

export const validator = defineValidator().setup(() => ({
  stringField: defineField('').isString(),
  numberField: defineField(0).isNumber(),
  objectField: defineValidator().setup(() => ({
    strF: defineField('').isString(),
    numF: defineField(0).isNumber()
  }))
}))
