import { expect, test, describe } from 'bun:test'
import { convertFrom, convertTo } from '../src'
import { TypeInfo } from '../src/utils/types'

describe('Converter Functions with TypeInfo', () => {
  describe('convertFrom function with TypeInfo', () => {
    test('should convert with basic types', () => {
      expect(convertFrom('123', { type: 'decimal' })).toBe(123)
      expect(convertFrom('1010', { type: 'binary' })).toBe(10)
      expect(convertFrom('IV', { type: 'roman' })).toBe(4)
      expect(convertFrom('A', { type: 'latin_letter' })).toBe(1)
      expect(convertFrom('January', { type: 'month_name' })).toBe(1)
      expect(convertFrom('Jan', { type: 'month_name' })).toBe(1)
      expect(convertFrom('Aries', { type: 'astrological_sign' })).toBe(1)
      expect(convertFrom('twenty-one', { type: 'english_words' })).toBe(21)
      expect(convertFrom('一百二十三', { type: 'chinese_words' })).toBe(123)
    })

    test('should convert regardless of case/format properties', () => {
      // Case and format properties shouldn't affect convertFrom
      expect(convertFrom('A', { type: 'latin_letter', case: 'upper' })).toBe(1)
      expect(convertFrom('a', { type: 'latin_letter', case: 'lower' })).toBe(1)
      expect(
        convertFrom('January', {
          type: 'month_name',
          case: 'sentence',
          format: 'long',
        }),
      ).toBe(1)
      expect(
        convertFrom('Jan', {
          type: 'month_name',
          case: 'sentence',
          format: 'short',
        }),
      ).toBe(1)
    })

    test('should work with complex types', () => {
      expect(
        convertFrom('Aries', { type: 'astrological_sign', case: 'sentence' }),
      ).toBe(1)
      expect(
        convertFrom('twenty-one', { type: 'english_words', case: 'lower' }),
      ).toBe(21)
    })

    test('should throw error for invalid TypeInfo', () => {
      expect(() => convertFrom('123', { type: 'invalid' })).toThrow(
        'Cannot convert invalid type',
      )

      expect(() => convertFrom('123', { type: 'empty' })).toThrow(
        'Cannot convert empty type',
      )

      expect(() => convertFrom('123', { type: 'unknown' })).toThrow(
        'Cannot convert unknown type',
      )
    })
  })

  describe('convertTo function with TypeInfo', () => {
    test('should convert with basic types', () => {
      expect(convertTo(123, { type: 'decimal' })).toBe('123')
      expect(convertTo(10, { type: 'binary' })).toBe('1010')
      expect(convertTo(4, { type: 'roman' })).toBe('IV')
    })

    test('should apply case transformations', () => {
      // Latin letters
      expect(convertTo(1, { type: 'latin_letter', case: 'lower' })).toBe('a')
      expect(convertTo(1, { type: 'latin_letter', case: 'upper' })).toBe('A')

      // Greek letters
      expect(convertTo(1, { type: 'greek_letter', case: 'lower' })).toBe('α')
      expect(convertTo(1, { type: 'greek_letter', case: 'upper' })).toBe('Α')

      // Cyrillic letters
      expect(convertTo(1, { type: 'cyrillic_letter', case: 'lower' })).toBe('а')
      expect(convertTo(1, { type: 'cyrillic_letter', case: 'upper' })).toBe('А')
    })

    test('should apply case transformations to words', () => {
      // Astrological signs
      expect(convertTo(1, { type: 'astrological_sign', case: 'lower' })).toBe(
        'aries',
      )
      expect(convertTo(1, { type: 'astrological_sign', case: 'upper' })).toBe(
        'ARIES',
      )
      expect(
        convertTo(1, { type: 'astrological_sign', case: 'sentence' }),
      ).toBe('Aries')

      // NATO phonetic
      expect(convertTo(1, { type: 'nato_phonetic', case: 'lower' })).toBe(
        'alfa',
      )
      expect(convertTo(1, { type: 'nato_phonetic', case: 'upper' })).toBe(
        'ALFA',
      )
      expect(convertTo(1, { type: 'nato_phonetic', case: 'sentence' })).toBe(
        'Alfa',
      )

      // English words
      expect(convertTo(21, { type: 'english_words', case: 'lower' })).toBe(
        'twenty-one',
      )
      expect(convertTo(21, { type: 'english_words', case: 'upper' })).toBe(
        'TWENTY-ONE',
      )
      expect(convertTo(21, { type: 'english_words', case: 'sentence' })).toBe(
        'Twenty-one',
      )
      expect(convertTo(21, { type: 'english_words', case: 'title' })).toBe(
        'Twenty-One',
      )

      // French words
      expect(convertTo(21, { type: 'french_words', case: 'lower' })).toBe(
        'vingt-et-un',
      )
      expect(convertTo(21, { type: 'french_words', case: 'upper' })).toBe(
        'VINGT-ET-UN',
      )
      expect(convertTo(21, { type: 'french_words', case: 'sentence' })).toBe(
        'Vingt-et-un',
      )
      expect(convertTo(21, { type: 'french_words', case: 'title' })).toBe(
        'Vingt-Et-Un',
      )
    })

    test('should apply format for date/time types', () => {
      // Month names
      expect(
        convertTo(1, { type: 'month_name', format: 'long', case: 'sentence' }),
      ).toBe('January')
      expect(
        convertTo(1, { type: 'month_name', format: 'short', case: 'sentence' }),
      ).toBe('Jan')
      expect(
        convertTo(1, { type: 'month_name', format: 'long', case: 'lower' }),
      ).toBe('january')
      expect(
        convertTo(1, { type: 'month_name', format: 'short', case: 'upper' }),
      ).toBe('JAN')

      // Day of week names
      expect(
        convertTo(1, { type: 'day_of_week', format: 'long', case: 'sentence' }),
      ).toBe('Monday')
      expect(
        convertTo(1, {
          type: 'day_of_week',
          format: 'short',
          case: 'sentence',
        }),
      ).toBe('Mon')
      expect(
        convertTo(1, { type: 'day_of_week', format: 'long', case: 'lower' }),
      ).toBe('monday')
      expect(
        convertTo(1, { type: 'day_of_week', format: 'short', case: 'upper' }),
      ).toBe('MON')
    })

    test('should handle hexadecimal case', () => {
      expect(convertTo(255, { type: 'hexadecimal', case: 'lower' })).toBe('ff')
      expect(convertTo(255, { type: 'hexadecimal', case: 'upper' })).toBe('FF')
      expect(convertTo(171, { type: 'hexadecimal', case: 'lower' })).toBe('ab')
      expect(convertTo(171, { type: 'hexadecimal', case: 'upper' })).toBe('AB')
    })

    test('should handle roman numeral case', () => {
      expect(convertTo(4, { type: 'roman', case: 'lower' })).toBe('iv')
      expect(convertTo(4, { type: 'roman', case: 'upper' })).toBe('IV')
      expect(convertTo(1994, { type: 'roman', case: 'lower' })).toBe('mcmxciv')
      expect(convertTo(1994, { type: 'roman', case: 'upper' })).toBe('MCMXCIV')
    })

    test('should handle english cardinal case', () => {
      expect(convertTo(1, { type: 'english_cardinal', case: 'lower' })).toBe(
        '1st',
      )
      expect(convertTo(1, { type: 'english_cardinal', case: 'upper' })).toBe(
        '1ST',
      )
      expect(convertTo(1, { type: 'english_cardinal', case: 'sentence' })).toBe(
        '1st',
      )
      expect(convertTo(2, { type: 'english_cardinal', case: 'lower' })).toBe(
        '2nd',
      )
      expect(convertTo(2, { type: 'english_cardinal', case: 'upper' })).toBe(
        '2ND',
      )
    })

    test('should use defaults when case/format not specified', () => {
      // Should use default behaviors when case/format not specified
      expect(convertTo(1, { type: 'latin_letter' })).toBe('a') // default lowercase
      expect(convertTo(1, { type: 'month_name' })).toBe('January') // default long format
      expect(convertTo(255, { type: 'hexadecimal' })).toBe('ff') // default lowercase
    })
  })

  describe('Round-trip conversions with TypeInfo', () => {
    test('should preserve exact format in round-trips', () => {
      const testCases: Array<{ input: string; typeInfo: TypeInfo }> = [
        { input: 'A', typeInfo: { type: 'latin_letter', case: 'upper' } },
        { input: 'a', typeInfo: { type: 'latin_letter', case: 'lower' } },
        {
          input: 'ARIES',
          typeInfo: { type: 'astrological_sign', case: 'upper' },
        },
        {
          input: 'aries',
          typeInfo: { type: 'astrological_sign', case: 'lower' },
        },
        {
          input: 'January',
          typeInfo: { type: 'month_name', case: 'sentence', format: 'long' },
        },
        {
          input: 'JAN',
          typeInfo: { type: 'month_name', case: 'upper', format: 'short' },
        },
        { input: 'FF', typeInfo: { type: 'hexadecimal', case: 'upper' } },
        { input: 'ff', typeInfo: { type: 'hexadecimal', case: 'lower' } },
        { input: 'IV', typeInfo: { type: 'roman', case: 'upper' } },
        { input: 'iv', typeInfo: { type: 'roman', case: 'lower' } },
        {
          input: 'Twenty-One',
          typeInfo: { type: 'english_words', case: 'title' },
        },
        {
          input: 'twenty-one',
          typeInfo: { type: 'english_words', case: 'lower' },
        },
      ]

      testCases.forEach(({ input, typeInfo }) => {
        const num = convertFrom(input, typeInfo)
        const result = convertTo(num, typeInfo)
        expect(result).toBe(input)
      })
    })

    test('should work with all types that have properties', () => {
      // Test a comprehensive set of types with their properties
      const testData = [
        {
          num: 1,
          typeInfo: { type: 'latin_letter', case: 'upper' } as TypeInfo,
          expected: 'A',
        },
        {
          num: 1,
          typeInfo: { type: 'greek_letter', case: 'lower' } as TypeInfo,
          expected: 'α',
        },
        {
          num: 1,
          typeInfo: { type: 'cyrillic_letter', case: 'upper' } as TypeInfo,
          expected: 'А',
        },
        {
          num: 3,
          typeInfo: {
            type: 'month_name',
            case: 'lower',
            format: 'short',
          } as TypeInfo,
          expected: 'mar',
        },
        {
          num: 0,
          typeInfo: {
            type: 'day_of_week',
            case: 'upper',
            format: 'long',
          } as TypeInfo,
          expected: 'SUNDAY',
        },
        {
          num: 255,
          typeInfo: { type: 'hexadecimal', case: 'upper' } as TypeInfo,
          expected: 'FF',
        },
        {
          num: 9,
          typeInfo: { type: 'roman', case: 'lower' } as TypeInfo,
          expected: 'ix',
        },
        {
          num: 2,
          typeInfo: { type: 'english_cardinal', case: 'sentence' } as TypeInfo,
          expected: '2nd',
        },
        {
          num: 42,
          typeInfo: { type: 'english_words', case: 'title' } as TypeInfo,
          expected: 'Forty-Two',
        },
        {
          num: 33,
          typeInfo: { type: 'french_words', case: 'upper' } as TypeInfo,
          expected: 'TRENTE-TROIS',
        },
        {
          num: 5,
          typeInfo: { type: 'astrological_sign', case: 'sentence' } as TypeInfo,
          expected: 'Leo',
        },
        {
          num: 7,
          typeInfo: { type: 'nato_phonetic', case: 'lower' } as TypeInfo,
          expected: 'golf',
        },
      ]

      testData.forEach(({ num, typeInfo, expected }) => {
        const result = convertTo(num, typeInfo)
        expect(result).toBe(expected)

        // And test round-trip
        const backToNum = convertFrom(result, typeInfo)
        expect(backToNum).toBe(num)
      })
    })
  })

  describe('Error handling with TypeInfo', () => {
    test('should throw meaningful errors', () => {
      expect(() =>
        convertFrom('invalid', { type: 'roman', case: 'upper' }),
      ).toThrow('Failed to convert "invalid" from type "roman"')

      expect(() => convertTo(0, { type: 'roman', case: 'lower' })).toThrow(
        'Failed to convert 0 to type "roman"',
      )

      expect(() => convertTo(123, { type: 'invalid' })).toThrow(
        'Cannot convert to invalid type',
      )
    })
  })
})
