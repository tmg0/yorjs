import { isNumber, isString } from '@yorjs/shared'

export class Field {
  public value: any

  public isValidate = true

  constructor (value: any) {
    this.value = value
  }

  isString () {
    if (!isString(this.value)) { this.isValidate = false }
    return this
  }

  isNumber () {
    if (!isNumber(this.value)) { this.isValidate = false }
    return this
  }

  min (value: number) {
    if (!isNumber(this.value)) { this.isValidate = false }
    if (this.value < value) { this.isValidate = false }
    return this
  }

  max (value: number) {
    if (!isNumber(this.value)) { this.isValidate = false }
    if (this.value > value) { this.isValidate = false }
    return this
  }
}

type FieldValues<T> = { [P in keyof T]: T[P] extends Field ? T[P]['value'] : any }

class Validator<T extends Record<string, Field>> {
  public _fields: T

  constructor (fields: T) {
    this._fields = fields
  }

  validate () {
    return !Object.values(this._fields).some(({ isValidate }) => isValidate)
  }

  get value () {
    const res: any = {}
    Object.entries(this._fields).forEach(([key, field]) => {
      res[key] = field.value
    })
    return res as FieldValues<T>
  }
}

export const defineValidator = () => ({
  setup<T extends Record<string, Field>> (getter: () => T) {
    return new Validator(getter())
  }
})

export const defineField = (value: any) => {
  return new Field(value)
}
