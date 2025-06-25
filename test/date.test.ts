import { expect, test, describe } from 'bun:test'
import { parseDateString, formatDateString, formatMonthString } from '../src/utils/date'

describe('Date string parsing and formatting', () => {
  describe('parseDateString function', () => {
    describe('Y-M-D format variants', () => {
      test('should parse Y-M1-D1 format with dash separator', () => {
        const result = parseDateString('2023-12-25')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Y-M1-D1')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse ambiguous Y-M2-D2 format with multiple interpretations', () => {
        const result = parseDateString('2023-01-05')
        expect(result).toHaveLength(2)

        // Should detect both possible interpretations
        const formats = result.map((i) => i.format)
        expect(formats).toContain('Y-M2-D2') // January 5th
        expect(formats).toContain('Y-D2-M2') // May 1st

        // Check timestamps correspond to different dates
        const timestamps = result.map((i) => i.timestamp)
        expect(timestamps).toContain(new Date(2023, 0, 5).getTime()) // Jan 5
        expect(timestamps).toContain(new Date(2023, 4, 1).getTime()) // May 1
      })

      test('should parse Y-M1-D1 format with dot separator', () => {
        const result = parseDateString('2023.12.25')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Y.M1.D1')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse Y-M1-D1 format with slash separator', () => {
        const result = parseDateString('2023/12/25')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Y/M1/D1')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse Y-M1-D1 format with comma separator', () => {
        const result = parseDateString('2023,12,25')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Y,M1,D1')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })
    })

    describe('D-M-Y format variants', () => {
      test('should parse D1-M1-Y format', () => {
        const result = parseDateString('25-12-2023')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('D1-M1-Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse ambiguous D2.M2.Y format with multiple interpretations', () => {
        const result = parseDateString('05.01.2023')
        expect(result).toHaveLength(2)

        const formats = result.map((i) => i.format)
        expect(formats).toContain('M2.D2.Y') // May 1st
        expect(formats).toContain('D2.M2.Y') // January 5th

        const timestamps = result.map((i) => i.timestamp)
        expect(timestamps).toContain(new Date(2023, 4, 1).getTime()) // May 1
        expect(timestamps).toContain(new Date(2023, 0, 5).getTime()) // Jan 5
      })

      test('should parse unambiguous D1/M1/Y format', () => {
        const result = parseDateString('31/1/2023')
        expect(result).toHaveLength(1) // Only one interpretation (31 can't be month)
        expect(result[0].format).toBe('D1/M1/Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 0, 31))
      })
    })

    describe('M-D-Y format variants', () => {
      test('should parse unambiguous M1-D1-Y format', () => {
        const result = parseDateString('12-25-2023')
        expect(result).toHaveLength(1) // Only one interpretation (25 can't be month)
        expect(result[0].format).toBe('M1-D1-Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse ambiguous M2/D2/Y format with multiple interpretations', () => {
        const result = parseDateString('01/05/2023')
        expect(result).toHaveLength(2)

        const formats = result.map((i) => i.format)
        expect(formats).toContain('M2/D2/Y') // January 5th
        expect(formats).toContain('D2/M2/Y') // May 1st

        const timestamps = result.map((i) => i.timestamp)
        expect(timestamps).toContain(new Date(2023, 0, 5).getTime()) // Jan 5
        expect(timestamps).toContain(new Date(2023, 4, 1).getTime()) // May 1
      })
    })

    describe('Y-M format (no day)', () => {
      test('should parse Y-M1 format and default day to 1', () => {
        const result = parseDateString('2023-12')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Y-M1')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 1))
      })

      test('should parse Y.M2 format and default day to 1', () => {
        const result = parseDateString('2023.01')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Y.M2')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 0, 1))
      })
    })

    describe('M-Y format (no day)', () => {
      test('should parse M1-Y format and default day to 1', () => {
        const result = parseDateString('12-2023')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('M1-Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 1))
      })

      test('should parse M2/Y format and default day to 1', () => {
        const result = parseDateString('01/2023')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('M2/Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 0, 1))
      })
    })

    describe('M-D format (no year)', () => {
      test('should parse unambiguous M1-D1 format and default year to 1970', () => {
        const result = parseDateString('12-25')
        expect(result).toHaveLength(1) // Only one interpretation (25 can't be month)
        expect(result[0].format).toBe('M1-D1')
        expect(new Date(result[0].timestamp)).toEqual(new Date(1970, 11, 25))
      })

      test('should parse ambiguous M2.D2 format and default year to 1970', () => {
        const result = parseDateString('01.05')
        expect(result).toHaveLength(2)

        const formats = result.map((i) => i.format)
        expect(formats).toContain('M2.D2') // January 5th
        expect(formats).toContain('D2.M2') // May 1st

        const timestamps = result.map((i) => i.timestamp)
        expect(timestamps).toContain(new Date(1970, 0, 5).getTime()) // Jan 5
        expect(timestamps).toContain(new Date(1970, 4, 1).getTime()) // May 1
      })
    })

    describe('D-M format (no year)', () => {
      test('should parse unambiguous D1-M1 format and default year to 1970', () => {
        const result = parseDateString('25-12')
        expect(result).toHaveLength(1) // Only one interpretation (25 can't be month)
        expect(result[0].format).toBe('D1-M1')
        expect(new Date(result[0].timestamp)).toEqual(new Date(1970, 11, 25))
      })

      test('should parse ambiguous D2/M2 format and default year to 1970', () => {
        const result = parseDateString('05/01')
        expect(result).toHaveLength(2)

        const formats = result.map((i) => i.format)
        expect(formats).toContain('M2/D2') // January 5th
        expect(formats).toContain('D2/M2') // May 1st

        const timestamps = result.map((i) => i.timestamp)
        expect(timestamps).toContain(new Date(1970, 0, 5).getTime()) // Jan 5
        expect(timestamps).toContain(new Date(1970, 4, 1).getTime()) // May 1
      })
    })

    describe('Named month formats', () => {
      test('should parse full month name with title case', () => {
        const result = parseDateString('December 25, 2023')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Mf D1, Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse full month name with lowercase', () => {
        const result = parseDateString('december 25, 2023')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Mfl D1, Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse full month name with uppercase', () => {
        const result = parseDateString('DECEMBER 25, 2023')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Mfu D1, Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse short month name with title case', () => {
        const result = parseDateString('Dec 25, 2023')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Ms D1, Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse short month name with lowercase', () => {
        const result = parseDateString('dec 25, 2023')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Msl D1, Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse short month name with uppercase', () => {
        const result = parseDateString('DEC 25, 2023')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Msu D1, Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse Y-Month format', () => {
        const result = parseDateString('2023-December')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Y-Mf')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 1))
      })

      test('should parse Month-Y format', () => {
        const result = parseDateString('January-2023')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Mf-Y')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 0, 1))
      })
    })

    describe('Leap year handling', () => {
      test('should handle leap year February 29th correctly', () => {
        const result = parseDateString('2024-02-29')
        expect(result.length).toBeGreaterThan(0)

        // Check that at least one interpretation accepts Feb 29, 2024
        const feb29Interp = result.find(
          (interp) => interp.timestamp === new Date(2024, 1, 29).getTime(),
        )
        expect(feb29Interp).toBeDefined()
      })

      test('should reject invalid dates', () => {
        // February 29th in non-leap year should fail
        expect(() => parseDateString('2023-02-29')).toThrow(
          'Unable to parse date string',
        )
        expect(() => parseDateString('2023-13-15')).toThrow(
          'Unable to parse date string',
        )
        expect(() => parseDateString('2023-12-32')).toThrow(
          'Unable to parse date string',
        )
      })

      test('should reject invalid month names', () => {
        expect(() => parseDateString('Decembor 25, 2023')).toThrow(
          'Unable to parse date string',
        )
        expect(() => parseDateString('13th 25, 2023')).toThrow(
          'Unable to parse date string',
        )
      })
    })

    describe('Input normalization', () => {
      test('should handle whitespace trimming', () => {
        const result = parseDateString('  2023-12-25  ')
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe('Y-M1-D1')
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should reject completely invalid input', () => {
        expect(() => parseDateString('invalid-date')).toThrow(
          'Unable to parse date string',
        )
        expect(() => parseDateString('2023')).toThrow(
          'Unable to parse date string',
        )
        expect(() => parseDateString('2023-12-25-extra')).toThrow(
          'Unable to parse date string',
        )
      })
    })
  })

  describe('formatDateString function', () => {
    describe('Basic date formatting', () => {
      test('should format Y-M1-D1 pattern correctly', () => {
        const timestamp = new Date(2023, 11, 25).getTime()
        expect(formatDateString(timestamp, 'Y-M1-D1')).toBe('2023-12-25')
      })

      test('should format Y-M2-D2 pattern with zero-padding', () => {
        const timestamp = new Date(2023, 0, 5).getTime()
        expect(formatDateString(timestamp, 'Y-M2-D2')).toBe('2023-01-05')
      })

      test('should format D1.M1.Y pattern correctly', () => {
        const timestamp = new Date(2023, 11, 25).getTime()
        expect(formatDateString(timestamp, 'D1.M1.Y')).toBe('25.12.2023')
      })

      test('should format D2/M2/Y pattern with zero-padding', () => {
        const timestamp = new Date(2023, 0, 5).getTime()
        expect(formatDateString(timestamp, 'D2/M2/Y')).toBe('05/01/2023')
      })

      test('should format M1-D1-Y pattern correctly', () => {
        const timestamp = new Date(2023, 11, 25).getTime()
        expect(formatDateString(timestamp, 'M1-D1-Y')).toBe('12-25-2023')
      })
    })

    describe('Month name formatting', () => {
      test('should format full month names correctly', () => {
        const timestamp = new Date(2023, 11, 25).getTime()
        expect(formatDateString(timestamp, 'Mf D1, Y')).toBe(
          'December 25, 2023',
        )
        expect(formatDateString(timestamp, 'Mfl D1, Y')).toBe(
          'december 25, 2023',
        )
        expect(formatDateString(timestamp, 'Mfu D1, Y')).toBe(
          'DECEMBER 25, 2023',
        )
      })

      test('should format short month names correctly', () => {
        const timestamp = new Date(2023, 11, 25).getTime()
        expect(formatDateString(timestamp, 'Ms D1, Y')).toBe('Dec 25, 2023')
        expect(formatDateString(timestamp, 'Msl D1, Y')).toBe('dec 25, 2023')
        expect(formatDateString(timestamp, 'Msu D1, Y')).toBe('DEC 25, 2023')
      })

      test('should format year-month patterns', () => {
        const timestamp = new Date(2023, 0, 1).getTime()
        expect(formatDateString(timestamp, 'Y-Mf')).toBe('2023-January')
        expect(formatDateString(timestamp, 'Ms-Y')).toBe('Jan-2023')
      })
    })

    describe('Partial date formatting', () => {
      test('should format year-month only patterns', () => {
        const timestamp = new Date(2023, 11, 1).getTime()
        expect(formatDateString(timestamp, 'Y-M1')).toBe('2023-12')
        expect(formatDateString(timestamp, 'Y.M2')).toBe('2023.12')
      })

      test('should format month-year only patterns', () => {
        const timestamp = new Date(2023, 11, 1).getTime()
        expect(formatDateString(timestamp, 'M1-Y')).toBe('12-2023')
        expect(formatDateString(timestamp, 'M2/Y')).toBe('12/2023')
      })

      test('should format month-day only patterns', () => {
        const timestamp = new Date(1970, 11, 25).getTime()
        expect(formatDateString(timestamp, 'M1-D1')).toBe('12-25')
        expect(formatDateString(timestamp, 'M2.D2')).toBe('12.25')
      })

      test('should format day-month only patterns', () => {
        const timestamp = new Date(1970, 11, 25).getTime()
        expect(formatDateString(timestamp, 'D1-M1')).toBe('25-12')
        expect(formatDateString(timestamp, 'D2/M2')).toBe('25/12')
      })
    })

    describe('Error handling for formatDateString', () => {
      test('should throw error for invalid format strings', () => {
        const timestamp = new Date(2023, 11, 25).getTime()
        expect(() => formatDateString(timestamp, 'invalid-format')).toThrow(
          'Invalid format',
        )
        expect(() => formatDateString(timestamp, 'Y-X-D1')).toThrow(
          'Invalid format component',
        )
        expect(() => formatDateString(timestamp, 'Y-M1-D3')).toThrow(
          'Invalid day format',
        )
      })
    })
  })

  describe('Round-trip consistency', () => {
    describe('Simple round-trip tests', () => {
      const testCases = [
        { input: '2023-12-25', expectedFormat: 'Y-M1-D1' },
        { input: '25.12.2023', expectedFormat: 'D1.M1.Y' },
        { input: '12/25/2023', expectedFormat: 'M1/D1/Y' },
        { input: 'December 25, 2023', expectedFormat: 'Mf D1, Y' },
        { input: '2023-12', expectedFormat: 'Y-M1' },
        { input: '12-25', expectedFormat: 'M1-D1' },
      ]

      test.each(testCases)(
        'should round-trip $input correctly',
        ({ input, expectedFormat }) => {
          const parsed = parseDateString(input)
          expect(parsed.length).toBe(1) // Should have only one interpretation
          const interpretation = parsed[0]
          expect(interpretation.format).toBe(expectedFormat)

          const formatted = formatDateString(
            interpretation.timestamp,
            interpretation.format,
          )
          expect(formatted).toBe(input)
        },
      )
    })

    describe('Complex round-trip tests', () => {
      test('should handle ambiguous inputs with multiple interpretations', () => {
        const input = '01/05/2023'
        const parsed = parseDateString(input)
        expect(parsed.length).toBe(2)

        const formats = parsed.map((i) => i.format)
        const timestamps = parsed.map((i) => i.timestamp)

        expect(formats).toContain('M2/D2/Y') // January 5th
        expect(formats).toContain('D2/M2/Y') // May 1st
        expect(timestamps).toContain(new Date(2023, 0, 5).getTime()) // Jan 5
        expect(timestamps).toContain(new Date(2023, 4, 1).getTime()) // May 1

        // Each interpretation should round-trip correctly
        for (const interpretation of parsed) {
          const formatted = formatDateString(
            interpretation.timestamp,
            interpretation.format,
          )
          const reparsed = parseDateString(formatted)
          const matchingInterp = reparsed.find(
            (i) =>
              i.format === interpretation.format &&
              i.timestamp === interpretation.timestamp,
          )
          expect(matchingInterp).toBeDefined()
        }
      })
    })

    describe('Edge cases and boundaries', () => {
      test('should handle epoch date correctly', () => {
        const result = parseDateString('1970-01-01')
        expect(result.length).toBeGreaterThan(0)

        // Check that at least one interpretation is the Unix epoch
        const epochInterp = result.find((i) => i.timestamp === 0)
        expect(epochInterp).toBeDefined()

        if (epochInterp) {
          const formatted = formatDateString(
            epochInterp.timestamp,
            epochInterp.format,
          )
          expect(formatted).toBe('1970-01-01')
        }
      })

      test('should handle future dates correctly', () => {
        const input = '2050-06-15'
        const result = parseDateString(input)
        expect(result.length).toBeGreaterThan(0)

        const hasExpectedYear = result.some(
          (i) => new Date(i.timestamp).getFullYear() === 2050,
        )
        expect(hasExpectedYear).toBe(true)
      })

      test('should handle different months correctly', () => {
        const dateStr = 'February-2023'
        const result = parseDateString(dateStr)
        expect(result.length).toBeGreaterThan(0)

        const hasExpectedMonth = result.some(
          (i) => new Date(i.timestamp).getMonth() === 1, // February is month 1 (0-indexed)
        )
        expect(hasExpectedMonth).toBe(true)
      })

      test('should preserve ambiguity through round-trips', () => {
        const result = parseDateString('2023-01-05')
        expect(result).toHaveLength(2)

        const formats = result.map((i) => i.format)
        expect(formats).toContain('Y-M2-D2') // January 5th
        expect(formats).toContain('Y-D2-M2') // May 1st

        const jan5Interp = result.find(
          (i) => i.timestamp === new Date(2023, 0, 5).getTime(),
        )
        const may1Interp = result.find(
          (i) => i.timestamp === new Date(2023, 4, 1).getTime(),
        )

        expect(jan5Interp).toBeDefined()
        expect(may1Interp).toBeDefined()

        if (jan5Interp) {
          const formatted = formatDateString(
            jan5Interp.timestamp,
            jan5Interp.format,
          )
          expect(formatted).toBe('2023-01-05')
        }

        if (may1Interp) {
          const formatted = formatDateString(
            may1Interp.timestamp,
            may1Interp.format,
          )
          expect(formatted).toBe('2023-01-05') // Y-D2-M2 format: year-day-month
        }
      })
    })
  })

  describe('Months property for year-month only dates', () => {
    test('should add months property for Y-M format', () => {
      const result = parseDateString('2023-12')
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe('Y-M1')
      expect(result[0].months).toBe(647) // (2023-1970)*12 + (12-1) = 53*12 + 11 = 636 + 11 = 647
      expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 1))
    })

    test('should add months property for M-Y format', () => {
      const result = parseDateString('01-2023')
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe('M2-Y')
      expect(result[0].months).toBe(636) // (2023-1970)*12 + (1-1) = 53*12 + 0 = 636
      expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 0, 1))
    })

    test('should add months property for named month formats', () => {
      const result = parseDateString('January 2024')
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe('Mf Y')
      expect(result[0].months).toBe(648) // (2024-1970)*12 + (1-1) = 54*12 + 0 = 648
      expect(new Date(result[0].timestamp)).toEqual(new Date(2024, 0, 1))
    })

    test('should add months property for Y-NamedMonth format', () => {
      const result = parseDateString('2024-February')
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe('Y-Mf')
      expect(result[0].months).toBe(649) // (2024-1970)*12 + (2-1) = 54*12 + 1 = 649
      expect(new Date(result[0].timestamp)).toEqual(new Date(2024, 1, 1))
    })

    test('should NOT add months property for dates with day component', () => {
      const result = parseDateString('2023-12-25')
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe('Y-M1-D1')
      expect(result[0].months).toBeUndefined()
      expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 25))
    })

    test('should NOT add months property for M-D format (no year)', () => {
      const result = parseDateString('12-25')
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe('M1-D1')
      expect(result[0].months).toBeUndefined()
      expect(new Date(result[0].timestamp)).toEqual(new Date(1970, 11, 25))
    })

    test('should handle edge case: 1970-01 (months = 0)', () => {
      const result = parseDateString('1970-01')
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe('Y-M2')
      expect(result[0].months).toBe(0) // (1970-1970)*12 + (1-1) = 0
      expect(new Date(result[0].timestamp)).toEqual(new Date(1970, 0, 1))
    })

    test('should handle edge case: 1970-02 (months = 1)', () => {
      const result = parseDateString('1970-02')
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe('Y-M2')
      expect(result[0].months).toBe(1) // (1970-1970)*12 + (2-1) = 1
      expect(new Date(result[0].timestamp)).toEqual(new Date(1970, 1, 1))
    })

    test('should handle various month name formats with months property', () => {
      const testCases = [
        { input: 'Dec 2023', expectedMonths: 647, expectedFormat: 'Ms Y' },
        { input: 'dec 2023', expectedMonths: 647, expectedFormat: 'Msl Y' },
        { input: 'DEC 2023', expectedMonths: 647, expectedFormat: 'Msu Y' },
        { input: 'December 2023', expectedMonths: 647, expectedFormat: 'Mf Y' },
        { input: 'december 2023', expectedMonths: 647, expectedFormat: 'Mfl Y' },
        { input: 'DECEMBER 2023', expectedMonths: 647, expectedFormat: 'Mfu Y' },
      ]

      testCases.forEach(({ input, expectedMonths, expectedFormat }) => {
        const result = parseDateString(input)
        expect(result).toHaveLength(1)
        expect(result[0].format).toBe(expectedFormat)
        expect(result[0].months).toBe(expectedMonths)
        expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 1))
      })
    })
  })

  describe('formatMonthString function', () => {
    describe('Basic month string formatting', () => {
      test('should format months 0 (1970-01) correctly', () => {
        expect(formatMonthString(0, 'Y-M1')).toBe('1970-1')
        expect(formatMonthString(0, 'Y-M2')).toBe('1970-01')
        expect(formatMonthString(0, 'Y.M1')).toBe('1970.1')
        expect(formatMonthString(0, 'Y/M2')).toBe('1970/01')
      })

      test('should format months 1 (1970-02) correctly', () => {
        expect(formatMonthString(1, 'Y-M1')).toBe('1970-2')
        expect(formatMonthString(1, 'Y-M2')).toBe('1970-02')
        expect(formatMonthString(1, 'M1-Y')).toBe('2-1970')
        expect(formatMonthString(1, 'M2/Y')).toBe('02/1970')
      })

      test('should format months 12 (1971-01) correctly', () => {
        expect(formatMonthString(12, 'Y-M1')).toBe('1971-1')
        expect(formatMonthString(12, 'Y-M2')).toBe('1971-01')
        expect(formatMonthString(12, 'M1-Y')).toBe('1-1971')
        expect(formatMonthString(12, 'M2.Y')).toBe('01.1971')
      })

      test('should format large month numbers correctly', () => {
        // 636 months = 2023-01
        expect(formatMonthString(636, 'Y-M1')).toBe('2023-1')
        expect(formatMonthString(636, 'Y-M2')).toBe('2023-01')

        // 647 months = 2023-12
        expect(formatMonthString(647, 'Y-M1')).toBe('2023-12')
        expect(formatMonthString(647, 'Y-M2')).toBe('2023-12')

        // 648 months = 2024-01
        expect(formatMonthString(648, 'Y-M1')).toBe('2024-1')
        expect(formatMonthString(648, 'M2-Y')).toBe('01-2024')
      })
    })

    describe('Named month formatting', () => {
      test('should format named months correctly', () => {
        // 0 months = 1970-01 = January 1970
        expect(formatMonthString(0, 'Mf Y')).toBe('January 1970')
        expect(formatMonthString(0, 'Mfl Y')).toBe('january 1970')
        expect(formatMonthString(0, 'Mfu Y')).toBe('JANUARY 1970')
        expect(formatMonthString(0, 'Ms Y')).toBe('Jan 1970')
        expect(formatMonthString(0, 'Msl Y')).toBe('jan 1970')
        expect(formatMonthString(0, 'Msu Y')).toBe('JAN 1970')
      })

      test('should format named months with Y-M order', () => {
        // 11 months = 1970-12 = December 1970
        expect(formatMonthString(11, 'Y Mf')).toBe('1970 December')
        expect(formatMonthString(11, 'Y-Ms')).toBe('1970-Dec')
        expect(formatMonthString(11, 'Y.Msl')).toBe('1970.dec')
      })

      test('should handle all 12 months correctly', () => {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ]

        const shortNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]

        for (let i = 0; i < 12; i++) {
          expect(formatMonthString(i, 'Mf Y')).toBe(`${monthNames[i]} 1970`)
          expect(formatMonthString(i, 'Ms Y')).toBe(`${shortNames[i]} 1970`)
        }
      })
    })

    describe('Error handling for formatMonthString', () => {
      test('should throw error for formats containing day components', () => {
        expect(() => formatMonthString(0, 'Y-M1-D1')).toThrow(
          'Invalid format for month string: day component "D1" not allowed'
        )
        expect(() => formatMonthString(0, 'D2.M2.Y')).toThrow(
          'Invalid format for month string: day component "D2" not allowed'
        )
        expect(() => formatMonthString(0, 'M1 D1, Y')).toThrow(
          'Invalid format for month string: day component "D1" not allowed'
        )
      })

      test('should throw error for invalid format components', () => {
        expect(() => formatMonthString(0, 'Y-X-M1')).toThrow(
          'Invalid format component: "X"'
        )
        expect(() => formatMonthString(0, 'invalid format')).toThrow(
          'Invalid format component'
        )
      })

      test('should throw error for formats without separators', () => {
        expect(() => formatMonthString(0, 'YM1')).toThrow(
          'Invalid format: no recognized separator found'
        )
      })
    })

    describe('Round-trip consistency with months', () => {
      test('should round-trip with parseDateString for year-month formats', () => {
        const testCases = [
          { months: 0, format: 'Y-M1', expectedString: '1970-1' },
          { months: 1, format: 'Y-M2', expectedString: '1970-02' },
          { months: 12, format: 'M1-Y', expectedString: '1-1971' },
          { months: 636, format: 'Y-M1', expectedString: '2023-1' },
          { months: 647, format: 'Y-M1', expectedString: '2023-12' },
          { months: 0, format: 'Mf Y', expectedString: 'January 1970' },
          { months: 11, format: 'Ms Y', expectedString: 'Dec 1970' },
        ]

        testCases.forEach(({ months, format, expectedString }) => {
          // Format months to string
          const formatted = formatMonthString(months, format)
          expect(formatted).toBe(expectedString)

          // Parse the formatted string back
          const parsed = parseDateString(formatted)
          expect(parsed).toHaveLength(1)
          expect(parsed[0].format).toBe(format)
          expect(parsed[0].months).toBe(months)
        })
      })

      test('should handle edge cases in round-trip', () => {
        // Test various edge cases
        const edgeCases = [
          { months: 0, format: 'Y-M2' }, // 1970-01
          { months: 11, format: 'Y-M1' }, // 1970-12
          { months: 12, format: 'Y-M1' }, // 1971-01
          { months: 8, format: 'M2-Y' }, // 1970-09 (will format as "09-1970" and round-trip as M2-Y)
          { months: 600, format: 'Mf Y' }, // 2020-01
        ]

        edgeCases.forEach(({ months, format }) => {
          const formatted = formatMonthString(months, format)
          const parsed = parseDateString(formatted)
          expect(parsed).toHaveLength(1)
          expect(parsed[0].months).toBe(months)
          expect(parsed[0].format).toBe(format)
        })
      })
    })
  })
})
