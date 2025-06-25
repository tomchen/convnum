import { expect, test, describe } from 'bun:test'
import { modNoZero, toBasicRange, numeralLength } from '../src/utils/circular'

describe('modNoZero function', () => {
  describe('Basic modular arithmetic', () => {
    test('should work like normal modulo for positive numbers within range', () => {
      expect(modNoZero(5, 10)).toBe(5)
      expect(modNoZero(7, 12)).toBe(7)
      expect(modNoZero(1, 26)).toBe(1)
      expect(modNoZero(25, 26)).toBe(25)
    })

    test('should wrap around for positive numbers larger than modulus', () => {
      expect(modNoZero(13, 12)).toBe(1) // 13 % 12 = 1
      expect(modNoZero(27, 26)).toBe(1) // 27 % 26 = 1
      expect(modNoZero(25, 12)).toBe(1) // 25 % 12 = 1
      expect(modNoZero(52, 26)).toBe(26) // 52 % 26 = 0, but returns 26
    })

    test('should handle zero by returning the modulus', () => {
      expect(modNoZero(0, 12)).toBe(12)
      expect(modNoZero(0, 26)).toBe(26)
      expect(modNoZero(0, 10)).toBe(10)
      expect(modNoZero(0, 1)).toBe(1)
    })

    test('should handle negative numbers correctly', () => {
      expect(modNoZero(-1, 12)).toBe(11) // -1 wraps to second-to-last
      expect(modNoZero(-2, 12)).toBe(10) // -2 wraps to third-to-last
      expect(modNoZero(-12, 12)).toBe(12) // -12 wraps to last
      expect(modNoZero(-13, 12)).toBe(11) // -13 wraps to second-to-last
      expect(modNoZero(-1, 26)).toBe(25)
      expect(modNoZero(-26, 26)).toBe(26)
    })

    test('should handle large negative numbers', () => {
      expect(modNoZero(-25, 12)).toBe(11) // -25 % 12 = -1, adjusted to 11
      expect(modNoZero(-52, 26)).toBe(26) // -52 % 26 = 0, returns 26
      expect(modNoZero(-53, 26)).toBe(25) // -53 % 26 = -1, adjusted to 25
    })
  })

  describe('Edge cases', () => {
    test('should handle modulus of 1', () => {
      expect(modNoZero(0, 1)).toBe(1)
      expect(modNoZero(5, 1)).toBe(1)
      expect(modNoZero(-3, 1)).toBe(1)
    })

    test('should handle exact multiples', () => {
      expect(modNoZero(24, 12)).toBe(12) // 24 % 12 = 0, returns 12
      expect(modNoZero(36, 12)).toBe(12) // 36 % 12 = 0, returns 12
      expect(modNoZero(78, 26)).toBe(26) // 78 % 26 = 0, returns 26
    })

    test('should work with decimal results that become integers', () => {
      expect(modNoZero(15, 7)).toBe(1) // 15 % 7 = 1
      expect(modNoZero(22, 7)).toBe(1) // 22 % 7 = 1
      expect(modNoZero(21, 7)).toBe(7) // 21 % 7 = 0, returns 7
    })
  })

  describe('Mathematical properties', () => {
    test('should maintain the property that result is always between 1 and modulus (inclusive)', () => {
      const testCases = [
        { n: -100, m: 12 },
        { n: -1, m: 12 },
        { n: 0, m: 12 },
        { n: 1, m: 12 },
        { n: 12, m: 12 },
        { n: 13, m: 12 },
        { n: 100, m: 12 },
      ]

      testCases.forEach(({ n, m }) => {
        const result = modNoZero(n, m)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(m)
      })
    })

    test('should be consistent for equivalent inputs', () => {
      // n and n + m should give same result
      expect(modNoZero(5, 12)).toBe(modNoZero(5 + 12, 12))
      expect(modNoZero(5, 12)).toBe(modNoZero(5 + 24, 12))
      expect(modNoZero(-1, 12)).toBe(modNoZero(-1 + 12, 12))
      expect(modNoZero(-1, 12)).toBe(modNoZero(-1 + 24, 12))
    })
  })
})

describe('toBasicRange function', () => {
  describe('Basic functionality', () => {
    test('should handle numbers within valid range', () => {
      expect(toBasicRange(1, 'latin_letter')).toBe(1)
      expect(toBasicRange(26, 'latin_letter')).toBe(26)
      expect(toBasicRange(5, 'astrological_sign')).toBe(5)
      expect(toBasicRange(12, 'astrological_sign')).toBe(12)
      expect(toBasicRange(1, 'chinese_heavenly_stem')).toBe(1)
      expect(toBasicRange(10, 'chinese_heavenly_stem')).toBe(10)
    })

    test('should wrap numbers greater than range', () => {
      expect(toBasicRange(27, 'latin_letter')).toBe(1) // 27 % 26 = 1
      expect(toBasicRange(52, 'latin_letter')).toBe(26) // 52 % 26 = 0 -> 26
      expect(toBasicRange(53, 'latin_letter')).toBe(1) // 53 % 26 = 1

      expect(toBasicRange(13, 'astrological_sign')).toBe(1) // 13 % 12 = 1
      expect(toBasicRange(25, 'astrological_sign')).toBe(1) // 25 % 12 = 1
      expect(toBasicRange(24, 'astrological_sign')).toBe(12) // 24 % 12 = 0 -> 12

      expect(toBasicRange(11, 'chinese_heavenly_stem')).toBe(1) // 11 % 10 = 1
      expect(toBasicRange(20, 'chinese_heavenly_stem')).toBe(10) // 20 % 10 = 0 -> 10
    })

    test('should handle zero by wrapping to end', () => {
      expect(toBasicRange(0, 'latin_letter')).toBe(26)
      expect(toBasicRange(0, 'astrological_sign')).toBe(12)
      expect(toBasicRange(0, 'chinese_heavenly_stem')).toBe(10)
      expect(toBasicRange(0, 'greek_letter')).toBe(24)
      expect(toBasicRange(0, 'day_of_week')).toBe(7)
    })

    test('should handle negative numbers by wrapping backwards', () => {
      expect(toBasicRange(-1, 'latin_letter')).toBe(25) // wraps to second-to-last
      expect(toBasicRange(-2, 'latin_letter')).toBe(24) // wraps to third-to-last
      expect(toBasicRange(-26, 'latin_letter')).toBe(26) // wraps to last
      expect(toBasicRange(-27, 'latin_letter')).toBe(25) // wraps to second-to-last

      expect(toBasicRange(-1, 'astrological_sign')).toBe(11)
      expect(toBasicRange(-12, 'astrological_sign')).toBe(12)
      expect(toBasicRange(-13, 'astrological_sign')).toBe(11)
    })
  })

  describe('All numeral types', () => {
    test('should work with all defined numeral types', () => {
      const typesToTest = [
        'latin_letter',
        'greek_letter',
        'month_name',
        'day_of_week',
        'roman',
        'chinese_heavenly_stem',
        'chinese_earthly_branch',
        'chinese_solar_term',
        'cyrillic_letter',
        'astrological_sign',
        'nato_phonetic',
      ] as const

      typesToTest.forEach((numType) => {
        const length = numeralLength[numType]!

        // Test basic range
        expect(toBasicRange(1, numType)).toBe(1)
        expect(toBasicRange(length, numType)).toBe(length)

        // Test circular (length + 1 should wrap to 1)
        expect(toBasicRange(length + 1, numType)).toBe(1)

        // Test zero wraps to end
        expect(toBasicRange(0, numType)).toBe(length)

        // Test negative wraps backwards
        expect(toBasicRange(-1, numType)).toBe(length - 1)
      })
    })
  })

  describe('Error handling', () => {
    test('should throw error for non-integer input', () => {
      expect(() => toBasicRange(1.5, 'latin_letter')).toThrow(
        'Input must be an integer',
      )
      expect(() => toBasicRange(2.7, 'astrological_sign')).toThrow(
        'Input must be an integer',
      )
      expect(() => toBasicRange(NaN, 'latin_letter')).toThrow(
        'Input must be an integer',
      )
      expect(() => toBasicRange(Infinity, 'latin_letter')).toThrow(
        'Input must be an integer',
      )
      expect(() => toBasicRange(-Infinity, 'latin_letter')).toThrow(
        'Input must be an integer',
      )
    })

    test('should throw error for types without defined length', () => {
      expect(() => toBasicRange(1, 'decimal')).toThrow(
        'does not have a defined length',
      )
      expect(() => toBasicRange(1, 'binary')).toThrow(
        'does not have a defined length',
      )
      expect(() => toBasicRange(1, 'hexadecimal')).toThrow(
        'does not have a defined length',
      )
      expect(() => toBasicRange(1, 'invalid')).toThrow(
        'does not have a defined length',
      )
      expect(() => toBasicRange(1, 'empty')).toThrow(
        'does not have a defined length',
      )
      expect(() => toBasicRange(1, 'unknown')).toThrow(
        'does not have a defined length',
      )
    })
  })

  describe('Practical examples and edge cases', () => {
    test('should handle large numbers correctly', () => {
      expect(toBasicRange(1000, 'latin_letter')).toBe(12) // 1000 % 26 = 12
      expect(toBasicRange(9999, 'astrological_sign')).toBe(3) // 9999 % 12 = 3
    })

    test('should handle large negative numbers correctly', () => {
      expect(toBasicRange(-1000, 'latin_letter')).toBe(14) // (-1000 % 26 + 26) % 26 = 14
      expect(toBasicRange(-9999, 'astrological_sign')).toBe(9) // (-9999 % 12 + 12) % 12 = 9
    })

    test('should be consistent with modNoZero behavior', () => {
      const testNumbers = [-50, -1, 0, 1, 13, 27, 100]
      const testTypes = [
        'latin_letter',
        'astrological_sign',
        'chinese_heavenly_stem',
      ] as const

      testTypes.forEach((type) => {
        const length = numeralLength[type]!
        testNumbers.forEach((num) => {
          expect(toBasicRange(num, type)).toBe(modNoZero(num, length))
        })
      })
    })

    test('should handle calendar-like use cases', () => {
      // Day of week examples (7 days)
      expect(toBasicRange(8, 'day_of_week')).toBe(1) // Next week's Monday
      expect(toBasicRange(14, 'day_of_week')).toBe(7) // Two weeks later's Sunday
      expect(toBasicRange(-1, 'day_of_week')).toBe(6) // Yesterday from Sunday

      // Month examples (12 months)
      expect(toBasicRange(13, 'month_name')).toBe(1) // Next year's January
      expect(toBasicRange(24, 'month_name')).toBe(12) // Two years later's December
      expect(toBasicRange(-1, 'month_name')).toBe(11) // Previous year's November
    })

    test('should handle alphabet-like use cases', () => {
      // Latin alphabet (26 letters)
      expect(toBasicRange(27, 'latin_letter')).toBe(1) // A after Z
      expect(toBasicRange(52, 'latin_letter')).toBe(26) // Z of second cycle
      expect(toBasicRange(-1, 'latin_letter')).toBe(25) // Y before A

      // Greek alphabet (24 letters)
      expect(toBasicRange(25, 'greek_letter')).toBe(1) // α after ω
      expect(toBasicRange(48, 'greek_letter')).toBe(24) // ω of second cycle
    })
  })
})
