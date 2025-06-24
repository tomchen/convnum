import { capitalizeFirstLetter, fromLetter, toLetter } from './utils/letterFns'

/**
 * Converts a number to a Latin letter
 * @param num - The number to convert (must be between 1 and 26)
 * @param upperCase - Whether to return uppercase (default: false)
 * @returns The corresponding Latin letter
 * @throws Error if input is out of valid range
 */
export function toLatinLetter(num: number, upperCase: boolean = false): string {
  // a = 97, A = 65 in Unicode
  const baseCharCode = upperCase ? 65 : 97
  return toLetter(num, baseCharCode, 26)
}

/**
 * Converts a Latin letter to its corresponding number
 * @param letter - The Latin letter (must be a single letter)
 * @returns The corresponding number (1-26)
 * @throws Error if input is not a valid Latin letter
 */
export function fromLatinLetter(letter: string): number {
  return fromLetter(letter, [65, 97], 26)
}

// const lowerGreekLetters = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
// const upperGreekLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];

/**
 * Converts a number to a standard Greek letter
 * @param num - The number to convert (must be between 1 and 24)
 * @param upperCase - Whether to return uppercase (default: false)
 * @returns The corresponding standard Greek letter
 * @throws Error if input is out of valid range
 */
export function toGreekLetter(num: number, upperCase: boolean = false): string {
  // α = 945, Α = 913 in Unicode
  const baseCharCode = upperCase ? 913 : 945
  const length = 24
  if (num < 1 || num > length || !Number.isInteger(num)) {
    throw new Error(`Input must be an integer between 1 and ${length}`)
  }
  // fixed for issue caused by 'ρ' 961, 'ς' 962, 'σ' 963, 'Ρ' 929, 'Σ' 931
  const _num = num > 17 ? num + 1 : num
  return String.fromCharCode(baseCharCode + _num - 1)
}

/**
 * Converts a standard Greek letter to its corresponding number
 * @param letter - The Greek letter (final sigma ς is considered as sigma Σ/σ)
 * @returns The corresponding number (1-24)
 * @throws Error if input is not a valid standard Greek letter
 */
export function fromGreekLetter(letter: string): number {
  if (!letter || letter.length !== 1) {
    throw new Error('Input must be a single letter')
  }
  const charCode = letter.charCodeAt(0)
  // fixed for issue caused by 'ρ' 961, 'ς' 962, 'σ' 963, 'Ρ' 929, 'Σ' 931
  if (charCode >= 945 && charCode <= 962) {
    return charCode - 945 + 1
  }
  if (charCode > 962 && charCode < 945 + 25) {
    return charCode - 945
  }
  if (charCode >= 913 && charCode < 930) {
    return charCode - 913 + 1
  }
  if (charCode > 930 && charCode < 913 + 25) {
    return charCode - 913
  }
  throw new Error('Input must be a valid letter')
}

/**
 * Converts a number to a Cyrillic letter
 * @param num - The number to convert (must be between 1 and 33)
 * @param upperCase - Whether to return uppercase (default: false)
 * @returns The corresponding Cyrillic letter
 * @throws Error if input is out of valid range
 */
export function toCyrillicLetter(
  num: number,
  upperCase: boolean = false,
): string {
  // а = 1072, А = 1040 in Unicode
  const baseCharCode = upperCase ? 1040 : 1072
  const length = 33

  if (num < 1 || num > length || !Number.isInteger(num)) {
    throw new Error(`Input must be an integer between 1 and ${length}`)
  }

  if (num === 7) {
    return upperCase ? 'Ё' : 'ё'
  }

  if (num > 7) {
    // after 'Ё'/'ё'
    return String.fromCharCode(baseCharCode + num - 2)
  } else {
    return String.fromCharCode(baseCharCode + num - 1)
  }
}

/**
 * Converts a Cyrillic letter to its corresponding number
 * @param letter - The Cyrillic letter (must be a single letter)
 * @returns The corresponding number (1-33)
 * @throws Error if input is not a valid Cyrillic letter
 */
export function fromCyrillicLetter(letter: string): number {
  if (!letter || letter.length !== 1) {
    throw new Error('Input must be a single letter')
  }

  const charCode = letter.charCodeAt(0)

  // Ё || ё
  if (charCode === 1025 || charCode === 1105) {
    return 7
  }

  // uppercase (А-Я)
  if (charCode >= 1040 && charCode <= 1045) {
    return charCode - 1040 + 1
  }
  if (charCode >= 1046 && charCode <= 1071) {
    return charCode - 1040 + 2
  }

  // lowercase (а-я)
  if (charCode >= 1072 && charCode <= 1077) {
    return charCode - 1072 + 1
  }
  if (charCode >= 1078 && charCode <= 1103) {
    return charCode - 1072 + 2
  }

  throw new Error('Input must be a valid Cyrillic letter')
}

// prettier-ignore
export const natoAlphabet = [
  'Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu',
]

/**
 * Converts a number to NATO phonetic alphabet word (ICAO spellings)
 * @param num - The number to convert (must be between 1 and 26)
 * @returns The corresponding NATO phonetic alphabet word
 * @throws Error if input is out of valid range
 */
export function toNatoPhonetic(num: number): string {
  if (num < 1 || num > 26 || !Number.isInteger(num)) {
    throw new Error('Input must be an integer between 1 and 26')
  }
  return natoAlphabet[num - 1]
}

/**
 * Converts a NATO phonetic alphabet word (ICAO spellings) to its corresponding number
 * @param word - The NATO phonetic alphabet word
 * @returns The corresponding number (1-26)
 * @throws Error if input is not a valid NATO phonetic alphabet word
 */
export function fromNatoPhonetic(word: string): number {
  // Handle aliases
  const normalizedWord = capitalizeFirstLetter(word)
    .replace(/^Alpha$/i, 'Alfa')
    .replace(/^Juliet$/i, 'Juliett')
    .replace(/^Xray$/i, 'X-ray')

  const index = natoAlphabet.indexOf(normalizedWord)
  if (index === -1) {
    throw new Error('Input must be a valid NATO phonetic alphabet word')
  }
  return index + 1
}
