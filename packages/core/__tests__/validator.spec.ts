import { validator } from './core.spec'

describe('define validator', () => {
  it('should have validate function in validator', () => {
    expect(validator.validate()).toBe(true)
  })

  it('should check string type field', () => {
    validator.value.username = 0
    expect(validator.validate()).toBe(false)
  })
})
