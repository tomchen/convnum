/**
 * All supported number types in the library
 *
 * Excluded: julian_day, base
 *
 * Included: decimal, chinese_financial
 *
 * Included: invalid (non string input), empty (empty string input), unknown (unknown input)
 */
export type NumType =
  | 'decimal'
  | 'binary'
  | 'octal'
  | 'hexadecimal'
  | 'roman'
  | 'arabic'
  | 'english_cardinal'
  | 'english_words'
  | 'french_words'
  | 'chinese_words'
  | 'chinese_financial'
  | 'chinese_heavenly_stem'
  | 'chinese_earthly_branch'
  | 'chinese_solar_term'
  | 'astrological_sign'
  | 'nato_phonetic'
  | 'month_name'
  | 'day_of_week'
  | 'latin_letter'
  | 'greek_letter'
  | 'cyrillic_letter'
  | 'invalid'
  | 'empty'
  | 'unknown'

/**
 * Case types for string formatting
 */
export type CaseType = 'sentence' | 'title' | 'lower' | 'upper'

/**
 * Format types for date/time strings
 */
export type FormatType = 'short' | 'long'

/**
 * Prefix types for base numbers
 */
export type PrefixType = false | 'lower' | 'upper'

/**
 * Type information with additional properties
 */
export type TypeInfo = {
  type: NumType
  case?: CaseType
  format?: FormatType
  prefix?: PrefixType
}

/**
 * Array of all valid conversion types (excluding special types 'invalid', 'empty', 'unknown')
 *
 * Sorted by priority to use (used mainly for detection: when a string is detected as being possible to be of multiple types, the higher the priority, the more likely it is of that type)
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
