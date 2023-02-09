
import { isNumber, isObject, isString, mapValues, mapValuesDeep } from '@yorjs/shared'

type ValidatorFields<T> = { [P in keyof T]: T[P] extends Field ? T[P]['value'] : T[P] extends Validator<any> ? ValidatorFields<T[P]> : any }

export enum FieldValidate {
  IS_STRING = 'isString',
  IS_NUMBER = 'isNumber',
  MIN = 'min',
  MAX = 'max',
  MAX_LENGTH = 'maxLength',
  IS_ARRAY = 'isArray'
}

export const isField = (value: any): value is Field => value.constructor === Field
export const isValidator = (value: any): value is Validator<any> => value.constructor === Validator

export const validatorPolicy: Record<FieldValidate, (params: Field) => boolean> = {
  isString: (field: Field) => isString(field.value),
  isNumber: (field: Field) => isNumber(field.value),
  isArray: (field: Field) => !!field,
  min: (field: Field) => !!(field && isNumber(field.value) && field.value > Number(field._min)),
  max: (field: Field) => !!(field && isNumber(field.value) && field.value < Number(field._max)),
  maxLength: (field: Field) => validatorPolicy.isArray(field.value) && field.value.length < Number(field._maxLength)
}

export const validateFeilds = <T extends Record<string, any>>(fields: T): Promise<void> => {
  let valid = true
  let hasValidator = false

  return new Promise((resolve, reject) => {
    for (const [key, field] of Object.entries(fields)) {
      if (isField(field)) {
        for (const step of field.chains) {
          if (!validatorPolicy[step](fields[key])) {
            valid = false
            break
          }
        }

        if (!valid) { break }
      }

      if (isValidator(field)) {
        hasValidator = true
        field.validate().then(resolve).catch(() => {
          valid = false
          reject(valid)
        })
      }
    }

    if (!hasValidator) { valid ? resolve() : reject(valid) }
  })
}

export const validateFeildsDeep = <T extends Record<string, any>>(fields: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    let valid = true
    mapValuesDeep(fields, (field?: Field) => {
      if (!field || !isField(field)) { return }

      for (const step of field.chains) {
        if (!validatorPolicy[step](field)) {
          valid = false
          reject(field)
          break
        }
      }

      return field
    }, value => !isField(value) && isObject(value))

    if (valid) { resolve() }
  })
}

export class Field {
  public value: any
  public chains: FieldValidate[] = []
  public _min?: number
  public _max?: number
  public _maxLength?: number

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

  maxLength ({ _maxLength }: this) {
    this._maxLength = _maxLength
    this.chains.push(FieldValidate.MAX_LENGTH)
    return this
  }
}

export class Validator<T extends Record<string, any>> {
  public _fields: T

  constructor (getter: () => T) {
    this._fields = getter()
  }

  validate (): Promise<void> {
    return validateFeilds(this._fields)
  }

  get value () {
    const fields: Record<string, any> = mapValues(this._fields, (field: any) => {
      if (isField(field)) { return field.value }
      if (isValidator(field)) { return field }

      return field
    })

    return new Proxy(fields as ValidatorFields<T>, {
      get: (_, key: string) => {
        return this._fields[key]
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
