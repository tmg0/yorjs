export const flatten = <T extends any[]>(arr: T): any => [...arr]

export const isString = (val: any): val is string => typeof val === 'string'

export const isNumber = (val: any): val is number => typeof val === 'number'

export const isFunction = (val: any): val is Function => typeof val === 'function'

export const isPromise = (val: any): val is Promise<any> => !!val && (typeof val === 'object' || typeof val === 'function') && typeof val.then === 'function'

export const isStringArray = (strArr: any): strArr is string[] => {
  if (Array.isArray(strArr)) { return false }
  return strArr.length && strArr.findIndex((str: any) => !isString(str)) < 0
}
