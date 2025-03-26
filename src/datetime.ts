/**
 * Converts a month number to a month name in the specified locale and format.
 *
 * @param monthNumber - Integer between 1-12 representing the month (1 = January, 12 = December)
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param type - The format type, either 'long' (e.g., 'January') or 'short' (e.g., 'Jan') (default: 'long')
 * @returns The localized month name as a string
 *
 * @example
 * // Returns "January"
 * toMonth(1)
 *
 * @example
 * // Returns "janvier"
 * toMonth(1, 'fr-FR')
 *
 * @example
 * // Returns "Jan"
 * toMonth(1, 'en-US', 'short')
 *
 * @throws Will throw an error if monthNumber is not between 1 and 12
 */
export function toMonth(
  monthNumber: number,
  locale: string = 'en-US',
  type: 'long' | 'short' | 'narrow' = 'long',
): string {
  if (monthNumber < 1 || monthNumber > 12 || !Number.isInteger(monthNumber)) {
    throw new Error('Month number must be an integer between 1 and 12')
  }

  const date = new Date(2000, monthNumber - 1) // Use any year, set month (0-based)
  // eslint-disable-next-line compat/compat
  return new Intl.DateTimeFormat(locale, { month: type }).format(date)
}

/**
 * Converts a month name to its corresponding number in the specified locale.
 * Performs a case-insensitive comparison with both long and short month names.
 *
 * @param monthName - The name of the month to convert (e.g., "January", "Jan", "janvier")
 * @param locale - The locale to use for parsing (default: 'en-US')
 * @returns The month number (1-12) or null if not found
 *
 * @example
 * // Returns 1
 * fromMonth('January')
 *
 * @example
 * // Returns 1
 * fromMonth('jan', 'fr-FR')
 *
 * @example
 * // Returns 12
 * fromMonth('Dez', 'de-DE')
 */
export function fromMonth(
  monthName: string,
  locale: string = 'en-US',
): number | null {
  if (!monthName || typeof monthName !== 'string') {
    return null
  }

  for (let i = 1; i <= 12; i++) {
    if (
      toMonth(i, locale, 'long').toLowerCase() === monthName.toLowerCase() ||
      toMonth(i, locale, 'short').toLowerCase().replace(/\.$/, '') ===
        monthName.toLowerCase().replace(/\.$/, '')
    ) {
      return i
    }
  }
  return null // Not found
}

/**
 * Converts a day number to a day name in the specified locale and format.
 * Uses 0-based indexing for days (0 = Sunday, 6 = Saturday).
 *
 * @param dayNumber - Integer between 0-6 representing the day of the week (0 = Sunday, 6 = Saturday)
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param type - The format type, either 'long' (e.g., 'Sunday') or 'short' (e.g., 'Sun') (default: 'long')
 * @returns The localized day name as a string
 *
 * @example
 * // Returns "Sunday"
 * toDayOfWeek(0)
 *
 * @example
 * // Returns "lundi"
 * toDayOfWeek(1, 'fr-FR')
 *
 * @example
 * // Returns "Di"
 * toDayOfWeek(2, 'de-DE', 'short')
 *
 * @throws Will throw an error if dayNumber is not between 0 and 6
 */
export function toDayOfWeek(
  dayNumber: number,
  locale: string = 'en-US',
  type: 'long' | 'short' | 'narrow' = 'long',
): string {
  if (dayNumber < 0 || dayNumber > 6 || !Number.isInteger(dayNumber)) {
    throw new Error('Day number must be an integer between 0 and 6')
  }

  const date = new Date(2000, 0, 2 + dayNumber) // Ensure Sunday (0) aligns with ISO weekdays
  // eslint-disable-next-line compat/compat
  return new Intl.DateTimeFormat(locale, { weekday: type }).format(date)
}

/**
 * Converts a day name to its corresponding number in the specified locale.
 * Performs a case-insensitive comparison with both long and short day names.
 * Returns the day number using 0-based indexing (0 = Sunday, 6 = Saturday).
 *
 * @param dayName - The name of the day to convert (e.g., "Sunday", "Sun", "Dimanche")
 * @param locale - The locale to use for parsing (default: 'en-US')
 * @returns The day number (0-6) or null if not found
 *
 * @example
 * // Returns 1
 * fromDayOfWeek('Monday')
 *
 * @example
 * // Returns 1
 * fromDayOfWeek('Lundi', 'fr-FR')
 *
 * @example
 * // Returns 2
 * fromDayOfWeek('Di', 'de-DE')
 */
export function fromDayOfWeek(
  dayName: string,
  locale: string = 'en-US',
): number | null {
  if (!dayName || typeof dayName !== 'string') {
    return null
  }

  for (let i = 0; i < 7; i++) {
    if (
      toDayOfWeek(i, locale, 'long').toLowerCase() === dayName.toLowerCase() ||
      toDayOfWeek(i, locale, 'short').toLowerCase().replace(/\.$/, '') ===
        dayName.toLowerCase().replace(/\.$/, '')
    ) {
      return i
    }
  }
  return null // Not found
}

/**
 * Converts a Date object to Julian Day Number
 * @param date - The Date object
 * @returns The Julian Day Number
 */
export function toJulianDay(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3

  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045

  return jd
}

/**
 * Converts Julian Day Number to a Date object
 * @param julianDay - The Julian Day Number
 * @returns A JavaScript Date object
 */
export function fromJulianDay(julianDay: number): Date {
  // Calculate the date components
  const a = julianDay + 32044
  const b = Math.floor((4 * a + 3) / 146097)
  const c = a - Math.floor((146097 * b) / 4)

  const d = Math.floor((4 * c + 3) / 1461)
  const e = c - Math.floor((1461 * d) / 4)
  const m = Math.floor((5 * e + 2) / 153)

  const day = e - Math.floor((153 * m + 2) / 5) + 1
  const month = m + 3 - 12 * Math.floor(m / 10)
  const year = 100 * b + d - 4800 + Math.floor(m / 10)

  return new Date(year, month - 1, day)
}
