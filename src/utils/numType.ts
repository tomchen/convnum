import { NumType } from './types'

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
