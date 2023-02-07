import { validator } from './core.spec'

describe('define validator', () => {
  it('should check default value', () => {
    expect(validator.validate()).toBe(true)
  })

  it('should check string type field', () => {
    validator.value.stringField = 0
    expect(validator.validate()).toBe(false)
  })

  it('should check number type field', () => {
    validator.value.numberField = ''
    expect(validator.validate()).toBe(false)
  })
})
