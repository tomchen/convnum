import { modNoZero } from './circular'

export function toArrayItem(num: number, arr: string[], circular = false) {
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }
  if (!circular && (num > arr.length || num < 1)) {
    throw new Error(`Input must be an integer between 1 and ${arr.length}`)
  }
  return arr[(circular ? modNoZero(num, arr.length) : num) - 1]
}

export function fromArrayItem(item: string, arr: string[]) {
  const index = arr.indexOf(item)
  if (index === -1) {
    throw new Error('Input is invalid')
  }
  return index + 1
}

export function toToArrayItemFn(arr: string[]) {
  return function (num: number, circular = false) {
    return toArrayItem(num, arr, circular)
  }
}

export function toFromArrayItemFn(
  arr: string[],
  sanitizeFn?: (item: string) => string,
) {
  return function (item: string) {
    return fromArrayItem(sanitizeFn ? sanitizeFn(item) : item, arr)
  }
}
