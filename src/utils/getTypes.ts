import { fromRoman } from '../roman'
import { fromArabicNumerals } from '../arabic'
import { validateEnglishWords } from '../english'
import { fromEnglishCardinal } from '../englishCardinal'
import { validateFrenchWords } from '../french'
import { validateChineseWords } from '../chinese'
import {
  fromChineseHeavenlyStem,
  fromChineseEarthlyBranch,
  fromChineseSolarTerm,
  validateChineseFinancial,
} from '../chinese2'
import { fromAstroSign } from '../astrosign'
import {
  fromLatinLetter,
  fromGreekLetter,
  fromCyrillicLetter,
  natoAlphabet,
  fromHebrewLetter,
  fromGreekLetterEnglishName,
} from '../alphabet'
import { fromMonth, fromDayOfWeek, toMonth, toDayOfWeek } from '../datetime'
import { capitalizeFirstLetter } from './letterFns'
import { isZhTOrS } from './zhSTConv'
import {
  NumType,
  TypeInfo,
  CaseType,
  FormatType,
  PrefixType,
  ZhstType,
} from './types'
import { VALID_NUM_TYPES } from './orders'

/**
 * Determines the case of a string
 */
function detectCase(str: string): CaseType {
  if (str === str.toLowerCase()) return 'lower'
  if (str === str.toUpperCase()) return 'upper'

  // Check for title case (first letter of each word capitalized, separated by spaces and "-")
  const words = str.split(/[\s-]+/)
  if (words.length > 1) {
    const isTitleCase = words.every(
      (word) =>
        word.length > 0 &&
        word[0] === word[0].toUpperCase() &&
        word.slice(1) === word.slice(1).toLowerCase(),
    )
    if (isTitleCase) return 'title'
  }

  // Check for sentence case (first letter capitalized, rest lowercase)
  if (
    str[0] === str[0].toUpperCase() &&
    str.slice(1) === str.slice(1).toLowerCase()
  ) {
    return 'sentence'
  }

  // If none of the above patterns match exactly, default to sentence for mixed case
  return 'sentence'
}

/**
 * Detects prefix format for base number types
 */
function detectPrefix(
  str: string,
  type: 'hexadecimal' | 'binary' | 'octal',
): PrefixType {
  switch (type) {
    case 'hexadecimal':
      if (str.startsWith('0x')) return 'lower'
      if (str.startsWith('0X')) return 'upper'
      break
    case 'binary':
      if (str.startsWith('0b')) return 'lower'
      if (str.startsWith('0B')) return 'upper'
      break
    case 'octal':
      if (str.startsWith('0o')) return 'lower'
      if (str.startsWith('0O')) return 'upper'
      break
  }
  return false
}

/**
 * Determines the format of month/day names
 */
function detectDateFormat(
  str: string,
  type: 'month' | 'day',
): FormatType | undefined {
  const normalizedStr = str.toLowerCase()

  if (type === 'month') {
    // Check if it's a short month name
    for (let i = 1; i <= 12; i++) {
      const shortMonth = toMonth(i, 'en-US', 'short').toLowerCase()
      const longMonth = toMonth(i, 'en-US', 'long').toLowerCase()
      if (normalizedStr === shortMonth) return 'short'
      if (normalizedStr === longMonth) return 'long'
    }
  } else if (type === 'day') {
    // Check if it's a short day name
    for (let i = 0; i < 7; i++) {
      const shortDay = toDayOfWeek(i, 'en-US', 'short').toLowerCase()
      const longDay = toDayOfWeek(i, 'en-US', 'long').toLowerCase()
      if (normalizedStr === shortDay) return 'short'
      if (normalizedStr === longDay) return 'long'
    }
  }

  return undefined
}

/**
 * Mapping of type names to their validation functions that check if a string matches a specific type.
 * Each function takes a string and returns true if it's a valid representation of that type.
 * Used internally by getTypes() and hasType() but exported for direct access to specific validators.
 * @example
 * ```ts
 * typeValidators.decimal('123') // returns true
 * typeValidators.decimal('abc') // returns false
 * typeValidators.roman('IV') // returns true
 * typeValidators.roman('invalid') // returns false
 * typeValidators.latin_letter('A') // returns true
 * typeValidators.latin_letter('AB') // returns false
 * ```
 */
export const typeValidators: Record<NumType, (str: string) => boolean> = {
  decimal: (str) => /^-?\d+(\.\d+)?$/.test(str),
  binary: (str) => /^(0[bB])?[01]+$/.test(str),
  octal: (str) => /^(0[oO])?[0-7]+$/.test(str),
  hexadecimal: (str) => /^(0[xX])?[0-9a-fA-F]+$/.test(str),
  roman: (str) => {
    try {
      fromRoman(str)
      return true
    } catch {
      return false
    }
  },
  arabic: (str) => {
    try {
      fromArabicNumerals(str)
      return true
    } catch {
      return false
    }
  },
  english_cardinal: (str) => {
    try {
      fromEnglishCardinal(str)
      return true
    } catch {
      return false
    }
  },
  english_words: (str) => validateEnglishWords(str), // currently strict validation
  french_words: (str) => validateFrenchWords(str), // currently strict validation
  chinese_words: (str) => validateChineseWords(str), // currently strict validation
  chinese_financial: (str) => validateChineseFinancial(str),
  chinese_heavenly_stem: (str) => {
    try {
      fromChineseHeavenlyStem(str)
      return true
    } catch {
      return false
    }
  },
  chinese_earthly_branch: (str) => {
    try {
      fromChineseEarthlyBranch(str)
      return true
    } catch {
      return false
    }
  },
  chinese_solar_term: (str) => {
    try {
      fromChineseSolarTerm(str)
      return true
    } catch {
      return false
    }
  },
  astrological_sign: (str) => {
    try {
      fromAstroSign(str)
      return true
    } catch {
      return false
    }
  },
  nato_phonetic: (str) => {
    const normalizedWord = capitalizeFirstLetter(str.trim())
      .replace(/^Alpha$/i, 'Alfa')
      .replace(/^Juliet$/i, 'Juliett')
      .replace(/^Xray$/i, 'X-ray')
    return natoAlphabet.includes(normalizedWord)
  },
  month_name: (str) => fromMonth(str) !== null,
  day_of_week: (str) => fromDayOfWeek(str) !== null,
  latin_letter: (str) => {
    if (!/^[A-Za-z]$/.test(str)) return false
    try {
      fromLatinLetter(str)
      return true
    } catch {
      return false
    }
  },
  greek_letter: (str) => {
    if (!/^[Α-Ωα-ω]$/.test(str)) return false
    try {
      fromGreekLetter(str)
      return true
    } catch {
      return false
    }
  },
  cyrillic_letter: (str) => {
    if (!/^[А-Яа-яЁё]$/.test(str)) return false
    try {
      fromCyrillicLetter(str)
      return true
    } catch {
      return false
    }
  },
  hebrew_letter: (str) => {
    if (!/^[א-ת]$/.test(str)) return false
    try {
      fromHebrewLetter(str)
      return true
    } catch {
      return false
    }
  },
  greek_letter_english_name: (str) => {
    if (!/^[A-Za-z]+$/.test(str)) return false
    try {
      fromGreekLetterEnglishName(str)
      return true
    } catch {
      return false
    }
  },
  // Special types
  invalid: () => false,
  empty: () => false,
  unknown: () => false,
}

/**
 * Creates TypeInfo object with detected properties for a given type and string
 */
function createTypeInfo(str: string, type: NumType): TypeInfo {
  const typeInfo: TypeInfo = { type }

  // Types that have case property
  const caseSensitiveTypes = [
    'latin_letter',
    'greek_letter',
    'cyrillic_letter',
    'roman',
    'hexadecimal',
    'english_cardinal',
    'english_words',
    'french_words',
    'astrological_sign',
    'nato_phonetic',
    'greek_letter_english_name',
  ]

  // Types that have both case and format properties
  const dateTypes = ['month_name', 'day_of_week']

  // Types that have prefix property
  const prefixTypes = ['hexadecimal', 'binary', 'octal']

  // Types that need Chinese script detection (Traditional/Simplified)
  const chineseZhstTypes = [
    'chinese_words',
    'chinese_financial',
    'chinese_solar_term',
  ]

  // Detect Chinese script type first for applicable types
  if (chineseZhstTypes.includes(type)) {
    const zhstResult = isZhTOrS(str)
    // Only set zhst for definitive results (0, 1, 2), not for mixed (-1) or invalid (undefined)
    if (zhstResult === 0 || zhstResult === 1 || zhstResult === 2) {
      typeInfo.zhst = zhstResult as ZhstType
    }
  }

  // Detect prefix first for base types
  if (prefixTypes.includes(type)) {
    typeInfo.prefix = detectPrefix(
      str,
      type as 'hexadecimal' | 'binary' | 'octal',
    )
  }

  // For case detection on prefixed base types, only look at the non-prefix part
  if (caseSensitiveTypes.includes(type) || dateTypes.includes(type)) {
    let strForCase = str
    if (prefixTypes.includes(type) && typeInfo.prefix) {
      // Remove prefix for case detection
      if (type === 'hexadecimal') {
        strForCase = str.replace(/^0[xX]/, '')
      } else if (type === 'binary') {
        strForCase = str.replace(/^0[bB]/, '')
      } else if (type === 'octal') {
        strForCase = str.replace(/^0[oO]/, '')
      }
    }
    typeInfo.case = detectCase(strForCase)
  }

  if (dateTypes.includes(type)) {
    if (type === 'month_name') {
      typeInfo.format = detectDateFormat(str, 'month')
    } else if (type === 'day_of_week') {
      typeInfo.format = detectDateFormat(str, 'day')
    }
  }

  return typeInfo
}

/**
 * Checks if a string has a specific type among all supported types in this library
 * @param str - The input string to check
 * @param targetType - The specific type to check for (e.g., 'decimal', 'roman', 'latin_letter')
 * @returns True if the string has the specified type, false otherwise
 * @example
 * ```ts
 * hasType('123', 'decimal') // returns true
 * hasType('IV', 'roman') // returns true
 * hasType('A', 'latin_letter') // returns true
 * hasType('invalid', 'roman') // returns false
 * hasType('', 'empty') // returns true
 * hasType('xyz123', 'unknown') // returns true
 * hasType(null, 'invalid') // returns true
 * ```
 */
export function hasType(str: string, targetType: NumType): boolean {
  if (typeof str !== 'string') {
    return targetType === 'invalid'
  }

  const trimmed = str.trim()
  if (trimmed === '') {
    return targetType === 'empty'
  }

  if (targetType === 'unknown') {
    for (const type of VALID_NUM_TYPES) {
      if (typeValidators[type](trimmed)) {
        return false
      }
    }
    return true
  }

  const validator = typeValidators[targetType]
  if (!validator) return false
  return validator(trimmed)
}

/**
 * Identifies all possible types of input string among all supported types in this library.
 * Returns TypeInfo objects that include the detected type along with contextual properties
 * like case (lower, upper, sentence, title) and format (short, long) when applicable.
 * @param str - The input string to identify and analyze
 * @returns An array of all possible TypeInfo objects the string could be, including detected case and format properties,
 * sorted by type priority (see {@link VALID_NUM_TYPES})
 * @example
 * ```ts
 * getTypes('123') // returns [{ type: 'decimal' }, { type: 'octal' }, { type: 'hexadecimal', case: 'lower' }]
 * getTypes('A') // returns [{ type: 'latin_letter', case: 'upper' }, { type: 'hexadecimal', case: 'upper' }]
 * getTypes('IV') // returns [{ type: 'roman', case: 'upper' }]
 * getTypes('January') // returns [{ type: 'month_name', case: 'sentence', format: 'long' }]
 * getTypes('Jan') // returns [{ type: 'month_name', case: 'sentence', format: 'short' }]
 * getTypes('Twenty-One') // returns [{ type: 'english_words', case: 'title' }]
 * getTypes('一') // returns [{ type: 'chinese_words' }]
 * getTypes('invalid-string') // returns [{ type: 'unknown' }]
 * getTypes('') // returns [{ type: 'empty' }]
 * getTypes(null) // returns [{ type: 'invalid' }]
 * ```
 */
export function getTypes(str: string): TypeInfo[] {
  if (typeof str !== 'string') {
    return [{ type: 'invalid' }]
  }

  const trimmed = str.trim()
  if (trimmed === '') {
    return [{ type: 'empty' }]
  }

  const typeInfos: TypeInfo[] = []

  for (const type of VALID_NUM_TYPES) {
    if (typeValidators[type](trimmed)) {
      typeInfos.push(createTypeInfo(trimmed, type))
    }
  }

  // If no types found, return unknown
  if (typeInfos.length === 0) {
    return [{ type: 'unknown' }]
  }

  return typeInfos
}
