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
 *   - "sentence" case (first letter capitalized, rest lowercase)
 *   - "title" case (first letter of each word capitalized, separated by spaces and "-")
 *   - "lower" case (all lowercase)
 *   - "upper" case (all uppercase)
 */
export type CaseType = 'sentence' | 'title' | 'lower' | 'upper'

/**
 * Format types for date/time strings
 *   - "short" format (e.g. "Jan", "Dec")
 *   - "long" format (e.g. "January", "December")
 */
export type FormatType = 'short' | 'long'

/**
 * Prefix types for base numbers
 *   - "lower" prefix (e.g. "0b", "0x")
 *   - "upper" prefix (e.g. "0B", "0X")
 *   - false (no prefix)
 */
export type PrefixType = false | 'lower' | 'upper'

/**
 * Chinese script type for Traditional/Simplified detection
 *   - 0: the text is Simplified Chinese for sure
 *   - 1: the text is Traditional Chinese for sure
 *   - 2: not sure if it is Simplified or Traditional
 */
export type ZhstType = 0 | 1 | 2

/**
 * Type information with additional properties
 * @remarks `zhst` is only used in chinese_words, chinese_financial, chinese_solar_term, not used in chinese_heavenly_stem, chinese_earthly_branch, both of which contain only simp-trad-same-form characters
 */
export type TypeInfo = {
  type: NumType
  case?: CaseType
  format?: FormatType
  prefix?: PrefixType
  zhst?: ZhstType
}
