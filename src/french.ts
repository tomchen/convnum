/**
 * Converts a number to French words
 * @param num - The number to convert
 * @returns The French word representation
 */
export function toFrenchWords(num: number): string {
  if (!Number.isFinite(num)) {
    throw new Error('Input must be a finite number')
  }

  if (num === 0) return 'zéro'

  const isNegative = num < 0
  num = Math.abs(num)

  // prettier-ignore
  const units = [
    '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
    'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf',
  ]
  // prettier-ignore
  const tens = [
    '', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix',
  ]

  function convertLessThanOneThousand(n: number): string {
    if (n < 20) {
      return units[n]
    }

    const digit = n % 10
    if (n < 70) {
      if (digit === 1) {
        return tens[Math.floor(n / 10)] + '-et-' + units[digit]
      }
      return tens[Math.floor(n / 10)] + (digit > 0 ? '-' + units[digit] : '')
    }

    if (n < 80) {
      if (digit === 1) {
        return 'soixante-et-' + units[10 + digit]
      }
      return 'soixante' + (digit > 0 ? '-' + units[10 + digit] : '-dix')
    }

    if (n < 90) {
      return 'quatre-vingt' + (digit > 0 ? '-' + units[digit] : 's')
    }

    return 'quatre-vingt' + (digit > 0 ? '-' + units[10 + digit] : '-dix')
  }

  function convert(n: number): string {
    if (n < 100) {
      return convertLessThanOneThousand(n)
    }

    if (n < 1000) {
      const hundreds = Math.floor(n / 100)
      const remainder = n % 100

      if (hundreds === 1) {
        return (
          'cent' +
          (remainder > 0 ? ' ' + convertLessThanOneThousand(remainder) : '')
        )
      } else {
        return (
          units[hundreds] +
          ' cent' +
          (remainder > 0 ? ' ' + convertLessThanOneThousand(remainder) : 's')
        )
      }
    }

    if (n < 1000000) {
      const thousands = Math.floor(n / 1000)
      const remainder = n % 1000

      if (thousands === 1) {
        return 'mille' + (remainder > 0 ? ' ' + convert(remainder) : '')
      } else {
        return (
          convert(thousands) +
          ' mille' +
          (remainder > 0 ? ' ' + convert(remainder) : '')
        )
      }
    }

    if (n < 1000000000) {
      const millions = Math.floor(n / 1000000)
      const remainder = n % 1000000

      if (millions === 1) {
        return 'un million' + (remainder > 0 ? ' ' + convert(remainder) : '')
      } else {
        return (
          convert(millions) +
          ' millions' +
          (remainder > 0 ? ' ' + convert(remainder) : '')
        )
      }
    }

    const billions = Math.floor(n / 1000000000)
    const remainder = n % 1000000000

    if (billions === 1) {
      return 'un milliard' + (remainder > 0 ? ' ' + convert(remainder) : '')
    } else {
      return (
        convert(billions) +
        ' milliards' +
        (remainder > 0 ? ' ' + convert(remainder) : '')
      )
    }
  }

  return (isNegative ? 'moins ' : '') + convert(num)
}

// Dictionary of French number words
// prettier-ignore
const numberMap: Record<string, number> = {
  zéro: 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10,
  onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16, 'dix-sept': 17, 'dix-huit': 18, 'dix-neuf': 19,
  vingt: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60, 'quatre-vingts': 80, 'quatre-vingt': 80,
  cent: 100, cents: 100, mille: 1000, million: 1000000, millions: 1000000, milliard: 1000000000, milliards: 1000000000
};

/**
 * Converts French words to a number
 * @param words - The French words representing a number
 * @returns The numeric value
 * @throws Error if input is not valid French number words
 */
export function fromFrenchWords(words: string): number {
  // Sanitize input
  words = words.toLowerCase().trim()

  // Handle negative numbers
  if (words.startsWith('moins ')) {
    return -fromFrenchWords(words.substring(6))
  }

  // Handle special cases for 70s and 90s
  if (words === 'soixante-dix') return 70
  if (words === 'quatre-vingt-dix') return 90

  // Handle compound numbers
  let result = 0
  let currentSum = 0

  // Split the input by spaces to separate number groups
  const parts = words.split(' ')

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]

    // Handle hyphenated numbers
    if (part.includes('-')) {
      const hyphenatedParts = part.split('-')

      // Special case for soixante-et-onze (71) and similar constructions
      if (hyphenatedParts.includes('et')) {
        const baseIndex = hyphenatedParts.indexOf('et') - 1
        const base = numberMap[hyphenatedParts[baseIndex]]
        const addition = numberMap[hyphenatedParts[baseIndex + 2]]
        currentSum += base + addition
        continue
      }

      // Special case for soixante-dix-neuf (79) and similar
      if (hyphenatedParts[0] === 'soixante' && hyphenatedParts[1] === 'dix') {
        currentSum += 70
        if (hyphenatedParts.length > 2) {
          currentSum += numberMap[hyphenatedParts[2]]
        }
        continue
      }

      // Special case for quatre-vingt-dix-neuf (99) and similar
      if (
        hyphenatedParts[0] === 'quatre' &&
        hyphenatedParts[1] === 'vingt' &&
        hyphenatedParts[2] === 'dix'
      ) {
        currentSum += 90
        if (hyphenatedParts.length > 3) {
          currentSum += numberMap[hyphenatedParts[3]]
        }
        continue
      }

      // Handle quatre-vingts directly (80)
      if (part === 'quatre-vingts') {
        currentSum += 80
        continue
      }

      // Regular hyphenated numbers like vingt-deux (22)
      if (hyphenatedParts[0] === 'quatre' && hyphenatedParts[1] === 'vingt') {
        // Special case for 80s
        if (hyphenatedParts.length > 2) {
          currentSum += 80 + numberMap[hyphenatedParts[2]]
        } else {
          currentSum += 80
        }
      } else {
        let hyphenatedSum = 0
        for (const hPart of hyphenatedParts) {
          if (hPart !== 'et') {
            hyphenatedSum += numberMap[hPart] || 0
          }
        }
        currentSum += hyphenatedSum
      }
      continue
    }

    // Get the numeric value of the current part
    const value = numberMap[part]

    // Handle large multipliers (hundred, thousand, million, billion)
    if (value === 100) {
      // Special case for "cent" vs "cents"
      if (currentSum === 0) currentSum = 1
      currentSum *= 100
    } else if (value >= 1000) {
      // For thousand, million, billion: multiply the current sum and reset
      if (currentSum === 0) currentSum = 1
      result += currentSum * value
      currentSum = 0
    } else if (value !== undefined) {
      // Regular numbers: just add to the current sum
      currentSum += value
    }
  }

  // Add any remaining value
  result += currentSum

  return result === 0 && words !== 'zéro' ? NaN : result
}

/**
 * Validates if a string is a strictly valid French number word representation
 * by converting it to a number and back to words to check for consistency
 * @param words - The French words to validate
 * @returns true if the words are valid, false otherwise
 */
export function validateFrenchWords(words: string): boolean {
  try {
    const num = fromFrenchWords(words)
    const convertedBack = toFrenchWords(num)
    return words.toLowerCase() === convertedBack
  } catch {
    return false
  }
}
