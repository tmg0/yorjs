export const flatten = <T extends any[]>(arr: T): any => [...arr]

export const isFunction = (val: any): boolean => typeof val === 'function'

export const isPromise = (val: any): boolean => !!val && (typeof val === 'object' || typeof val === 'function') && typeof val.then === 'function'
