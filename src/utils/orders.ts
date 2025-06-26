import { NumType } from './types'

/**
 * Array of all valid conversion types (excluding special types 'invalid', 'empty', 'unknown')
 *
 * Sorted by priority to use (used mainly for detection:
 * when a string is detected as being possible to be of multiple types,
 * the higher the priority, the more likely it is of that type)
 *
 * You can use {@link compareNumTypeOrder} to sort array of num types by VALID_NUM_TYPES order
 *
 * @remarks `VALID_NUM_TYPES` order:
 * 1. `decimal`
 * 2. `latin_letter`
 * 3. `greek_letter`
 * 4. `month_name`
 * 5. `day_of_week`
 * 6. `roman`
 * 7. `chinese_words`
 * 8. `chinese_financial`
 * 9. `chinese_heavenly_stem`
 * 10. `chinese_earthly_branch`
 * 11. `chinese_solar_term`
 * 12. `cyrillic_letter`
 * 13. `binary`
 * 14. `octal`
 * 15. `hexadecimal`
 * 16. `arabic`
 * 17. `english_cardinal`
 * 18. `english_words`
 * 19. `french_words`
 * 20. `astrological_sign`
 * 21. `nato_phonetic`
 */
export const VALID_NUM_TYPES: NumType[] = [
  'decimal',
  'latin_letter',
  'greek_letter',
  'month_name',
  'day_of_week',
  'roman',
  'chinese_words',
  'chinese_financial',
  'chinese_heavenly_stem',
  'chinese_earthly_branch',
  'chinese_solar_term',
  'cyrillic_letter',
  'binary',
  'octal',
  'hexadecimal',
  'arabic',
  'english_cardinal',
  'english_words',
  'french_words',
  'astrological_sign',
  'nato_phonetic',
]

/**
 * Compare two num types based on their order in the {@link VALID_NUM_TYPES} array
 * @param a - The first num type to compare
 * @param b - The second num type to compare
 * @returns A negative value if a is before b, a positive value if a is after b, or 0 if they are the same
 *
 * @example
 * ```ts
 * numTypes.sort((a, b) => numTypeOrderCompare(a, b))
 * ```
 *
 * @remarks {@link VALID_NUM_TYPES} order:
 * 1. `decimal`
 * 2. `latin_letter`
 * 3. `greek_letter`
 * 4. `month_name`
 * 5. `day_of_week`
 * 6. `roman`
 * 7. `chinese_words`
 * 8. `chinese_financial`
 * 9. `chinese_heavenly_stem`
 * 10. `chinese_earthly_branch`
 * 11. `chinese_solar_term`
 * 12. `cyrillic_letter`
 * 13. `binary`
 * 14. `octal`
 * 15. `hexadecimal`
 * 16. `arabic`
 * 17. `english_cardinal`
 * 18. `english_words`
 * 19. `french_words`
 * 20. `astrological_sign`
 * 21. `nato_phonetic`
 */
export const compareNumTypeOrder = (a: NumType, b: NumType) => {
  return VALID_NUM_TYPES.indexOf(a) - VALID_NUM_TYPES.indexOf(b)
}

/**
 * Extract pattern information from a date format string
 */
function getFormatPattern(format: string): {
  priority: number
  separatorPriority: number
  specificityScore: number
} {
  // Normalize format by extracting the pattern structure
  const normalizedFormat = format
    .replace(/M[a-z]*[12]?/g, 'M') // M, M1, M2, Mf, Ms, etc. -> M
    .replace(/D[12]?/g, 'D') // D, D1, D2 -> D
    .replace(/Y/g, 'Y') // Y -> Y

  // Define pattern priorities
  const patternPriorities: { [key: string]: number } = {
    'Y-M-D': 1,
    'Y.M.D': 1,
    'Y/M/D': 1,
    'Y,M,D': 1,
    'D-M-Y': 2,
    'D.M.Y': 2,
    'D/M/Y': 2,
    'D,M,Y': 2,
    'M-D-Y': 3,
    'M.D.Y': 3,
    'M/D/Y': 3,
    'M,D,Y': 3,
    'Y-M': 4,
    'Y.M': 4,
    'Y/M': 4,
    'Y,M': 4,
    'M-Y': 5,
    'M.Y': 5,
    'M/Y': 5,
    'M,Y': 5,
    'M-D': 6,
    'M.D': 6,
    'M/D': 6,
    'M,D': 6,
    'D-M': 7,
    'D.M': 7,
    'D/M': 7,
    'D,M': 7,
  }

  // Handle special named month formats (space separators, comma-space)
  const namedMonthPatterns: { [key: string]: number } = {
    'M Y': 8, // "January 2023"
    'Y-M': 9, // "2023-January"
    'M-Y': 10, // "January-2023"
    'M D, Y': 11, // "January 1, 2023"
  }

  const priority =
    patternPriorities[normalizedFormat] ||
    namedMonthPatterns[normalizedFormat] ||
    999

  // Get separator priority (- first, then ., /, ,, then space/comma-space)
  let separatorPriority = 0
  if (format.includes('-')) separatorPriority = 0
  else if (format.includes('.')) separatorPriority = 1
  else if (format.includes('/')) separatorPriority = 2
  else if (format.includes(',') && !format.includes(', ')) separatorPriority = 3
  else if (format.includes(', ')) separatorPriority = 5
  else if (format.includes(' ')) separatorPriority = 4

  // Calculate specificity score (M2/D2 should come before M1/D1)
  let specificityScore = 0
  const m2Count = (format.match(/M2/g) || []).length
  const d2Count = (format.match(/D2/g) || []).length
  const m1Count = (format.match(/M1/g) || []).length
  const d1Count = (format.match(/D1/g) || []).length

  // Higher specificity (M2/D2) gets lower score (sorts first)
  specificityScore = m1Count + d1Count - (m2Count + d2Count)

  // For named months, use alphabetical order as secondary sort
  if (priority >= 8) {
    specificityScore += format.localeCompare(format) * 0.01
  }

  return {
    priority,
    separatorPriority,
    specificityScore,
  }
}

/**
 * Compare two date format strings for sorting purposes.
 *
 * @param formatA - The first date format string to compare
 * @param formatB - The second date format string to compare
 * @returns A negative value if formatA is before formatB, a positive value if formatA is after formatB, or 0 if they are the same
 *
 * @example
 * ```ts
 * dateFormats.sort((a, b) => compareDateFormatOrder(a, b))
 * ```
 *
 * @remarks Priority order:
 * 1. `Y-M-D` variations (replacing "-" with ".", ",", "/", ", ", " ", etc.)
 * 2. `D-M-Y` variations
 * 3. `M-D-Y` variations
 * 4. `Y-M` variations
 * 5. `M-Y` variations
 * 6. `M-D` variations
 * 7. `D-M` variations
 * 8. Named month formats (by pattern similarity)
 *
 * Within each category, formats are sorted by separator:
 * 1. `-`
 * 2. `.`
 * 3. `/`
 * 4. `,`
 * 5. `, `
 * 6. ` `
 *
 * then by format specificity (M2/D2 before M1/D1)
 */
export function compareDateFormatOrder(
  formatA: string,
  formatB: string,
): number {
  const patternA = getFormatPattern(formatA)
  const patternB = getFormatPattern(formatB)

  // First compare by pattern priority
  const priorityDiff = patternA.priority - patternB.priority
  if (priorityDiff !== 0) {
    return priorityDiff
  }

  // Then by separator priority within same pattern
  const separatorDiff = patternA.separatorPriority - patternB.separatorPriority
  if (separatorDiff !== 0) {
    return separatorDiff
  }

  // Finally by format specificity (M2/D2 should come before M1/D1)
  return patternA.specificityScore - patternB.specificityScore
}
