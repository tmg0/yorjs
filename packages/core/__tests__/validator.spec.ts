import { validator } from './core.spec'

const reset = () => {
  validator.value.stringField = ''
  validator.value.numberField = 0
}

const parseValidateResult = async (validator: { validate: () => Promise<void> }) => {
  try {
    await validator.validate()
    return true
  } catch { return false }
}

describe('define validator', () => {
  it('should check default value', async () => {
    reset()
    expect(await parseValidateResult(validator)).toBe(true)
  })

  it('should check string type field', async () => {
    reset()
    validator.value.stringField = 0
    expect(await parseValidateResult(validator)).toBe(false)
  })

  it('should check number type field', async () => {
    reset()
    validator.value.numberField = ''
    expect(await parseValidateResult(validator)).toBe(false)
  })
})
