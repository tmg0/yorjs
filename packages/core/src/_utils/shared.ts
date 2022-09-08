export const flatten = <T extends any[]>(arr: T): any => {
  const flat = [...arr]
  return flat
}

export const isFunction = (val: any): boolean => typeof val === 'function'

export const isPromise = (val: any) => !!val && (typeof val === 'object' || typeof val === 'function') && typeof val.then === 'function'
