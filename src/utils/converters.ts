import { toRoman, fromRoman } from '../roman'
import { toArabicNumerals, fromArabicNumerals } from '../arabic'
import { toEnglishWords, fromEnglishWords } from '../english'
import { toEnglishCardinal, fromEnglishCardinal } from '../englishCardinal'
import { toFrenchWords, fromFrenchWords } from '../french'
import { toChineseWords, fromChineseWords } from '../chinese'
import {
  toChineseHeavenlyStem,
  fromChineseHeavenlyStem,
  toChineseEarthlyBranch,
  fromChineseEarthlyBranch,
  toChineseSolarTerm,
  fromChineseSolarTerm,
  chineseWordstoFinancial,
  chineseFinancialtoWords,
} from '../chinese2'
import { toAstroSign, fromAstroSign } from '../astrosign'
import {
  toLatinLetter,
  fromLatinLetter,
  toGreekLetter,
  fromGreekLetter,
  toCyrillicLetter,
  fromCyrillicLetter,
  toNatoPhonetic,
  fromNatoPhonetic,
} from '../alphabet'
import { toMonth, fromMonth, toDayOfWeek, fromDayOfWeek } from '../datetime'
import { toBin, fromBin, toOct, fromOct, toHex, fromHex } from '../bases'
import { NumType } from './types'

// Mapping of type names to their "From" functions (string -> number)
export const typeFromFns: Record<NumType, (str: string) => number> = {
  decimal: (str) => parseFloat(str),
  binary: fromBin,
  octal: fromOct,
  hexadecimal: fromHex,
  roman: fromRoman,
  arabic: fromArabicNumerals,
  english_cardinal: fromEnglishCardinal,
  english_words: fromEnglishWords,
  french_words: fromFrenchWords,
  chinese_words: fromChineseWords,
  chinese_financial: (str) => fromChineseWords(chineseFinancialtoWords(str)),
  chinese_heavenly_stem: fromChineseHeavenlyStem,
  chinese_earthly_branch: fromChineseEarthlyBranch,
  chinese_solar_term: fromChineseSolarTerm,
  astrological_sign: fromAstroSign,
  nato_phonetic: fromNatoPhonetic,
  month_name: (str) => {
    const result = fromMonth(str)
    if (result === null) throw new Error(`Invalid month name: ${str}`)
    return result
  },
  day_of_week: (str) => {
    const result = fromDayOfWeek(str)
    if (result === null) throw new Error(`Invalid day of week: ${str}`)
    return result
  },
  latin_letter: fromLatinLetter,
  greek_letter: fromGreekLetter,
  cyrillic_letter: fromCyrillicLetter,
  // Special types that don't have conversion functions
  invalid: () => {
    throw new Error('Cannot convert invalid type')
  },
  empty: () => {
    throw new Error('Cannot convert empty type')
  },
  unknown: () => {
    throw new Error('Cannot convert unknown type')
  },
}

// Mapping of type names to their "To" functions (number -> string)
export const typeToFns: Record<NumType, (num: number) => string> = {
  decimal: (num) => num.toString(),
  binary: toBin,
  octal: toOct,
  hexadecimal: toHex,
  roman: toRoman,
  arabic: toArabicNumerals,
  english_cardinal: toEnglishCardinal,
  english_words: toEnglishWords,
  french_words: toFrenchWords,
  chinese_words: toChineseWords,
  chinese_financial: (num) => chineseWordstoFinancial(toChineseWords(num)),
  chinese_heavenly_stem: toChineseHeavenlyStem,
  chinese_earthly_branch: toChineseEarthlyBranch,
  chinese_solar_term: toChineseSolarTerm,
  astrological_sign: toAstroSign,
  nato_phonetic: toNatoPhonetic,
  month_name: toMonth,
  day_of_week: toDayOfWeek,
  latin_letter: toLatinLetter,
  greek_letter: toGreekLetter,
  cyrillic_letter: toCyrillicLetter,
  // Special types that don't have conversion functions
  invalid: () => {
    throw new Error('Cannot convert to invalid type')
  },
  empty: () => {
    throw new Error('Cannot convert to empty type')
  },
  unknown: () => {
    throw new Error('Cannot convert to unknown type')
  },
}

/**
 * Generalized function to convert a string to a number based on the specified type
 * @param str - The input string to convert
 * @param type - The type of the input string
 * @returns The converted number
 * @throws Error if the type is not supported or conversion fails
 */
export function convertFrom(str: string, type: NumType): number {
  const fromFn = typeFromFns[type]
  if (!fromFn) {
    throw new Error(`Unsupported type: ${type}`)
  }

  try {
    return fromFn(str)
  } catch (error) {
    throw new Error(
      `Failed to convert "${str}" from type "${type}": ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Generalized function to convert a number to a string based on the specified type
 * @param num - The input number to convert
 * @param type - The target type for the output string
 * @returns The converted string
 * @throws Error if the type is not supported or conversion fails
 */
export function convertTo(num: number, type: NumType): string {
  const toFn = typeToFns[type]
  if (!toFn) {
    throw new Error(`Unsupported type: ${type}`)
  }

  try {
    return toFn(num)
  } catch (error) {
    throw new Error(
      `Failed to convert ${num} to type "${type}": ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
