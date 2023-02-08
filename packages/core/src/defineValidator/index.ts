import { mapValuesDeep, isObject } from '@yorjs/shared'
import { FieldValidate, isField, validateFeilds } from './_utils'

type FieldValues<T> = { [P in keyof T]: T[P] extends Field ? T[P]['value'] : any }

export class Field {
  public value: any
  public chains: FieldValidate[] = []
  public _min?: number
  public _max?: number

  constructor (value: any) {
    this.value = value
  }

  isString () {
    this.chains.push(FieldValidate.IS_STRING)
    return this
  }

  isNumber () {
    this.chains.push(FieldValidate.IS_NUMBER)
    return this
  }

  min ({ _min }: this) {
    this._min = _min
    this.chains.push(FieldValidate.MIN)
    return this
  }

  max ({ _max }: this) {
    this._max = _max
    this.chains.push(FieldValidate.MAX)
    return this
  }
}

class Validator<T extends Record<string, any>> {
  public _fields: T

  constructor (getter: () => T) {
    this._fields = getter()
  }

  validate (): Promise<void> {
    return validateFeilds(this._fields)
  }

  get value () {
    const fields: any = mapValuesDeep(this._fields, ({ value }) => value, value => !isField(value) && isObject(value))

    return new Proxy(fields as FieldValues<T>, {
      get (target) {
        return target
      },
      set: (target: Record<string, any>, key: string, value) => {
        target[key] = value
        this._fields[key].value = value
        return true
      }
    })
  }
}

export const defineValidator = () => ({
  setup<T extends Record<string, any>> (getter: () => T) {
    return new Validator(getter)
  }
})

export const defineField = (value?: any) => {
  return new Field(value)
}
