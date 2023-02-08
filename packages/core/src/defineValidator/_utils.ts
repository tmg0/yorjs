import { isString, isNumber, mapValuesDeep, isObject } from '@yorjs/shared'
import { Field } from '.'

export enum FieldValidate {
  IS_STRING = 'isString',
  IS_NUMBER = 'isNumber',
  MIN = 'min',
  MAX = 'max',
  MAX_LENGTH = 'maxLength',
  IS_ARRAY = 'isArray'
}

export const isField = (value: any): value is Field => value.constructor === Field

export const policy: Record<FieldValidate, (params: Field) => boolean> = {
  isString: (field: Field) => isString(field.value),
  isNumber: (field: Field) => isNumber(field.value),
  isArray: (field: Field) => !!field,
  min: (field: Field) => !!(field && isNumber(field.value) && field.value > Number(field._min)),
  max: (field: Field) => !!(field && isNumber(field.value) && field.value < Number(field._max)),
  maxLength: (field: Field) => !!field
}

export const validateFeilds = <T extends Record<string, any>>(fields: T): Promise<void> => {
  const valid = !Object.entries(fields).some(([key, field]) => {
    if (!isField(field)) { return true }

    for (const step of field.chains) {
      if (!policy[step](fields[key])) { return true }
    }

    return false
  })

  return valid ? Promise.resolve() : Promise.reject(valid)
}

export const validateFeildsDeep = <T extends Record<string, any>>(fields: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    let valid = true
    mapValuesDeep(fields, (field?: Field) => {
      if (!field || !isField(field)) { return }

      for (const step of field.chains) {
        if (!policy[step](field)) {
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
