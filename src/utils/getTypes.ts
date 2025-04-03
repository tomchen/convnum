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
import { capitalizeFirstLetter } from './letterFns'
import { NumType, VALID_NUM_TYPES } from './types'

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

export const typeValidators: Record<NumType, (str: string) => boolean> = {
  decimal: (str) => /^-?\d+(\.\d+)?$/.test(str),
  binary: (str) => /^[01]+$/.test(str),
  octal: (str) => /^[0-7]+$/.test(str),
  hexadecimal: (str) => /^[0-9a-fA-F]+$/.test(str),
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
  english_words: (str) => validateEnglishWords(str),
  french_words: (str) => validateFrenchWords(str),
  chinese_words: (str) => validateChineseWords(str),
  chinese_financial: (str) => /^[零壹贰叁肆伍陆柒捌玖拾佰仟万亿]+$/.test(str),
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
    return natoWords.includes(normalizedWord)
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
  // Special types
  invalid: () => false,
  empty: () => false,
  unknown: () => false,
}

/**
 * Checks if a string has a specific type among all supported types in this library
 * @param str - The input string to check
 * @param targetType - The specific type to check for
 * @returns True if the string has the specified type, false otherwise
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
 * Identifies all possible types of input string among all supported types in this library
 * @param str - The input string to identify
 * @returns An array of all possible types the string could be
 */
export function getTypes(str: string): NumType[] {
  if (typeof str !== 'string') {
    return ['invalid']
  }

  const trimmed = str.trim()
  if (trimmed === '') {
    return ['empty']
  }

  const types: NumType[] = []

  for (const type of VALID_NUM_TYPES) {
    if (typeValidators[type](trimmed)) {
      types.push(type)
    }
  }

  // If no types found, return unknown
  if (types.length === 0) {
    return ['unknown']
  }

  return types
}
