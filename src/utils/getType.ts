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
} from '../chinese2'
import { fromAstroSign } from '../astrosign'
import {
  fromLatinLetter,
  fromGreekLetter,
  fromCyrillicLetter,
} from '../alphabet'
import { fromMonth, fromDayOfWeek } from '../datetime'

/**
 * Identifies all possible types of input string among all supported types in this library
 * @param str - The input string to identify
 * @returns An array of all possible types the string could be
 */
export function getType(str: string): string[] {
  if (typeof str !== 'string') {
    return ['invalid']
  }

  const trimmed = str.trim()
  if (trimmed === '') {
    return ['empty']
  }

  const types: string[] = []

  // Check for regular decimal numbers first
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    types.push('decimal')
  }

  // Check for binary numbers (must be only 0s and 1s)
  if (/^[01]+$/.test(trimmed)) {
    types.push('binary')
  }

  // Check for octal numbers (must be only 0-7)
  if (/^[0-7]+$/.test(trimmed)) {
    types.push('octal')
  }

  // Check for hexadecimal numbers (must be only 0-9, a-f, A-F)
  if (/^[0-9a-fA-F]+$/.test(trimmed)) {
    types.push('hexadecimal')
  }

  // Check for Roman numerals
  try {
    fromRoman(trimmed)
    types.push('roman')
  } catch {
    // Not a valid Roman numeral
  }

  // Check for Arabic numerals
  try {
    fromArabicNumerals(trimmed)
    types.push('arabic')
  } catch {
    // Not a valid Arabic numeral
  }

  // Check for English cardinal numbers (1st, 2nd, etc.)
  try {
    fromEnglishCardinal(trimmed)
    types.push('english_cardinal')
  } catch {
    // Not a valid English cardinal
  }

  // Check for English words
  if (validateEnglishWords(trimmed)) {
    types.push('english_words')
  }

  // Check for French words
  if (validateFrenchWords(trimmed)) {
    types.push('french_words')
  }

  // Check for Chinese words
  if (validateChineseWords(trimmed)) {
    types.push('chinese_words')
  }

  // Check for Chinese financial characters
  if (/^[零壹贰叁肆伍陆柒捌玖拾佰仟万亿]+$/.test(trimmed)) {
    types.push('chinese_financial')
  }

  // Check for Chinese Heavenly Stems (天干)
  try {
    fromChineseHeavenlyStem(trimmed)
    types.push('chinese_heavenly_stem')
  } catch {
    // Not a valid Heavenly Stem
  }

  // Check for Chinese Earthly Branches (地支)
  try {
    fromChineseEarthlyBranch(trimmed)
    types.push('chinese_earthly_branch')
  } catch {
    // Not a valid Earthly Branch
  }

  // Check for Chinese Solar Terms (节气)
  try {
    fromChineseSolarTerm(trimmed)
    types.push('chinese_solar_term')
  } catch {
    // Not a valid Solar Term
  }

  // Check for Astrological signs
  try {
    fromAstroSign(trimmed)
    types.push('astrological_sign')
  } catch {
    // Not a valid astrological sign
  }

  // Check for NATO phonetic alphabet
  const natoWords = [
    'Alfa',
    'Bravo',
    'Charlie',
    'Delta',
    'Echo',
    'Foxtrot',
    'Golf',
    'Hotel',
    'India',
    'Juliett',
    'Kilo',
    'Lima',
    'Mike',
    'November',
    'Oscar',
    'Papa',
    'Quebec',
    'Romeo',
    'Sierra',
    'Tango',
    'Uniform',
    'Victor',
    'Whiskey',
    'X-ray',
    'Yankee',
    'Zulu',
  ]
  if (natoWords.includes(trimmed)) {
    types.push('nato_phonetic')
  }

  // Check for month names (English)
  const monthResult = fromMonth(trimmed)
  if (monthResult !== null) {
    types.push('month_name')
  }

  // Check for day of week names (English)
  const dayResult = fromDayOfWeek(trimmed)
  if (dayResult !== null) {
    types.push('day_of_week')
  }

  // Check for Latin letters (A-Z, a-z) - single letters only
  if (/^[A-Za-z]$/.test(trimmed)) {
    try {
      fromLatinLetter(trimmed)
      types.push('latin_letter')
    } catch {
      // Not a valid Latin letter
    }
  }

  // Check for Greek letters
  if (/^[Α-Ωα-ω]$/.test(trimmed)) {
    try {
      fromGreekLetter(trimmed)
      types.push('greek_letter')
    } catch {
      // Not a valid Greek letter
    }
  }

  // Check for Cyrillic letters
  if (/^[А-Яа-яЁё]$/.test(trimmed)) {
    try {
      fromCyrillicLetter(trimmed)
      types.push('cyrillic_letter')
    } catch {
      // Not a valid Cyrillic letter
    }
  }

  // If no types found, return unknown
  if (types.length === 0) {
    return ['unknown']
  }

  return types
}

/**
 * Checks if a string has a specific type among all supported types in this library
 * @param str - The input string to check
 * @param targetType - The specific type to check for
 * @returns True if the string has the specified type, false otherwise
 */
export function hasType(str: string, targetType: string): boolean {
  const types = getType(str)
  return types.includes(targetType)
}
