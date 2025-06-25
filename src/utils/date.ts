/**
 * Supported separators for date strings
 */
const SEPARATORS = ['-', '.', '/', ',', ', ', ' '] as const

/**
 * Month format types and their patterns
 */
const MONTH_FORMATS = {
  M2: {
    pattern: /^(0[1-9]|1[0-2])$/,
    min: 1,
    max: 12,
    requireZeroPadded: true,
  }, // 01-12 (zero-padded format)
  M1: { pattern: /^(0?[1-9]|1[0-2])$/, min: 1, max: 12 }, // 1-12 or 01-12 (flexible format)
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
  }, // 01-31 (zero-padded format)
  D1: {
    pattern: /^(0?[1-9]|[1-2][0-9]|3[01])$/,
    min: 1,
    max: 31,
  }, // 1-31 or 01-31 (flexible format)
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
  /** Number of months after 1970-01 (only present for year-month only dates) */
  months?: number
  /** Number of days after 1970-01-01 (only present for dates with day components) */
  days?: number
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

  // Check month formats (both M1 and M2 can match the same value to generate all format combinations)
  const monthFormats: Array<{
    key: string
    info: (typeof MONTH_FORMATS)[keyof typeof MONTH_FORMATS]
  }> = [
    { key: 'M2', info: MONTH_FORMATS.M2 }, // Zero-padded format
    { key: 'M1', info: MONTH_FORMATS.M1 }, // Flexible format
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

        // Special check for M1: allow zero-padded numbers to be interpreted as non-padded
        // We should allow both M1 and M2 interpretations for the same numeric value
        // No exclusion logic needed here - let both formats coexist

        // Special check for M2: require that single-digit months are zero-padded
        if ('requireZeroPadded' in formatInfo && formatInfo.requireZeroPadded) {
          // For M2, single-digit values (1-9) are not allowed without zero-padding
          if (value >= 1 && value <= 9 && component.length === 1) continue
          // Note: We allow both M1 and M2 for naturally two-digit values (10-12)
          // to generate all valid format combinations
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

  // Check day formats (both D1 and D2 can match the same value to generate all format combinations)
  const dayFormats: Array<{
    key: string
    info: (typeof DAY_FORMATS)[keyof typeof DAY_FORMATS]
  }> = [
    { key: 'D2', info: DAY_FORMATS.D2 }, // Zero-padded format
    { key: 'D1', info: DAY_FORMATS.D1 }, // Flexible format
  ]

  for (const { key: formatKey, info: formatInfo } of dayFormats) {
    if (formatInfo.pattern.test(component)) {
      const value = parseInt(component, 10)
      if (value < formatInfo.min || value > formatInfo.max) continue

      // Special check for D1: allow zero-padded numbers to be interpreted as non-padded
      // We should allow both D1 and D2 interpretations for the same numeric value
      // No exclusion logic needed here - let both formats coexist

      // Special check for D2: require that single-digit days are zero-padded
      if ('requireZeroPadded' in formatInfo && formatInfo.requireZeroPadded) {
        // For D2, single-digit values (1-9) are not allowed without zero-padding
        if (value >= 1 && value <= 9 && component.length === 1) continue
        // Note: We allow both D1 and D2 for naturally two-digit values (10-31)
        // to generate all valid format combinations
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
 * @remarks For year-month only dates (no day component), the result includes a `months` property
 * representing the number of months since 1970-01 (where 1970-01 = 0, 1970-02 = 1, etc.).
 *
 * @param dateStr - The date string to parse (e.g., "2023-01-05", "25.12.2023", "Jan 15, 2023")
 * @returns Array of all possible interpretations, each with timestamp, format, and optionally months
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
 * // [{ timestamp: 1701388800000, format: 'Y-M1', months: 647 }]  // Dec 1, 2023, 647 months since 1970-01
 *
 * parseDateString('Jan 2024')
 * // [{ timestamp: 1704067200000, format: 'Ms Y', months: 648 }]  // Jan 1, 2024, 648 months since 1970-01
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
      // Group components by type and position
      const yearComps = components.filter((c) => c.type === 'Y')
      const monthComps = components.filter((c) => c.type === 'M')
      const dayComps = components.filter((c) => c.type === 'D')

      // Valid combinations must have exactly one of each required type
      if (yearComps.length > 1 || monthComps.length > 1 || dayComps.length > 1)
        continue
      if (monthComps.length === 0) continue // Month is required

      // Determine valid component arrangements based on position and values
      const componentTypes = components.map((c) => c.type)
      const componentValues = components.map((c) => c.value)

      // Check if this arrangement is valid based on position and values
      let isValidArrangement = true

      if (componentTypes.length === 3) {
        // Three components: Y, M, D
        const [type1, type2, type3] = componentTypes
        const [val1, val2] = componentValues

        if (type1 === 'Y') {
          // Year first: Y-M-D is always valid, Y-D-M is not
          if (!(type2 === 'M' && type3 === 'D')) {
            isValidArrangement = false
          }
        } else if (type3 === 'Y') {
          // Year last: both D-M-Y and M-D-Y could be valid
          // Check if arrangement makes sense based on values
          if (type1 === 'D' && type2 === 'M') {
            // D-M-Y: valid if day > 12 OR month <= 12
            if (val1 <= 12 && val2 <= 12) {
              // Ambiguous case - both could be valid, keep this arrangement
            } else if (val1 > 12) {
              // Definitely day-month-year
            } else {
              // val2 > 12, impossible month
              isValidArrangement = false
            }
          } else if (type1 === 'M' && type2 === 'D') {
            // M-D-Y: valid if month <= 12 AND (day > 12 OR both <= 12)
            if (val1 > 12) {
              // Impossible month
              isValidArrangement = false
            } else if (val2 > 12) {
              // Definitely month-day-year
            } else {
              // Both <= 12, ambiguous case - keep this arrangement
            }
          } else {
            isValidArrangement = false
          }
        } else {
          // Year in middle - not a standard format
          isValidArrangement = false
        }
      } else if (componentTypes.length === 2) {
        // Two components: could be Y-M, M-Y, M-D, D-M
        const [type1, type2] = componentTypes
        const [val1, val2] = componentValues

        if (type1 === 'Y' || type2 === 'Y') {
          // Has year: Y-M or M-Y are both valid
        } else {
          // M-D or D-M: both could be valid based on values
          if (val1 > 12 && val2 <= 12) {
            // First is definitely day, second is month: D-M
            if (!(type1 === 'D' && type2 === 'M')) {
              isValidArrangement = false
            }
          } else if (val1 <= 12 && val2 > 12) {
            // First is month, second is definitely day: M-D
            if (!(type1 === 'M' && type2 === 'D')) {
              isValidArrangement = false
            }
          } else {
            // Both <= 12: ambiguous, both M-D and D-M could be valid
          }
        }
      }

      if (!isValidArrangement) continue

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

      // Add months property if this is a year-month only date (no day)
      if (!dayComp) {
        interpretation.months = (year - 1970) * 12 + (month - 1)
      } else {
        // Add days property if this is NOT a year-month only date (has day)
        const baseDate = new Date(1970, 0, 1) // Jan 1, 1970
        const currentDate = new Date(year, month - 1, day)
        interpretation.days = Math.floor(
          (currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24),
        )
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

/**
 * Formats a day number (days since 1970-01-01) according to the specified format string.
 * This function only works with date formats that include day components.
 *
 * @param days - Number of days since 1970-01-01 (1970-01-01 = 0, 1970-01-02 = 1, etc.)
 * @param format - Format string for dates with day components (e.g., "Y-M1-D1", "D2.M2.Y", "Ms D1, Y")
 * @returns Formatted date string containing year, month, and day
 * @throws Error if the format string contains only year-month components or is invalid
 *
 * @example
 * ```ts
 * formatDayString(0, 'Y-M1-D1') // '1970-1-1'
 * formatDayString(0, 'D2/M2/Y') // '01/01/1970'
 * formatDayString(1, 'Y-M2-D2') // '1970-01-02'
 * formatDayString(31, 'D1.M1.Y') // '1.2.1970'
 * formatDayString(358, 'Ms D1, Y') // 'Dec 25, 1970'
 * formatDayString(19723, 'Mf D1, Y') // 'December 25, 2023'
 * ```
 */
export function formatDayString(days: number, format: string): string {
  // Convert days to timestamp
  const baseDate = new Date(1970, 0, 1) // Jan 1, 1970
  const timestamp = baseDate.getTime() + days * 24 * 60 * 60 * 1000

  // Validate that format contains day components
  // Find the separator used in the format
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
  } else if (format.includes(' ')) {
    // Check for space separator (like "Month Day")
    separator = ' '
    formatParts = format.split(' ')
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

  // Validate that format contains day components
  let hasDayComponent = false
  for (const part of formatParts) {
    const trimmedPart = part.trim()
    if (trimmedPart.startsWith('D')) {
      hasDayComponent = true
      break
    }
  }

  if (!hasDayComponent) {
    throw new Error(
      `Invalid format for day string: format "${format}" must contain day component (D1 or D2)`,
    )
  }

  // Use formatDateString to do the actual formatting (it will handle invalid format components)
  return formatDateString(timestamp, format)
}

/**
 * Formats a month number (months since 1970-01) according to the specified format string.
 * This function only works with year-month formats (no day component).
 *
 * @param months - Number of months since 1970-01 (1970-01 = 0, 1970-02 = 1, etc.)
 * @param format - Format string for year-month only (e.g., "Y-M1", "Y.M2", "Mf Y")
 * @returns Formatted date string containing only year and month
 * @throws Error if the format string contains day components or is invalid
 *
 * @example
 * ```ts
 * formatMonthString(0, 'Y-M1') // '1970-1'
 * formatMonthString(1, 'Y-M2') // '1970-02'
 * formatMonthString(12, 'Y-M1') // '1971-1'
 * formatMonthString(0, 'Mf Y') // 'January 1970'
 * formatMonthString(11, 'Ms Y') // 'Dec 1970'
 * ```
 */
export function formatMonthString(months: number, format: string): string {
  // Convert months to year and month
  const year = Math.floor(months / 12) + 1970
  const month = (months % 12) + 1

  // Find the separator used in the format
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
  } else if (format.includes(' ')) {
    // Check for space separator (like "Month Year")
    separator = ' '
    formatParts = format.split(' ')
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

  // Validate that format only contains year and month components
  for (const part of formatParts) {
    const trimmedPart = part.trim()
    if (trimmedPart.startsWith('D')) {
      throw new Error(
        `Invalid format for month string: day component "${trimmedPart}" not allowed`,
      )
    }
    if (!trimmedPart.startsWith('Y') && !trimmedPart.startsWith('M')) {
      throw new Error(`Invalid format component: "${trimmedPart}"`)
    }
  }

  // Convert each part
  const resultParts = formatParts.map((part) => {
    const trimmedPart = part.trim()
    if (trimmedPart === 'Y') {
      return year.toString()
    } else if (trimmedPart.startsWith('M')) {
      return numberToMonthName(month, trimmedPart)
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
