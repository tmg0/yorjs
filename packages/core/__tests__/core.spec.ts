import { defineController, defineField, defineInterface, defineModule, defineProvider, defineValidator, useDefineModule } from '../index'

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
export const providerD = defineProvider('pd').inject(providerC).setup(p => ({
  doC () { return p.doC() },
  doD () { return 'D' }
}))

export const controllerA = defineController().implements(IController).inject(IProviderA, IProviderB).setup((a, b) => ({
  do (parmas) {
    return parmas === 'a' ? a.doA() : b.doB()
  }
}))

export const controllerB = defineController().inject(providerD).setup(p => ({
  do (parmas: 'c' | 'd') {
    return parmas === 'c' ? p.doC() : p.doD()
  }
}))

export const moduleA = defineModule({
  controller: controllerA,
  providers: [providerA, providerB]
})

export const moduleB = defineModule({
  controller: controllerB,
  providers: [providerC, providerD]
})

export const useModuleA = useDefineModule({
  controller: controllerA,
  providers: [providerA, providerB]
})

export const validator = defineValidator().setup(() => ({
  stringField: defineField('').isString(),
  numberField: defineField(0).isNumber(),
  objectField: defineValidator().setup(() => ({
    strF: defineField('').isString(),
    numF: defineField(0).isNumber()
  }))
}))
