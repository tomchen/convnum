/**
 * Converts a number to its cardinal form in English (e.g., 1 -> "1st", 2 -> "2nd")
 * @param num - The number to convert
 * @returns The cardinal form of the number
 * @throws Error if input is not a finite number
 * @note Can handle negative numbers and zero
 */
export function toEnglishCardinal(num: number): string {
  if (!Number.isFinite(num)) {
    throw new Error('Input must be a finite number')
  }

  const isNegative = num < 0
  const absNum = Math.abs(num)
  const numStr = absNum.toString()

  // Special cases for numbers ending in 11, 12, 13
  if (absNum % 100 >= 11 && absNum % 100 <= 13) {
    return (isNegative ? '-' : '') + numStr + 'th'
  }

  // Regular cases
  const lastDigit = absNum % 10
  const suffix = lastDigit === 1 ? 'st' :
                 lastDigit === 2 ? 'nd' :
                 lastDigit === 3 ? 'rd' : 'th'

  return (isNegative ? '-' : '') + numStr + suffix
}

/**
 * Converts an English cardinal number to its numeric value
 * @param cardinal - The cardinal number (e.g., "1st", "2nd")
 * @returns The numeric value
 * @throws Error if input is not a valid English cardinal number
 * @note Can handle negative numbers and zero
 */
export function fromEnglishCardinal(cardinal: string): number {
  // Sanitize input
  cardinal = cardinal.trim()

  // Handle negative numbers
  const isNegative = cardinal.startsWith('-')
  if (isNegative) {
    cardinal = cardinal.substring(1)
  }

  // Extract numeric part and suffix
  const numStr = cardinal.slice(0, -2)
  const suffix = cardinal.slice(-2)
  const num = parseInt(numStr, 10)

  if (isNaN(num)) {
    throw new Error('Invalid cardinal number')
  }

  // Special cases for numbers ending in 11, 12, 13
  if (num % 100 >= 11 && num % 100 <= 13) {
    if (suffix !== 'th') {
      throw new Error('Invalid cardinal number')
    }
    return isNegative ? -num : num
  }

  // Regular cases
  const lastDigit = num % 10
  const expectedSuffix = lastDigit === 1 ? 'st' :
                        lastDigit === 2 ? 'nd' :
                        lastDigit === 3 ? 'rd' : 'th'

  if (suffix !== expectedSuffix) {
    throw new Error('Invalid cardinal number')
  }

  return isNegative ? -num : num
}
