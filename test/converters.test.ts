/* eslint-disable compat/compat */
import { expect, test, describe } from 'bun:test'
import { convertFrom, convertTo, typeFromFns, typeToFns } from '../src'
import {
  NumType,
  VALID_NUM_TYPES,
  TypeInfo,
  CaseType,
  FormatType,
  PrefixType,
  ZhstType,
} from '../src/utils/types'

// Helper function to create TypeInfo objects for easier testing
function typeInfo(
  type: NumType,
  caseType?: CaseType,
  format?: FormatType,
  prefix?: PrefixType,
  zhst?: ZhstType,
): TypeInfo {
  const info: TypeInfo = { type }
  if (caseType !== undefined) info.case = caseType
  if (format !== undefined) info.format = format
  if (prefix !== undefined) info.prefix = prefix
  if (zhst !== undefined) info.zhst = zhst
  return info
}

describe('Converter Functions', () => {
  describe('typeFromFns and typeToFns mappings', () => {
    test('should have the same keys in both mappings', () => {
      const fromKeys = Object.keys(typeFromFns).sort()
      const toKeys = Object.keys(typeToFns).sort()
      expect(fromKeys).toEqual(toKeys)
    })

    test('should have all expected types', () => {
      const expectedTypes = [
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
        'roman',
        'arabic',
        'english_cardinal',
        'english_words',
        'french_words',
        'chinese_words',
        'chinese_financial',
        'chinese_heavenly_stem',
        'chinese_earthly_branch',
        'chinese_solar_term',
        'astrological_sign',
        'nato_phonetic',
        'month_name',
        'day_of_week',
        'latin_letter',
        'greek_letter',
        'cyrillic_letter',
        'invalid',
        'empty',
        'unknown',
      ].sort()

      const actualTypes = Object.keys(typeFromFns).sort()
      expect(actualTypes).toEqual(expectedTypes)
    })

    test('should have all valid types in VALID_NUM_TYPES', () => {
      const expectedValidTypes = [
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
        'roman',
        'arabic',
        'english_cardinal',
        'english_words',
        'french_words',
        'chinese_words',
        'chinese_financial',
        'chinese_heavenly_stem',
        'chinese_earthly_branch',
        'chinese_solar_term',
        'astrological_sign',
        'nato_phonetic',
        'month_name',
        'day_of_week',
        'latin_letter',
        'greek_letter',
        'cyrillic_letter',
      ] as NumType[]

      const actualValidTypes = VALID_NUM_TYPES.sort()
      expect(actualValidTypes).toEqual(expectedValidTypes.sort())
    })
  })

  describe('convertFrom function', () => {
    test('should convert decimal strings', () => {
      expect(convertFrom('123', typeInfo('decimal'))).toBe(123)
      expect(convertFrom('-45.67', typeInfo('decimal'))).toBe(-45.67)
    })

    test('should convert binary strings', () => {
      expect(convertFrom('1010', typeInfo('binary'))).toBe(10)
      expect(convertFrom('11111111', typeInfo('binary'))).toBe(255)
    })

    test('should convert Roman numerals', () => {
      expect(convertFrom('IV', typeInfo('roman'))).toBe(4)
      expect(convertFrom('MMMCMXCIX', typeInfo('roman'))).toBe(3999)
    })

    test('should convert English words', () => {
      expect(convertFrom('one', typeInfo('english_words'))).toBe(1)
      expect(convertFrom('twenty-one', typeInfo('english_words'))).toBe(21)
    })

    test('should convert as long as valid for that type and regardless of caseType, format, prefix, zhst', () => {
      expect(convertFrom('oNE', typeInfo('english_words'))).toBe(1)
      expect(convertFrom('jAn', typeInfo('month_name'))).toBe(1)
      expect(convertFrom('jAnuaRY', typeInfo('month_name'))).toBe(1)
      expect(convertFrom('0X0003', typeInfo('hexadecimal'))).toBe(3)
      expect(convertFrom('0003', typeInfo('hexadecimal'))).toBe(3)
    })

    test('should convert Chinese words', () => {
      expect(convertFrom('一', typeInfo('chinese_words'))).toBe(1)
      expect(convertFrom('一百二十三', typeInfo('chinese_words'))).toBe(123)
    })

    test('should throw error for unsupported types', () => {
      expect(() =>
        convertFrom('123', typeInfo('unsupported_type' as unknown as NumType)),
      ).toThrow('Unsupported type: unsupported_type')
    })

    test('should throw error for invalid conversions', () => {
      expect(() => convertFrom('invalid', typeInfo('roman'))).toThrow(
        'Failed to convert "invalid" from type "roman"',
      )
    })

    test('should throw error for special types', () => {
      expect(() => convertFrom('123', typeInfo('invalid'))).toThrow(
        'Cannot convert invalid type',
      )
      expect(() => convertFrom('123', typeInfo('empty'))).toThrow(
        'Cannot convert empty type',
      )
      expect(() => convertFrom('123', typeInfo('unknown'))).toThrow(
        'Cannot convert unknown type',
      )
    })
  })

  describe('convertTo function', () => {
    test('should convert to decimal strings', () => {
      expect(convertTo(123, typeInfo('decimal'))).toBe('123')
      expect(convertTo(-45.67, typeInfo('decimal'))).toBe('-45.67')
    })

    test('should convert to binary strings', () => {
      expect(convertTo(10, typeInfo('binary'))).toBe('1010')
      expect(convertTo(255, typeInfo('binary'))).toBe('11111111')
    })

    test('should convert to Roman numerals', () => {
      expect(convertTo(4, typeInfo('roman'))).toBe('IV')
      expect(convertTo(3999, typeInfo('roman'))).toBe('MMMCMXCIX')
    })

    test('should convert to English words', () => {
      expect(convertTo(1, typeInfo('english_words'))).toBe('one')
      expect(convertTo(21, typeInfo('english_words'))).toBe('twenty-one')
    })

    test('should convert to Chinese words', () => {
      expect(convertTo(1, typeInfo('chinese_words'))).toBe('一')
      expect(convertTo(123, typeInfo('chinese_words'))).toBe('一百二十三')
    })

    test('should throw error for unsupported types', () => {
      expect(() =>
        convertTo(123, typeInfo('unsupported_type' as unknown as NumType)),
      ).toThrow('Unsupported type: unsupported_type')
    })

    test('should throw error for invalid conversions', () => {
      expect(() => convertTo(0, typeInfo('roman'))).toThrow(
        'Failed to convert 0 to type "roman"',
      )
    })

    test('should throw error for special types', () => {
      expect(() => convertTo(123, typeInfo('invalid'))).toThrow(
        'Cannot convert to invalid type',
      )
      expect(() => convertTo(123, typeInfo('empty'))).toThrow(
        'Cannot convert to empty type',
      )
      expect(() => convertTo(123, typeInfo('unknown'))).toThrow(
        'Cannot convert to unknown type',
      )
    })

    // Circular functionality is tested in circular.test.ts
  })

  describe('Round-trip conversions', () => {
    test('should work for decimal', () => {
      const original = 123.45
      const converted = convertTo(original, typeInfo('decimal'))
      const back = convertFrom(converted, typeInfo('decimal'))
      expect(back).toBe(original)
    })

    test('should work for binary', () => {
      const original = 42
      const converted = convertTo(original, typeInfo('binary'))
      const back = convertFrom(converted, typeInfo('binary'))
      expect(back).toBe(original)
    })

    test('should work for English words', () => {
      const original = 123
      const converted = convertTo(original, typeInfo('english_words'))
      const back = convertFrom(converted, typeInfo('english_words'))
      expect(back).toBe(original)
    })

    test('should work for Chinese words', () => {
      const original = 456
      const converted = convertTo(original, typeInfo('chinese_words'))
      const back = convertFrom(converted, typeInfo('chinese_words'))
      expect(back).toBe(original)
    })
  })

  describe('Case and format functionality', () => {
    test('should handle case parameters', () => {
      expect(convertTo(10, typeInfo('hexadecimal', 'upper'))).toBe('A')
      expect(convertTo(10, typeInfo('hexadecimal', 'lower'))).toBe('a')
      expect(convertTo(4, typeInfo('roman', 'upper'))).toBe('IV')
      expect(convertTo(4, typeInfo('roman', 'lower'))).toBe('iv')
    })

    test('should handle format parameters', () => {
      expect(convertTo(1, typeInfo('month_name', 'sentence', 'long'))).toBe(
        'January',
      )
      expect(convertTo(1, typeInfo('month_name', 'sentence', 'short'))).toBe(
        'Jan',
      )
      expect(convertTo(0, typeInfo('day_of_week', 'sentence', 'long'))).toBe(
        'Sunday',
      )
      expect(convertTo(0, typeInfo('day_of_week', 'sentence', 'short'))).toBe(
        'Sun',
      )
    })

    test('should handle case with words', () => {
      expect(convertTo(21, typeInfo('english_words', 'lower'))).toBe(
        'twenty-one',
      )
      expect(convertTo(21, typeInfo('english_words', 'upper'))).toBe(
        'TWENTY-ONE',
      )
      expect(convertTo(21, typeInfo('english_words', 'title'))).toBe(
        'Twenty-One',
      )
      expect(convertTo(21, typeInfo('english_words', 'sentence'))).toBe(
        'Twenty-one',
      )
    })
  })

  describe('Prefix functionality', () => {
    describe('convertFrom with prefixed inputs', () => {
      test('should convert prefixed hexadecimal strings', () => {
        expect(convertFrom('0xff', typeInfo('hexadecimal'))).toBe(255)
        expect(convertFrom('0xFF', typeInfo('hexadecimal'))).toBe(255)
        expect(convertFrom('0xAB', typeInfo('hexadecimal'))).toBe(171)
        expect(convertFrom('0X123', typeInfo('hexadecimal'))).toBe(291)
      })

      test('should convert prefixed binary strings', () => {
        expect(convertFrom('0b1010', typeInfo('binary'))).toBe(10)
        expect(convertFrom('0B1010', typeInfo('binary'))).toBe(10)
        expect(convertFrom('0b11111111', typeInfo('binary'))).toBe(255)
        expect(convertFrom('0B0', typeInfo('binary'))).toBe(0)
      })

      test('should convert prefixed octal strings', () => {
        expect(convertFrom('0o77', typeInfo('octal'))).toBe(63)
        expect(convertFrom('0O77', typeInfo('octal'))).toBe(63)
        expect(convertFrom('0o123', typeInfo('octal'))).toBe(83)
        expect(convertFrom('0O0', typeInfo('octal'))).toBe(0)
      })
    })

    describe('convertTo with prefix parameters', () => {
      test('should generate prefixed hexadecimal strings', () => {
        expect(
          convertTo(255, typeInfo('hexadecimal', undefined, undefined, false)),
        ).toBe('ff')
        expect(
          convertTo(
            255,
            typeInfo('hexadecimal', undefined, undefined, 'lower'),
          ),
        ).toBe('0xff')
        expect(
          convertTo(
            255,
            typeInfo('hexadecimal', undefined, undefined, 'upper'),
          ),
        ).toBe('0XFF')
        expect(
          convertTo(
            171,
            typeInfo('hexadecimal', undefined, undefined, 'lower'),
          ),
        ).toBe('0xab')
        expect(
          convertTo(
            171,
            typeInfo('hexadecimal', undefined, undefined, 'upper'),
          ),
        ).toBe('0XAB')
      })

      test('should generate prefixed binary strings', () => {
        expect(
          convertTo(10, typeInfo('binary', undefined, undefined, false)),
        ).toBe('1010')
        expect(
          convertTo(10, typeInfo('binary', undefined, undefined, 'lower')),
        ).toBe('0b1010')
        expect(
          convertTo(10, typeInfo('binary', undefined, undefined, 'upper')),
        ).toBe('0B1010')
        expect(
          convertTo(255, typeInfo('binary', undefined, undefined, 'lower')),
        ).toBe('0b11111111')
        expect(
          convertTo(255, typeInfo('binary', undefined, undefined, 'upper')),
        ).toBe('0B11111111')
      })

      test('should generate prefixed octal strings', () => {
        expect(
          convertTo(63, typeInfo('octal', undefined, undefined, false)),
        ).toBe('77')
        expect(
          convertTo(63, typeInfo('octal', undefined, undefined, 'lower')),
        ).toBe('0o77')
        expect(
          convertTo(63, typeInfo('octal', undefined, undefined, 'upper')),
        ).toBe('0O77')
        expect(
          convertTo(83, typeInfo('octal', undefined, undefined, 'lower')),
        ).toBe('0o123')
        expect(
          convertTo(83, typeInfo('octal', undefined, undefined, 'upper')),
        ).toBe('0O123')
      })

      test('should handle prefix with case combinations for hexadecimal', () => {
        expect(
          convertTo(255, typeInfo('hexadecimal', 'lower', undefined, 'lower')),
        ).toBe('0xff')
        expect(
          convertTo(255, typeInfo('hexadecimal', 'upper', undefined, 'lower')),
        ).toBe('0xFF')
        expect(
          convertTo(255, typeInfo('hexadecimal', 'lower', undefined, 'upper')),
        ).toBe('0Xff')
        expect(
          convertTo(255, typeInfo('hexadecimal', 'upper', undefined, 'upper')),
        ).toBe('0XFF')
      })
    })

    describe('Round-trip conversions with prefixes', () => {
      test('should work for prefixed hexadecimal', () => {
        const testCases = [
          { input: '0xff', expected: { case: 'lower', prefix: 'lower' } },
          { input: '0xFF', expected: { case: 'upper', prefix: 'lower' } },
          { input: '0Xff', expected: { case: 'lower', prefix: 'upper' } },
          { input: '0XFF', expected: { case: 'upper', prefix: 'upper' } },
        ]

        testCases.forEach(({ input, expected }) => {
          const number = convertFrom(input, typeInfo('hexadecimal'))
          const typeInfoObj = typeInfo(
            'hexadecimal',
            expected.case as 'lower' | 'upper' | 'sentence',
            undefined,
            expected.prefix as 'lower' | 'upper',
          )
          const converted = convertTo(number, typeInfoObj)
          expect(converted).toBe(input)
        })
      })

      test('should work for prefixed binary', () => {
        const testCases = [
          { input: '0b1010', expected: { prefix: 'lower' } },
          { input: '0B1010', expected: { prefix: 'upper' } },
        ]

        testCases.forEach(({ input, expected }) => {
          const number = convertFrom(input, typeInfo('binary'))
          const typeInfoObj = typeInfo(
            'binary',
            undefined,
            undefined,
            expected.prefix as 'lower' | 'upper',
          )
          const converted = convertTo(number, typeInfoObj)
          expect(converted).toBe(input)
        })
      })

      test('should work for prefixed octal', () => {
        const testCases = [
          { input: '0o77', expected: { prefix: 'lower' } },
          { input: '0O77', expected: { prefix: 'upper' } },
        ]

        testCases.forEach(({ input, expected }) => {
          const number = convertFrom(input, typeInfo('octal'))
          const typeInfoObj = typeInfo(
            'octal',
            undefined,
            undefined,
            expected.prefix as 'lower' | 'upper',
          )
          const converted = convertTo(number, typeInfoObj)
          expect(converted).toBe(input)
        })
      })
    })
  })
})
