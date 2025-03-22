/**
 * Converts a number to English words
 * @param num - The number to convert
 * @returns The English word representation
 */
export function toEnglishWords(num: number): string {
  if (!Number.isFinite(num)) {
    throw new Error('Input must be a finite number')
  }

  if (num === 0) return 'zero'

  const isNegative = num < 0
  num = Math.abs(num)

  // prettier-ignore
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
                'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
                'seventeen', 'eighteen', 'nineteen'];

  // prettier-ignore
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const words: string[] = []

  function processBelowThousand(n: number): string {
    if (n === 0) return ''
    else if (n < 20) return ones[n]
    else if (n < 100) {
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ones[n % 10] : '')
    } else {
      return (
        ones[Math.floor(n / 100)] +
        ' hundred' +
        (n % 100 !== 0 ? ' ' + processBelowThousand(n % 100) : '')
      )
    }
  }

  // prettier-ignore
  const chunks = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];

  // Process in chunks of 3 digits
  let i = 0
  while (num > 0) {
    const chunk = num % 1000
    if (chunk !== 0) {
      const chunkText = processBelowThousand(chunk)
      words.unshift(chunkText + (i > 0 ? ' ' + chunks[i] : ''))
    }
    num = Math.floor(num / 1000)
    i++
  }

  return (isNegative ? 'negative ' : '') + words.join(' ')
}

/**
 * Converts English words to a number
 * @param words - The English words representing a number
 * @returns The numeric value
 * @throws Error if input is not valid English number words
 */
export function fromEnglishWords(words: string): number {
  words = words
    .toLowerCase()
    .replace(/\band\b/g, '')
    .replace(/[-,]/g, ' ')
    .trim()

  if (words === 'zero') return 0

  let isNegative = false
  if (words.startsWith('negative ')) {
    isNegative = true
    words = words.substring(9).trim()
  }

  // prettier-ignore
  const valueMap: Record<string, number> = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000, 'million': 1000000,
    'billion': 1000000000, 'trillion': 1000000000000,
    'quadrillion': 1000000000000000, 'quintillion': 1000000000000000000
  };

  const wordList = words.split(/\s+/)
  let result = 0
  let currentSum = 0

  for (let i = 0; i < wordList.length; i++) {
    const word = wordList[i]
    const value = valueMap[word]

    if (value === undefined) {
      throw new Error(`Invalid word in number: "${word}"`)
    }

    if (value >= 1000) {
      // For thousand, million, etc.
      result += currentSum * value
      currentSum = 0
    } else if (value === 100) {
      // For hundred
      currentSum = currentSum * value
    } else {
      // For numbers below 100
      currentSum += value
    }
  }

  result += currentSum
  return isNegative ? -result : result
}

/**
 * Validates if a string is a valid English number word representation
 * by converting it to a number and back to words to check for consistency
 * @param words - The English words to validate
 * @returns true if the words are valid, false otherwise
 */
export function validateEnglishWords(words: string): boolean {
  try {
    const num = fromEnglishWords(words)
    const convertedBack = toEnglishWords(num)
    return words.toLowerCase() === convertedBack
  } catch {
    return false
  }
}
