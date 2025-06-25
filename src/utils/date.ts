/**
 * Supported separators for date strings
 */
const SEPARATORS = ['-', '.', '/', ',', ', '] as const

/**
 * Month format types and their patterns
 */
const MONTH_FORMATS = {
  M2: {
    pattern: /^(0[1-9]|1[0-2])$/,
    min: 1,
    max: 12,
    requireZeroPadded: true,
  }, // 01-12 (zero-padded)
  M1: { pattern: /^([1-9]|1[0-2])$/, min: 1, max: 12, excludeZeroPadded: true }, // 1-12 (no padding)
  Mf: { pattern: /^([A-Z][a-z]{3,})$/ }, // January (4+ letters after capital)
  Mfl: { pattern: /^([a-z]{4,})$/ }, // january (4+ lowercase letters)
  Mfu: { pattern: /^([A-Z]{4,})$/ }, // JANUARY (4+ uppercase letters)
  Ms: { pattern: /^([A-Z][a-z]{2})$/ }, // Jan (exactly 3 letters, starting with capital)
  Msl: { pattern: /^([a-z]{3})$/ }, // jan (exactly 3 lowercase)
  Msu: { pattern: /^([A-Z]{3})$/ }, // JAN (exactly 3 uppercase)
} as const

/**
 * Day format types and their patterns
 */
const DAY_FORMATS = {
  D2: {
    pattern: /^(0[1-9]|[1-2][0-9]|3[01])$/,
    min: 1,
    max: 31,
    requireZeroPadded: true,
  }, // 01-31 (zero-padded only)
  D1: {
    pattern: /^([1-9]|1[0-9]|2[0-9]|3[01])$/,
    min: 1,
    max: 31,
    excludeZeroPadded: true,
  }, // 1-31 (no zero padding)
} as const

/**
 * Year format pattern
 */
const YEAR_PATTERN = /^(\d{4})$/

/**
 * Month names for conversion
 */
const MONTH_NAMES = {
  full: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  short: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
}

/**
 * Individual interpretation of a date string
 */
export interface DateInterpretation {
  /** Unix timestamp in milliseconds for this interpretation */
  timestamp: number
  /** Format string for this interpretation (e.g., "Y-M2-D2") */
  format: string
}

/**
 * Result of date string parsing containing all possible interpretations
 */
export type ParseDateResult = DateInterpretation[]

/**
 * Converts a month name to month number (1-12)
 */
function monthNameToNumber(monthStr: string): number | null {
  const lowerMonth = monthStr.toLowerCase()

  // Check full month names
  const fullIndex = MONTH_NAMES.full.findIndex(
    (name) => name.toLowerCase() === lowerMonth,
  )
  if (fullIndex !== -1) return fullIndex + 1

  // Check short month names
  const shortIndex = MONTH_NAMES.short.findIndex(
    (name) => name.toLowerCase() === lowerMonth,
  )
  if (shortIndex !== -1) return shortIndex + 1

  return null
}

/**
 * Converts month number to formatted month string
 */
function numberToMonthName(monthNum: number, format: string): string {
  const monthIndex = monthNum - 1

  switch (format) {
    case 'M1':
      return monthNum.toString()
    case 'M2':
      return monthNum.toString().padStart(2, '0')
    case 'Mf':
      return MONTH_NAMES.full[monthIndex]
    case 'Mfl':
      return MONTH_NAMES.full[monthIndex].toLowerCase()
    case 'Mfu':
      return MONTH_NAMES.full[monthIndex].toUpperCase()
    case 'Ms':
      return MONTH_NAMES.short[monthIndex]
    case 'Msl':
      return MONTH_NAMES.short[monthIndex].toLowerCase()
    case 'Msu':
      return MONTH_NAMES.short[monthIndex].toUpperCase()
    default:
      return monthNum.toString()
  }
}

type DateComponent = { type: 'Y' | 'M' | 'D'; value: number; format: string }

/**
 * Gets all possible interpretations for a date component
 */
function getAllPossibleComponents(component: string): DateComponent[] {
  const results: DateComponent[] = []

  // Check if it's a year
  if (YEAR_PATTERN.test(component)) {
    results.push({ type: 'Y', value: parseInt(component, 10), format: 'Y' })
  }

  // Check month formats (order matters: check more specific patterns first)
  const monthFormats: Array<{
    key: string
    info: (typeof MONTH_FORMATS)[keyof typeof MONTH_FORMATS]
  }> = [
    { key: 'M2', info: MONTH_FORMATS.M2 }, // Check zero-padded first
    { key: 'M1', info: MONTH_FORMATS.M1 }, // Then non-padded
    { key: 'Mf', info: MONTH_FORMATS.Mf },
    { key: 'Mfl', info: MONTH_FORMATS.Mfl },
    { key: 'Mfu', info: MONTH_FORMATS.Mfu },
    { key: 'Ms', info: MONTH_FORMATS.Ms },
    { key: 'Msl', info: MONTH_FORMATS.Msl },
    { key: 'Msu', info: MONTH_FORMATS.Msu },
  ]

  for (const { key: formatKey, info: formatInfo } of monthFormats) {
    if (formatInfo.pattern.test(component)) {
      let value: number

      if ('min' in formatInfo) {
        // Numeric month
        value = parseInt(component, 10)
        if (value < formatInfo.min || value > formatInfo.max) continue

        // Special check for M1: exclude zero-padded numbers
        if ('excludeZeroPadded' in formatInfo && formatInfo.excludeZeroPadded) {
          if (component.length >= 2 && component[0] === '0') continue
        }

        // Special check for M2: require zero-padded for two-digit numbers
        if ('requireZeroPadded' in formatInfo && formatInfo.requireZeroPadded) {
          if (component.length >= 2 && component[0] !== '0') continue
        }
      } else {
        // Named month
        const monthValue = monthNameToNumber(component)
        if (monthValue === null) continue
        value = monthValue
      }

      results.push({ type: 'M', value, format: formatKey })
    }
  }

  // Check day formats (order matters: check more specific patterns first)
  const dayFormats: Array<{
    key: string
    info: (typeof DAY_FORMATS)[keyof typeof DAY_FORMATS]
  }> = [
    { key: 'D2', info: DAY_FORMATS.D2 }, // Check zero-padded first
    { key: 'D1', info: DAY_FORMATS.D1 }, // Then non-padded
  ]

  for (const { key: formatKey, info: formatInfo } of dayFormats) {
    if (formatInfo.pattern.test(component)) {
      const value = parseInt(component, 10)
      if (value < formatInfo.min || value > formatInfo.max) continue

      // Special check for D1: exclude zero-padded numbers
      if ('excludeZeroPadded' in formatInfo && formatInfo.excludeZeroPadded) {
        if (component.length >= 2 && component[0] === '0') continue
      }

      // Special check for D2: require zero-padded for two-digit numbers
      if ('requireZeroPadded' in formatInfo && formatInfo.requireZeroPadded) {
        if (component.length >= 2 && component[0] !== '0') continue
      }

      results.push({ type: 'D', value, format: formatKey })
    }
  }

  return results
}

/**
 * Generates all possible combinations from arrays of possibilities
 */
function generateAllCombinations(arrays: DateComponent[][]): DateComponent[][] {
  if (arrays.length === 0) return []
  if (arrays.length === 1) return arrays[0].map((item) => [item])

  const result: DateComponent[][] = []
  const restCombinations = generateAllCombinations(arrays.slice(1))

  for (const firstItem of arrays[0]) {
    for (const restCombination of restCombinations) {
      result.push([firstItem, ...restCombination])
    }
  }

  return result
}

/**
 * Parses a date string and returns all possible interpretations with their corresponding timestamps.
 * Each ambiguous date string may have multiple valid interpretations, each with its own timestamp.
 * Supports various date formats including Y-M-D, D-M-Y, M-D-Y, Y-M, M-Y, M-D, D-M.
 * Separators can be "-", ".", "/", ",", or ", ".
 *
 * Default values:
 * - Y-M format: day defaults to 1
 * - Y-M-D format: time defaults to 00:00:00.000
 * - M-D format: year defaults to 1970
 *
 * @param dateStr - The date string to parse (e.g., "2023-01-05", "25.12.2023", "Jan 15, 2023")
 * @returns Array of all possible interpretations, each with timestamp and format
 * @throws Error if the date string format is not recognized or invalid
 *
 * @example
 * ```ts
 * parseDateString('2023-01-05')
 * // [
 * //   { timestamp: 1672876800000, format: 'Y-M2-D2' },  // Jan 5, 2023
 * //   { timestamp: 1683763200000, format: 'Y-D2-M2' }   // May 1, 2023
 * // ]
 *
 * parseDateString('25.12.2023')
 * // [{ timestamp: 1703462400000, format: 'D1.M1.Y' }]  // Dec 25, 2023
 *
 * parseDateString('Dec 25, 2023')
 * // [{ timestamp: 1703462400000, format: 'Ms D1, Y' }]  // Dec 25, 2023
 *
 * parseDateString('2023-12')
 * // [{ timestamp: 1701388800000, format: 'Y-M1' }]  // Dec 1, 2023
 * ```
 */
export function parseDateString(dateStr: string): ParseDateResult {
  const trimmed = dateStr.trim()
  const interpretations: DateInterpretation[] = []

  // Try each separator
  for (const separator of SEPARATORS) {
    let parts: string[]

    if (separator === ', ') {
      // Special handling for comma-space: split by comma-space first
      parts = trimmed.split(', ')
      if (parts.length === 2) {
        // For patterns like "December 25, 2023", further split the first part by space
        const firstPartSplit = parts[0].split(' ')
        if (firstPartSplit.length === 2) {
          parts = [firstPartSplit[0], firstPartSplit[1], parts[1]]
        }
      }
    } else {
      parts = trimmed.split(separator)
    }

    if (parts.length < 2 || parts.length > 3) continue

    // Get all possible interpretations for each part
    const allPossibleComponents = parts.map((part) =>
      getAllPossibleComponents(part.trim()),
    )

    // Check if all parts have valid interpretations
    if (
      allPossibleComponents.some((possibilities) => possibilities.length === 0)
    )
      continue

    // Generate all combinations
    const allCombinations = generateAllCombinations(allPossibleComponents)

    for (const components of allCombinations) {
      // Group components by type
      const yearComps = components.filter((c) => c.type === 'Y')
      const monthComps = components.filter((c) => c.type === 'M')
      const dayComps = components.filter((c) => c.type === 'D')

      // Valid combinations must have exactly one of each required type
      if (yearComps.length > 1 || monthComps.length > 1 || dayComps.length > 1)
        continue
      if (monthComps.length === 0) continue // Month is required

      const yearComp = yearComps[0]
      const monthComp = monthComps[0]
      const dayComp = dayComps[0]

      // Apply defaults
      const year = yearComp ? yearComp.value : 1970
      const month = monthComp.value
      const day = dayComp ? dayComp.value : 1

      // Validate date
      const date = new Date(year, month - 1, day)
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        continue // Invalid date
      }

      // Build format string
      const formatParts = components.map((comp) => comp.format)
      let format: string

      if (separator === ', ' && formatParts.length === 3) {
        // Special handling for comma-space: rejoin as "month day, year"
        format = `${formatParts[0]} ${formatParts[1]}, ${formatParts[2]}`
      } else {
        format = formatParts.join(separator)
      }

      // Create interpretation with corresponding timestamp
      const interpretation: DateInterpretation = {
        timestamp: date.getTime(),
        format: format,
      }

      // Avoid duplicates (same format and timestamp)
      const isDuplicate = interpretations.some(
        (interp) =>
          interp.format === interpretation.format &&
          interp.timestamp === interpretation.timestamp,
      )

      if (!isDuplicate) {
        interpretations.push(interpretation)
      }
    }
  }

  if (interpretations.length === 0) {
    throw new Error(`Unable to parse date string: "${dateStr}"`)
  }

  return interpretations
}

/**
 * Formats a Unix timestamp according to the specified format string.
 * This is the reverse operation of parseDateString.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @param format - Format string (e.g., "Y-M1-D1", "D2.M2.Y", "Ms D1, Y")
 * @returns Formatted date string matching the original input format
 * @throws Error if the format string is invalid
 *
 * @example
 * ```ts
 * formatDateString(1703462400000, 'Y-M1-D1') // '2023-12-25'
 * formatDateString(1703462400000, 'D1.M1.Y') // '25.12.2023'
 * formatDateString(1703462400000, 'Ms D1, Y') // 'Dec 25, 2023'
 * formatDateString(1701388800000, 'Y-M1') // '2023-12'
 * formatDateString(1640390400000, 'M1-D1') // '12-25'
 * formatDateString(1703462400000, 'D2/M2/Y') // '25/12/2023'
 * formatDateString(1703462400000, 'Mf D1, Y') // 'December 25, 2023'
 * ```
 */
export function formatDateString(timestamp: number, format: string): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  // Find the separator used in the format - prioritize comma-space
  let separator: string = ''
  let formatParts: string[]

  // Check for comma-space pattern first (like "Month Day, Year")
  if (format.includes(', ')) {
    separator = ', '
    const commaParts = format.split(', ')
    if (commaParts.length === 2) {
      const spaceParts = commaParts[0].split(' ')
      if (spaceParts.length === 2) {
        formatParts = [spaceParts[0], spaceParts[1], commaParts[1]]
      } else {
        formatParts = commaParts
      }
    } else {
      formatParts = [format] // Fallback
    }
  } else {
    // Try other separators
    for (const sep of SEPARATORS) {
      if (sep !== ', ' && format.includes(sep)) {
        separator = sep
        break
      }
    }

    if (!separator) {
      throw new Error(
        `Invalid format: no recognized separator found in "${format}"`,
      )
    }

    formatParts = format.split(separator)
  }

  // Convert each part (trim spaces from each part)
  const resultParts = formatParts.map((part) => {
    const trimmedPart = part.trim()
    if (trimmedPart === 'Y') {
      return year.toString()
    } else if (trimmedPart.startsWith('M')) {
      return numberToMonthName(month, trimmedPart)
    } else if (trimmedPart.startsWith('D')) {
      switch (trimmedPart) {
        case 'D1':
          return day.toString()
        case 'D2':
          return day.toString().padStart(2, '0')
        default:
          throw new Error(`Invalid day format: "${trimmedPart}"`)
      }
    } else {
      throw new Error(`Invalid format component: "${trimmedPart}"`)
    }
  })

  // Reconstruct the result with proper separator handling
  if (separator === ', ' && formatParts.length === 3) {
    // Handle "Month Day, Year" format by joining as "month day, year"
    return `${resultParts[0]} ${resultParts[1]}, ${resultParts[2]}`
  } else {
    return resultParts.join(separator)
  }
}
