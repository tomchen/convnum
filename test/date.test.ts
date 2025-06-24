import { expect, test, describe } from 'bun:test'
import { parseDateString, formatDateString } from '../src/utils/date'

describe('Date string parsing and formatting', () => {
  describe('parseDateString function', () => {
    describe('Y-M-D format variants', () => {
      test('should parse Y-M1-D1 format with dash separator', () => {
        const result = parseDateString('2023-12-25')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Y-M1-D1')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse ambiguous Y-M2-D2 format with multiple interpretations', () => {
        const result = parseDateString('2023-01-05')
        expect(result.interpretations).toHaveLength(2)

        // Should detect both possible interpretations
        const formats = result.interpretations.map(i => i.format)
        expect(formats).toContain('Y-M2-D2') // January 5th
        expect(formats).toContain('Y-D2-M2') // May 1st

        // Check timestamps correspond to different dates
        const timestamps = result.interpretations.map(i => i.timestamp)
        expect(timestamps).toContain(new Date(2023, 0, 5).getTime()) // Jan 5
        expect(timestamps).toContain(new Date(2023, 4, 1).getTime()) // May 1
      })

      test('should parse Y-M1-D1 format with dot separator', () => {
        const result = parseDateString('2023.12.25')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Y.M1.D1')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse Y-M1-D1 format with slash separator', () => {
        const result = parseDateString('2023/12/25')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Y/M1/D1')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse Y-M1-D1 format with comma separator', () => {
        const result = parseDateString('2023,12,25')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Y,M1,D1')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })
    })

    describe('D-M-Y format variants', () => {
      test('should parse D1-M1-Y format', () => {
        const result = parseDateString('25-12-2023')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('D1-M1-Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse ambiguous D2.M2.Y format with multiple interpretations', () => {
        const result = parseDateString('05.01.2023')
        expect(result.interpretations).toHaveLength(2)

        const formats = result.interpretations.map(i => i.format)
        expect(formats).toContain('M2.D2.Y') // May 1st
        expect(formats).toContain('D2.M2.Y') // January 5th

        const timestamps = result.interpretations.map(i => i.timestamp)
        expect(timestamps).toContain(new Date(2023, 4, 1).getTime()) // May 1
        expect(timestamps).toContain(new Date(2023, 0, 5).getTime()) // Jan 5
      })

      test('should parse unambiguous D1/M1/Y format', () => {
        const result = parseDateString('31/1/2023')
        expect(result.interpretations).toHaveLength(1) // Only one interpretation (31 can't be month)
        expect(result.interpretations[0].format).toBe('D1/M1/Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 0, 31))
      })
    })

    describe('M-D-Y format variants', () => {
      test('should parse unambiguous M1-D1-Y format', () => {
        const result = parseDateString('12-25-2023')
        expect(result.interpretations).toHaveLength(1) // Only one interpretation (25 can't be month)
        expect(result.interpretations[0].format).toBe('M1-D1-Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse ambiguous M2/D2/Y format with multiple interpretations', () => {
        const result = parseDateString('01/05/2023')
        expect(result.interpretations).toHaveLength(2)

        const formats = result.interpretations.map(i => i.format)
        expect(formats).toContain('M2/D2/Y') // January 5th
        expect(formats).toContain('D2/M2/Y') // May 1st

        const timestamps = result.interpretations.map(i => i.timestamp)
        expect(timestamps).toContain(new Date(2023, 0, 5).getTime()) // Jan 5
        expect(timestamps).toContain(new Date(2023, 4, 1).getTime()) // May 1
      })
    })

    describe('Y-M format (no day)', () => {
      test('should parse Y-M1 format and default day to 1', () => {
        const result = parseDateString('2023-12')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Y-M1')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 1))
      })

      test('should parse Y.M2 format and default day to 1', () => {
        const result = parseDateString('2023.01')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Y.M2')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 0, 1))
      })
    })

    describe('M-Y format (no day)', () => {
      test('should parse M1-Y format and default day to 1', () => {
        const result = parseDateString('12-2023')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('M1-Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 1))
      })

      test('should parse M2/Y format and default day to 1', () => {
        const result = parseDateString('01/2023')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('M2/Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 0, 1))
      })
    })

    describe('M-D format (no year)', () => {
      test('should parse unambiguous M1-D1 format and default year to 1970', () => {
        const result = parseDateString('12-25')
        expect(result.interpretations).toHaveLength(1) // Only one interpretation (25 can't be month)
        expect(result.interpretations[0].format).toBe('M1-D1')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(1970, 11, 25))
      })

      test('should parse ambiguous M2.D2 format and default year to 1970', () => {
        const result = parseDateString('01.05')
        expect(result.interpretations).toHaveLength(2)

        const formats = result.interpretations.map(i => i.format)
        expect(formats).toContain('M2.D2') // January 5th
        expect(formats).toContain('D2.M2') // May 1st

        const timestamps = result.interpretations.map(i => i.timestamp)
        expect(timestamps).toContain(new Date(1970, 0, 5).getTime()) // Jan 5
        expect(timestamps).toContain(new Date(1970, 4, 1).getTime()) // May 1
      })
    })

    describe('D-M format (no year)', () => {
      test('should parse unambiguous D1-M1 format and default year to 1970', () => {
        const result = parseDateString('25-12')
        expect(result.interpretations).toHaveLength(1) // Only one interpretation (25 can't be month)
        expect(result.interpretations[0].format).toBe('D1-M1')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(1970, 11, 25))
      })

      test('should parse ambiguous D2/M2 format and default year to 1970', () => {
        const result = parseDateString('05/01')
        expect(result.interpretations).toHaveLength(2)

        const formats = result.interpretations.map(i => i.format)
        expect(formats).toContain('M2/D2') // January 5th
        expect(formats).toContain('D2/M2') // May 1st

        const timestamps = result.interpretations.map(i => i.timestamp)
        expect(timestamps).toContain(new Date(1970, 0, 5).getTime()) // Jan 5
        expect(timestamps).toContain(new Date(1970, 4, 1).getTime()) // May 1
      })
    })

    describe('Month name formats', () => {
      test('should parse full month names (Mf)', () => {
        const result = parseDateString('December 25, 2023')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Mf D1, Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse lowercase full month names (Mfl)', () => {
        const result = parseDateString('december 25, 2023')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Mfl D1, Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse uppercase full month names (Mfu)', () => {
        const result = parseDateString('DECEMBER 25, 2023')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Mfu D1, Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse short month names (Ms)', () => {
        const result = parseDateString('Dec 25, 2023')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Ms D1, Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse lowercase short month names (Msl)', () => {
        const result = parseDateString('dec 25, 2023')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Msl D1, Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse uppercase short month names (Msu)', () => {
        const result = parseDateString('DEC 25, 2023')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Msu D1, Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should parse month names in Y-M format', () => {
        const result = parseDateString('2023-December')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Y-Mf')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 1))
      })

      test('should parse month names in M-Y format', () => {
        const result = parseDateString('January-2023')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Mf-Y')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 0, 1))
      })
    })

    describe('Edge cases and validation', () => {
      test('should handle leap year dates', () => {
        const result = parseDateString('2024-02-29')
        expect(result.interpretations.length).toBeGreaterThan(0)

        // Find the interpretation for Feb 29 (Y-M2-D1 format)
        const feb29Interp = result.interpretations.find(i => i.format === 'Y-M2-D1')
        expect(feb29Interp).toBeDefined()
        expect(new Date(feb29Interp!.timestamp)).toEqual(new Date(2024, 1, 29))
      })

      test('should reject invalid dates', () => {
        expect(() => parseDateString('2023-02-29')).toThrow('Unable to parse date string')
        expect(() => parseDateString('2023-13-15')).toThrow('Unable to parse date string')
        expect(() => parseDateString('2023-12-32')).toThrow('Unable to parse date string')
      })

      test('should reject invalid month names', () => {
        expect(() => parseDateString('Decembor 25, 2023')).toThrow('Unable to parse date string')
        expect(() => parseDateString('13th 25, 2023')).toThrow('Unable to parse date string')
      })

      test('should handle whitespace', () => {
        const result = parseDateString('  2023-12-25  ')
        expect(result.interpretations).toHaveLength(1)
        expect(result.interpretations[0].format).toBe('Y-M1-D1')
        expect(new Date(result.interpretations[0].timestamp)).toEqual(new Date(2023, 11, 25))
      })

      test('should reject invalid formats', () => {
        expect(() => parseDateString('invalid-date')).toThrow('Unable to parse date string')
        expect(() => parseDateString('2023')).toThrow('Unable to parse date string')
        expect(() => parseDateString('2023-12-25-extra')).toThrow('Unable to parse date string')
      })
    })
  })

  describe('formatDateString function', () => {
    const testTimestamp = new Date(2023, 11, 25).getTime() // December 25, 2023

    describe('Y-M-D format variants', () => {
      test('should format Y-M1-D1 with dash separator', () => {
        const result = formatDateString(testTimestamp, 'Y-M1-D1')
        expect(result).toBe('2023-12-25')
      })

      test('should format Y-M2-D2 with dash separator', () => {
        const result = formatDateString(testTimestamp, 'Y-M2-D2')
        expect(result).toBe('2023-12-25')
      })

      test('should format with dot separator', () => {
        const result = formatDateString(testTimestamp, 'Y.M1.D1')
        expect(result).toBe('2023.12.25')
      })

      test('should format with slash separator', () => {
        const result = formatDateString(testTimestamp, 'Y/M1/D1')
        expect(result).toBe('2023/12/25')
      })

      test('should format with comma separator', () => {
        const result = formatDateString(testTimestamp, 'Y,M1,D1')
        expect(result).toBe('2023,12,25')
      })
    })

    describe('D-M-Y format variants', () => {
      test('should format D1-M1-Y', () => {
        const result = formatDateString(testTimestamp, 'D1-M1-Y')
        expect(result).toBe('25-12-2023')
      })

      test('should format D2.M2.Y', () => {
        const result = formatDateString(testTimestamp, 'D2.M2.Y')
        expect(result).toBe('25.12.2023')
      })
    })

    describe('M-D-Y format variants', () => {
      test('should format M1-D1-Y', () => {
        const result = formatDateString(testTimestamp, 'M1-D1-Y')
        expect(result).toBe('12-25-2023')
      })

      test('should format M2/D2/Y', () => {
        const result = formatDateString(testTimestamp, 'M2/D2/Y')
        expect(result).toBe('12/25/2023')
      })
    })

    describe('Y-M format (no day)', () => {
      test('should format Y-M1', () => {
        const result = formatDateString(testTimestamp, 'Y-M1')
        expect(result).toBe('2023-12')
      })

      test('should format Y.M2', () => {
        const result = formatDateString(testTimestamp, 'Y.M2')
        expect(result).toBe('2023.12')
      })
    })

    describe('M-Y format (no day)', () => {
      test('should format M1-Y', () => {
        const result = formatDateString(testTimestamp, 'M1-Y')
        expect(result).toBe('12-2023')
      })

      test('should format M2/Y', () => {
        const result = formatDateString(testTimestamp, 'M2/Y')
        expect(result).toBe('12/2023')
      })
    })

    describe('Month name formats', () => {
      test('should format full month names (Mf)', () => {
        const result = formatDateString(testTimestamp, 'Mf D1, Y')
        expect(result).toBe('December 25, 2023')
      })

      test('should format lowercase full month names (Mfl)', () => {
        const result = formatDateString(testTimestamp, 'Mfl D1, Y')
        expect(result).toBe('december 25, 2023')
      })

      test('should format uppercase full month names (Mfu)', () => {
        const result = formatDateString(testTimestamp, 'Mfu D1, Y')
        expect(result).toBe('DECEMBER 25, 2023')
      })

      test('should format short month names (Ms)', () => {
        const result = formatDateString(testTimestamp, 'Ms D1, Y')
        expect(result).toBe('Dec 25, 2023')
      })

      test('should format lowercase short month names (Msl)', () => {
        const result = formatDateString(testTimestamp, 'Msl D1, Y')
        expect(result).toBe('dec 25, 2023')
      })

      test('should format uppercase short month names (Msu)', () => {
        const result = formatDateString(testTimestamp, 'Msu D1, Y')
        expect(result).toBe('DEC 25, 2023')
      })
    })

    describe('Day format variants', () => {
      test('should format D1 (no padding)', () => {
        const timestamp = new Date(2023, 0, 5).getTime() // January 5, 2023
        const result = formatDateString(timestamp, 'Y-M1-D1')
        expect(result).toBe('2023-1-5')
      })

      test('should format D2 (zero padding)', () => {
        const timestamp = new Date(2023, 0, 5).getTime() // January 5, 2023
        const result = formatDateString(timestamp, 'Y-M2-D2')
        expect(result).toBe('2023-01-05')
      })
    })

    describe('Error handling', () => {
      test('should throw error for invalid format', () => {
        expect(() => formatDateString(testTimestamp, 'invalid-format')).toThrow('Invalid format')
      })

      test('should throw error for unknown format component', () => {
        expect(() => formatDateString(testTimestamp, 'Y-X-D1')).toThrow('Invalid format component')
      })

      test('should throw error for invalid day format', () => {
        expect(() => formatDateString(testTimestamp, 'Y-M1-D3')).toThrow('Invalid day format')
      })
    })
  })

  describe('Round-trip conversion', () => {
    describe('Unambiguous formats', () => {
      const unambiguousTestCases = [
        '2023-12-25',   // M1=12, D1=25 (only one interpretation)
        '25.12.2023',   // D1=25, M1=12 (only one interpretation)
        '12/25/2023',   // M1=12, D1=25 (only one interpretation)
        '2023-12',      // Y-M format
        '12-2023',      // M-Y format
        '25-12',        // D1=25, M1=12 (only one interpretation)
        'December 25, 2023', // Month names
        'Dec 25, 2023',
        'december 25, 2023',
        'DECEMBER 25, 2023',
        '2024-02-29',   // leap year
      ]

      unambiguousTestCases.forEach((dateStr) => {
        test(`should round-trip correctly for unambiguous "${dateStr}"`, () => {
          const parsed = parseDateString(dateStr)
          expect(parsed.interpretations.length).toBe(1) // Should have only one interpretation
          const interpretation = parsed.interpretations[0]
          const formatted = formatDateString(interpretation.timestamp, interpretation.format)
          expect(formatted).toBe(dateStr)
        })
      })
    })

    describe('Ambiguous formats', () => {
      const ambiguousTestCases = [
        {
          input: '2023-01-05',
          expectedFormats: ['Y-M2-D2', 'Y-D2-M2'],
          expectedDates: [new Date(2023, 0, 5), new Date(2023, 4, 1)]
        },
        {
          input: '05.01.2023',
          expectedFormats: ['M2.D2.Y', 'D2.M2.Y'],
          expectedDates: [new Date(2023, 0, 5), new Date(2023, 4, 1)]
        },
        {
          input: '01/05/2023',
          expectedFormats: ['M2/D2/Y', 'D2/M2/Y'],
          expectedDates: [new Date(2023, 0, 5), new Date(2023, 4, 1)]
        },
        {
          input: '01.05',
          expectedFormats: ['M2.D2', 'D2.M2'],
          expectedDates: [new Date(1970, 0, 5), new Date(1970, 4, 1)]
        },
        {
          input: '05/01',
          expectedFormats: ['M2/D2', 'D2/M2'],
          expectedDates: [new Date(1970, 0, 5), new Date(1970, 4, 1)]
        },
      ]

      ambiguousTestCases.forEach(({ input, expectedFormats, expectedDates }) => {
        test(`should detect multiple interpretations for "${input}"`, () => {
          const parsed = parseDateString(input)
          expect(parsed.interpretations.length).toBe(2)

          const formats = parsed.interpretations.map(i => i.format)
          const timestamps = parsed.interpretations.map(i => i.timestamp)

          expectedFormats.forEach(format => expect(formats).toContain(format))
          expectedDates.forEach(date => expect(timestamps).toContain(date.getTime()))

          // Test round-trip for each interpretation
          for (const interpretation of parsed.interpretations) {
            const formatted = formatDateString(interpretation.timestamp, interpretation.format)
            // The formatted result should be parseable and contain the same interpretation
            const reparsed = parseDateString(formatted)
            const matchingInterp = reparsed.interpretations.find(i =>
              i.format === interpretation.format && i.timestamp === interpretation.timestamp
            )
            expect(matchingInterp).toBeDefined()
          }
        })
      })
    })
  })

  describe('Integration with various timestamps', () => {
        test('should handle Unix epoch', () => {
      const result = parseDateString('1970-01-01')
      expect(result.interpretations.length).toBeGreaterThan(0)

      // Should include the Unix epoch interpretation (Jan 1, 1970)
      const epochInterp = result.interpretations.find(i => i.timestamp === 0)
      expect(epochInterp).toBeDefined()

      const formatted = formatDateString(0, 'Y-M1-D1')
      expect(formatted).toBe('1970-1-1')
    })

    test('should handle different years', () => {
      const testCases = [
        { input: '2000-01-01', year: 2000 },
        { input: '1999-12-31', year: 1999 },
        { input: '2024-06-15', year: 2024 },
      ]

      testCases.forEach(({ input, year }) => {
        const result = parseDateString(input)
        expect(result.interpretations.length).toBeGreaterThan(0)
        // At least one interpretation should have the expected year
        const hasExpectedYear = result.interpretations.some(i =>
          new Date(i.timestamp).getFullYear() === year
        )
        expect(hasExpectedYear).toBe(true)
      })
    })

    test('should handle all months', () => {
      for (let month = 1; month <= 12; month++) {
        const dateStr = `2023-${month.toString().padStart(2, '0')}-15`
        const result = parseDateString(dateStr)
        expect(result.interpretations.length).toBeGreaterThan(0)

        // At least one interpretation should have the expected month
        const hasExpectedMonth = result.interpretations.some(i =>
          new Date(i.timestamp).getMonth() === month - 1
        )
        expect(hasExpectedMonth).toBe(true)
      }
    })

    test('should demonstrate practical ambiguity resolution', () => {
      // Example: 2023-01-05 could be Jan 5th or May 1st
      const result = parseDateString('2023-01-05')
      expect(result.interpretations).toHaveLength(2)

      const formats = result.interpretations.map(i => i.format)
      expect(formats).toContain('Y-M2-D2') // Jan 5th interpretation
      expect(formats).toContain('Y-D2-M2') // May 1st interpretation

      // Each interpretation should have different timestamps
      const jan5Interp = result.interpretations.find(i => i.format === 'Y-M2-D2')
      const may1Interp = result.interpretations.find(i => i.format === 'Y-D2-M2')

      expect(jan5Interp).toBeDefined()
      expect(may1Interp).toBeDefined()
      expect(jan5Interp!.timestamp).not.toBe(may1Interp!.timestamp)

      expect(new Date(jan5Interp!.timestamp)).toEqual(new Date(2023, 0, 5)) // Jan 5th
      expect(new Date(may1Interp!.timestamp)).toEqual(new Date(2023, 4, 1)) // May 1st
    })
  })
})
