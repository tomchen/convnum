import { s2t, t2s } from './zhSTConv'

export function toT2SFn<T>(fn: (s: string) => T) {
  return function (str: string): T {
    str = t2s(str)
    return fn(str)
  }
}

export function toS2TFn<T, U>(fn: (arg1: T, arg2: U) => string) {
  return function (arg1: T, arg2: U, trad = false): string {
    const str = fn(arg1, arg2)
    return trad ? s2t(str) : str
  }
}
