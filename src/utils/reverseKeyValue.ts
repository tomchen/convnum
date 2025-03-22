export function reverseKeyValue<
  K extends string | number | symbol,
  V extends string | number | symbol,
>(obj: Record<K, V>) {
  const reversed = {} as Record<V, K>
  for (const key in obj) {
    reversed[obj[key]] = key as K
  }
  return reversed
}
