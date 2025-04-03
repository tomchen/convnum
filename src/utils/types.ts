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
 * Array of all valid conversion types (excluding special types 'invalid', 'empty', 'unknown')
 */
export const VALID_NUM_TYPES: NumType[] = [
  'decimal',
  'binary',
  'octal',
  'hexadecimal',
  'roman',
  'arabic',
  'english_cardinal',
  'english_words',
  'french_words',
  'chinese_words',
  'chinese_financial',
  'chinese_heavenly_stem',
  'chinese_earthly_branch',
  'chinese_solar_term',
  'astrological_sign',
  'nato_phonetic',
  'month_name',
  'day_of_week',
  'latin_letter',
  'greek_letter',
  'cyrillic_letter',
]
