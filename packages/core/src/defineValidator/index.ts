import { isString, isNumber } from '@yorjs/shared'

export enum FieldValidate {
  IS_STRING = 'isString',
  IS_NUMBER = 'isNumber',
  MIN = 'min',
  MAX = 'max'
}

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

type FieldValues<T> = { [P in keyof T]: T[P] extends Field ? T[P]['value'] : any }

class Validator<T extends Record<string, Field>> {
  public _fields: T

  public _check: Record<FieldValidate, (params: Field) => boolean> = {
    isString: (field: Field) => isString(field.value),
    isNumber: (field: Field) => isNumber(field.value),
    min: (field: Field) => !!(field && isNumber(field.value) && field.value > Number(field._min)),
    max: (field: Field) => !!(field && isNumber(field.value) && field.value < Number(field._max))
  }

  constructor (getter: () => T) {
    this._fields = getter()
  }

  validate () {
    return !Object.entries(this._fields).some(([key, { chains }]) => {
      for (const step of chains) {
        if (!this._check[step](this._fields[key])) { return true }
      }

      return false
    })
  }

  get value () {
    const fields: any = {}

    Object.entries(this._fields).forEach(([key, field]) => {
      fields[key] = field.value
    })

    return new Proxy(fields as FieldValues<T>, {
      get (target) {
        return target
      },
      set: (target: any, key: string, value) => {
        target[key] = value
        this._fields[key].value = value
        return true
      }
    })
  }
}

export const defineValidator = () => ({
  setup<T extends Record<string, Field>> (getter: () => T) {
    return new Validator(getter)
  }
})

export const defineField = (value?: any) => {
  return new Field(value)
}
