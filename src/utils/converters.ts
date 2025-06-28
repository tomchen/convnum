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
  fromHebrewLetter,
  fromGreekLetterEnglishName,
  toGreekLetterEnglishName,
  toHebrewLetter,
} from '../alphabet'
import { toMonth, fromMonth, toDayOfWeek, fromDayOfWeek } from '../datetime'
import { toBin, fromBin, toOct, fromOct, toHex, fromHex } from '../bases'
import { NumType, TypeInfo } from './types'
import { numeralLength, toBasicRange } from './circular'

/**
 * Applies case transformation to a string based on the specified case type
 */
function applyCase(
  str: string,
  caseType?: 'sentence' | 'title' | 'lower' | 'upper',
): string {
  if (!caseType) {
    return str
  }

  switch (caseType) {
    case 'lower':
      return str.toLowerCase()
    case 'upper':
      return str.toUpperCase()
    case 'sentence':
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    case 'title':
      return str
        .split(/(\s+|-+)/)
        .map((part) =>
          /^[\s-]+$/.test(part)
            ? part
            : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .join('')
    default:
      return str
  }
}

/**
 * Mapping of type names to their "From" functions that convert strings to numbers.
 * Each function takes a string representation and returns the corresponding numeric value.
 * Used internally by convertFrom() but exported for direct access to specific converters.
 * @example
 * ```ts
 * typeFromFns.decimal('123') // returns 123
 * typeFromFns.roman('IV') // returns 4
 * typeFromFns.latin_letter('A') // returns 1
 * typeFromFns.hexadecimal('FF') // returns 255
 * ```
 */
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
    if (result === null) {
      throw new Error(`Invalid month name: ${str}`)
    }
    return result
  },
  day_of_week: (str) => {
    const result = fromDayOfWeek(str)
    if (result === null) {
      throw new Error(`Invalid day of week: ${str}`)
    }
    return result
  },
  latin_letter: fromLatinLetter,
  greek_letter: fromGreekLetter,
  greek_letter_english_name: fromGreekLetterEnglishName,
  cyrillic_letter: fromCyrillicLetter,
  hebrew_letter: fromHebrewLetter,
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

/**
 * Mapping of type names to their "To" functions that convert numbers to strings.
 * Each function takes a number and optional TypeInfo for formatting, returning the string representation.
 * Supports case and format transformations when TypeInfo is provided.
 * Used internally by convertTo() but exported for direct access to specific converters.
 * @example
 * ```ts
 * typeToFns.decimal(123) // returns '123'
 * typeToFns.roman(4) // returns 'IV'
 * typeToFns.roman(4, { case: 'lower' }) // returns 'iv'
 * typeToFns.latin_letter(1, { case: 'lower' }) // returns 'a'
 * typeToFns.hexadecimal(255, { case: 'lower' }) // returns 'ff'
 * typeToFns.month_name(1, { case: 'upper', format: 'short' }) // returns 'JAN'
 * ```
 */
export const typeToFns: Record<
  NumType,
  (num: number, typeInfo?: TypeInfo) => string
> = {
  decimal: (num) => num.toString(),
  binary: (num, typeInfo) => {
    const result = toBin(num, typeInfo?.prefix || false)
    return result
  },
  octal: (num, typeInfo) => {
    const result = toOct(num, typeInfo?.prefix || false)
    return result
  },
  hexadecimal: (num, typeInfo) => {
    let result = toHex(num, typeInfo?.prefix || false)

    // Apply case to the hex digits only (not the prefix)
    if (typeInfo?.case && typeInfo?.prefix) {
      const prefixPart = typeInfo.prefix === 'lower' ? '0x' : '0X'
      const hexPart = result.replace(/^0[xX]/, '')
      const casedHexPart = applyCase(hexPart, typeInfo.case)
      result = prefixPart + casedHexPart
    } else if (typeInfo?.case) {
      result = applyCase(result, typeInfo.case)
    }

    return result
  },
  roman: (num, typeInfo) => {
    const result = toRoman(num)
    return applyCase(result, typeInfo?.case)
  },
  arabic: (num) => toArabicNumerals(num),
  english_cardinal: (num, typeInfo) => {
    const result = toEnglishCardinal(num)
    return applyCase(result, typeInfo?.case)
  },
  english_words: (num, typeInfo) => {
    const result = toEnglishWords(num)
    return applyCase(result, typeInfo?.case)
  },
  french_words: (num, typeInfo) => {
    const result = toFrenchWords(num)
    return applyCase(result, typeInfo?.case)
  },
  chinese_words: (num, typeInfo) => {
    return toChineseWords(num, typeInfo?.zhst === 1)
  },
  chinese_financial: (num, typeInfo) => {
    return chineseWordstoFinancial(toChineseWords(num), typeInfo?.zhst === 1)
  },
  chinese_heavenly_stem: (num) => toChineseHeavenlyStem(num),
  chinese_earthly_branch: (num) => toChineseEarthlyBranch(num),
  chinese_solar_term: (num, typeInfo) => {
    return toChineseSolarTerm(num, undefined, typeInfo?.zhst === 1)
  },
  astrological_sign: (num, typeInfo) => {
    const result = toAstroSign(num)
    return applyCase(result, typeInfo?.case)
  },
  nato_phonetic: (num, typeInfo) => {
    const result = toNatoPhonetic(num)
    return applyCase(result, typeInfo?.case)
  },
  month_name: (num, typeInfo) => {
    const format = typeInfo?.format || 'long'
    const result = toMonth(num, 'en-US', format)
    return applyCase(result, typeInfo?.case)
  },
  day_of_week: (num, typeInfo) => {
    const format = typeInfo?.format || 'long'
    const result = toDayOfWeek(num, 'en-US', format)
    return applyCase(result, typeInfo?.case)
  },
  latin_letter: (num, typeInfo) => {
    const upperCase = typeInfo?.case === 'upper'
    return toLatinLetter(num, upperCase)
  },
  greek_letter: (num, typeInfo) => {
    const upperCase = typeInfo?.case === 'upper'
    return toGreekLetter(num, upperCase)
  },
  greek_letter_english_name: (num, typeInfo) => {
    const result = toGreekLetterEnglishName(num)
    return applyCase(result, typeInfo?.case)
  },
  cyrillic_letter: (num, typeInfo) => {
    const upperCase = typeInfo?.case === 'upper'
    return toCyrillicLetter(num, upperCase)
  },
  hebrew_letter: (num, typeInfo) => {
    const result = toHebrewLetter(num)
    return applyCase(result, typeInfo?.case)
  },
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
 * Generalized function to convert a string to a number based on the specified type.
 * Supports all number formats including decimal, binary, octal, hexadecimal, Roman numerals,
 * English/French words, Chinese characters, letters, and more. Case and format properties
 * in TypeInfo are ignored during parsing (they're used for output formatting).
 * For Chinese types, Traditional Chinese input is automatically converted to Simplified
 * before processing, as the internal conversion functions work with Simplified Chinese.
 * @param str - The input string to convert (e.g., 'IV', 'twenty-one', '一百二十三', '萬億')
 * @param typeInfo - The type information specifying how to interpret the string
 * @returns The converted number
 * @throws Error if the type is not supported or conversion fails
 * @example
 * ```ts
 * convertFrom('123', { type: 'decimal' }) // returns 123
 * convertFrom('IV', { type: 'roman' }) // returns 4
 * convertFrom('twenty-one', { type: 'english_words' }) // returns 21
 * convertFrom('A', { type: 'latin_letter' }) // returns 1
 * convertFrom('FF', { type: 'hexadecimal' }) // returns 255
 * convertFrom('January', { type: 'month_name' }) // returns 1
 * convertFrom('一百二十三', { type: 'chinese_words' }) // returns 123
 * convertFrom('萬億', { type: 'chinese_words' }) // returns 10000000000000 (Traditional converted to Simplified first)
 * convertFrom('Aries', { type: 'astrological_sign' }) // returns 1
 * ```
 */
export function convertFrom(str: string, typeInfo: TypeInfo): number {
  const fromFn = typeFromFns[typeInfo.type]
  if (!fromFn) {
    throw new Error(`Unsupported type: ${typeInfo.type}`)
  }

  try {
    return fromFn(str)
  } catch (error) {
    throw new Error(
      `Failed to convert "${str}" from type "${typeInfo.type}": ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Generalized function to convert a number to a string based on the specified type.
 * Supports precise control over output formatting through case and format properties.
 * Case options: 'lower', 'upper', 'sentence' (first letter capitalized), 'title' (each word capitalized).
 * Format options: 'short' or 'long' for dates/months.
 * For Chinese types, supports Traditional/Simplified script conversion via zhst property:
 * - zhst: 0 = output Simplified Chinese (default)
 * - zhst: 1 = output Traditional Chinese (converted from Simplified)
 * - zhst: 2 = output Simplified Chinese (ambiguous, defaults to Simplified)
 *
 * @param num - The input number to convert (e.g., 4, 21, 123)
 * @param typeInfo - The target type information including type, case, format, and zhst specifications
 * @returns The converted string formatted according to the specified case, format, and Chinese script
 * @throws Error if the type is not supported or conversion fails
 *
 * @remarks For circular numeral types (all types present in numeralLength: latin_letter, greek_letter,
 * month_name, astrological_sign, etc.), automatically handles out-of-range numbers by wrapping them
 * using circular arithmetic. The circular handling is included in `convertTo()`,
 * some specific `toAbc()` functions include it too but many don't
 *
 * @example
 * ```ts
 * convertTo(4, { type: 'roman', case: 'upper' }) // returns 'IV'
 * convertTo(4, { type: 'roman', case: 'lower' }) // returns 'iv'
 * convertTo(21, { type: 'english_words', case: 'title' }) // returns 'Twenty-One'
 * convertTo(21, { type: 'english_words', case: 'upper' }) // returns 'TWENTY-ONE'
 * convertTo(1, { type: 'latin_letter', case: 'lower' }) // returns 'a'
 * convertTo(27, { type: 'latin_letter', case: 'lower' }) // returns 'a' (wraps around)
 * convertTo(255, { type: 'hexadecimal', case: 'upper' }) // returns 'FF'
 * convertTo(1, { type: 'month_name', case: 'sentence', format: 'long' }) // returns 'January'
 * convertTo(1, { type: 'month_name', case: 'upper', format: 'short' }) // returns 'JAN'
 * convertTo(13, { type: 'month_name', case: 'upper', format: 'short' }) // returns 'JAN' (wraps to January)
 * convertTo(123, { type: 'chinese_words' }) // returns '一百二十三' (Simplified)
 * convertTo(123, { type: 'chinese_words', zhst: 1 }) // returns '一百二十三' (Traditional, same in this case)
 * convertTo(10000000000000, { type: 'chinese_words', zhst: 1 }) // returns '萬億' (Traditional)
 * convertTo(1, { type: 'astrological_sign', case: 'lower' }) // returns 'aries'
 * convertTo(13, { type: 'astrological_sign', case: 'lower' }) // returns 'aries' (wraps around)
 * convertTo(7, { type: 'day_of_week', case: 'lower' }) // returns 'sunday' (wraps around)
 * ```
 */
export function convertTo(num: number, typeInfo: TypeInfo): string {
  const toFn = typeToFns[typeInfo.type]
  if (!toFn) {
    throw new Error(`Unsupported type: ${typeInfo.type}`)
  }

  try {
    // Check if this is a circular numeral type and handle out-of-range values
    if (numeralLength[typeInfo.type] !== undefined) {
      // Special cases for types that have specific requirements
      if (typeInfo.type === 'day_of_week') {
        // Day of week uses 0-based indexing (0-6), need special handling
        if (num >= 0 && num <= 6) {
          // Already in valid range
          return toFn(num, typeInfo)
        } else {
          // Wrap using modular arithmetic for 0-6 range
          const wrappedNum = ((num % 7) + 7) % 7
          return toFn(wrappedNum, typeInfo)
        }
      } else {
        // For other circular numerals, wrap the number to the valid range
        const wrappedNum = toBasicRange(num, typeInfo.type)
        return toFn(wrappedNum, typeInfo)
      }
    } else {
      // For non-circular types, use the number as-is
      return toFn(num, typeInfo)
    }
  } catch (error) {
    throw new Error(
      `Failed to convert ${num} to type "${typeInfo.type}": ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
