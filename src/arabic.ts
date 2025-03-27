import { reverseKeyValue } from './utils/reverseKeyValue'

const digitMap: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
  '-': '-',
  '.': '.',
}

/**
 * Converts a number to Arabic numerals
 * @param num - The number to convert
 * @returns The Arabic numeral representation
 */
export function toArabicNumerals(num: number): string {
  if (!Number.isFinite(num)) {
    throw new Error('Input must be a finite number')
  }

  const numStr = num.toString()

  let result = ''
  for (const char of numStr) {
    result += digitMap[char] || char
  }

  return result
}

/**
 * Converts Arabic numerals to a number
 * @param numerals - The Arabic numerals
 * @returns The numeric value
 * @throws Error if input contains invalid characters
 */
export function fromArabicNumerals(numerals: string): number {
  const reverseDigitMap = reverseKeyValue(digitMap)

  let result = ''
  for (const char of numerals) {
    if (reverseDigitMap[char] !== undefined) {
      result += reverseDigitMap[char]
    } else {
      throw new Error(`Invalid character in number: "${char}"`)
    }
  }

  const ret = parseFloat(result)

  if (isNaN(ret)) {
    throw new Error('Invalid number')
  }

  return ret
}
