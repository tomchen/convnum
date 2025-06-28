import { NumType } from './types'

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

/**
 * Mapping of numeral types to their length
 */
export const numeralLength: Partial<Record<NumType, number>> = {
  latin_letter: 26,
  greek_letter: 24,
  month_name: 12,
  day_of_week: 7,
  // roman: 3999, // Length is 3999 but roman numerals don't support 0 or negative numbers, don't wrap
  chinese_heavenly_stem: 10,
  chinese_earthly_branch: 12,
  chinese_solar_term: 24,
  cyrillic_letter: 33,
  astrological_sign: 12,
  nato_phonetic: 26,
  hebrew_letter: 22,
  greek_letter_english_name: 24,
}

/**
 * Converts any number (including negative, 0, or numbers greater than the range)
 * to the corresponding number in the basic range [1, length] for a given numeral type.
 * Uses circular/modular arithmetic to wrap around the valid range.
 *
 * @param n - The input number (can be any integer)
 * @param numType - The numeral type to get the length for
 * @returns The equivalent number in the valid range [1, length]
 * @throws Error if the numeral type doesn't have a defined length
 *
 * @example
 * ```ts
 * toBasicRange(13, 'astrological_sign') // returns 1 (13 % 12 = 1)
 * toBasicRange(0, 'latin_letter') // returns 26 (0 wraps to end)
 * toBasicRange(-1, 'latin_letter') // returns 25 (-1 wraps to second-to-last)
 * toBasicRange(27, 'latin_letter') // returns 1 (27 % 26 = 1)
 * toBasicRange(25, 'chinese_earthly_branch') // returns 1 (25 % 12 = 1)
 * ```
 */
export function toBasicRange(n: number, numType: NumType): number {
  const length = numeralLength[numType]
  if (length === undefined) {
    throw new Error(`Numeral type "${numType}" does not have a defined length`)
  }

  if (!Number.isInteger(n)) {
    throw new Error('Input must be an integer')
  }

  return modNoZero(n, length)
}
