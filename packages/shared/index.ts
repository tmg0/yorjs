export const flatten = <T extends any[]>(arr: T): any => [...arr]

export const isString = (val: any): val is string => typeof val === 'string'

export const isNumber = (val: any): val is number => typeof val === 'number'

export const isObject = (val: any): val is Record<string, any> => val && typeof val === 'object'

export const isFunction = (val: any): val is Function => typeof val === 'function'

export const isPromise = (val: any): val is Promise<any> => !!val && (typeof val === 'object' || typeof val === 'function') && typeof val.then === 'function'

export const isStringArray = (strArr: any): strArr is string[] => {
  if (Array.isArray(strArr)) { return false }
  return strArr.length && strArr.findIndex((str: any) => !isString(str)) < 0
}

export const optionalChaining = (val: Record<string, any>, ...rest: string[]) => {
  let tmp = val
  for (const key in rest) {
    const name = rest[key]
    tmp = tmp?.[name]
  }
  return tmp || ''
}

export const traversalObject = (val: any, callback = (_keys: string[], _value: any) => true, parentKeys: string[] = []): void => {
  if (!isObject(val)) { return }

  for (const key in val) {
    const item = val[key]
    const keys = [...parentKeys, key]

    if (isObject(item)) { traversalObject(val[key], callback, keys) }
    if (!isObject && callback(keys, item)) { return }
  }
}

export const mapValues = <T extends Record<string, any>>(object: T, iteratee: (value: T, key: string, object: Record<string, T>) => any) => {
  object = Object(object)
  const result: Record<string, any> = {}

  Object.keys(object).forEach((key) => {
    result[key] = iteratee(object[key], key, object)
  })
  return result
}

export const mapValuesDeep = <T>(object: Record<string, T>, iteratee: (value: any, key?: string) => any, is: (value: any) => boolean = isObject): any => {
  return is(object) ? mapValues(object, v => mapValuesDeep(v, iteratee, is)) : iteratee(object)
}
