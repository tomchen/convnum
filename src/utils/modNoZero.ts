/**
 * Mod function that returns positive result for negative numbers or for 0
 * @param n
 * @param m
 * @returns positive result for negative numbers or for 0
 */
export function modNoZero(n: number, m: number): number {
  const result = ((n % m) + m) % m
  return result === 0 ? m : result
}
