import { isString, isNumber, mapValuesDeep, isObject } from '@yorjs/shared'

type FieldValues<T> = { [P in keyof T]: T[P] extends Field ? T[P]['value'] : any }

export enum FieldValidate {
  IS_STRING = 'isString',
  IS_NUMBER = 'isNumber',
  MIN = 'min',
  MAX = 'max'
}

export const isField = (value: any): value is Field => value.constructor === Field

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

  public _check: Record<FieldValidate, (params: Field) => boolean> = {
    isString: (field: Field) => isString(field.value),
    isNumber: (field: Field) => isNumber(field.value),
    min: (field: Field) => !!(field && isNumber(field.value) && field.value > Number(field._min)),
    max: (field: Field) => !!(field && isNumber(field.value) && field.value < Number(field._max))
  }

  constructor (getter: () => T) {
    this._fields = getter()
  }

  validate (): Promise<void> {
    // return new Promise((resolve, reject) => {
    //   let valid = true
    //   mapValuesDeep(this._fields, (field?: Field) => {
    //     if (!field || !isField(field)) { return }

    //     for (const step of field.chains) {
    //       if (!this._check[step](field)) {
    //         valid = false
    //         reject(field)
    //         break
    //       }
    //     }

    //     return field
    //   }, value => !isField(value) && isObject(value))

    //   if (valid) { resolve() }
    // })

    const valid = !Object.entries(this._fields).some(([key, field]) => {
      if (!isField(field)) { return true }

      for (const step of field.chains) {
        if (!this._check[step](this._fields[key])) { return true }
      }

      return false
    })

    return valid ? Promise.resolve() : Promise.reject(valid)
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
