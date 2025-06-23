/* eslint-disable compat/compat */
import { expect, test, describe } from 'bun:test'
import { convertFrom, convertTo, typeFromFns, typeToFns } from '../src'
import { NumType, VALID_NUM_TYPES } from '../src/utils/types'

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
      expect(convertFrom('123', 'decimal')).toBe(123)
      expect(convertFrom('-45.67', 'decimal')).toBe(-45.67)
    })

    test('should convert binary strings', () => {
      expect(convertFrom('1010', 'binary')).toBe(10)
      expect(convertFrom('11111111', 'binary')).toBe(255)
    })

    test('should convert Roman numerals', () => {
      expect(convertFrom('IV', 'roman')).toBe(4)
      expect(convertFrom('MMMCMXCIX', 'roman')).toBe(3999)
    })

    test('should convert English words', () => {
      expect(convertFrom('one', 'english_words')).toBe(1)
      expect(convertFrom('twenty-one', 'english_words')).toBe(21)
    })

    test('should convert Chinese words', () => {
      expect(convertFrom('一', 'chinese_words')).toBe(1)
      expect(convertFrom('一百二十三', 'chinese_words')).toBe(123)
    })

    test('should throw error for unsupported types', () => {
      expect(() =>
        convertFrom('123', 'unsupported_type' as unknown as NumType),
      ).toThrow('Unsupported type: unsupported_type')
    })

    test('should throw error for invalid conversions', () => {
      expect(() => convertFrom('invalid', 'roman')).toThrow(
        'Failed to convert "invalid" from type "roman"',
      )
    })

    test('should throw error for special types', () => {
      expect(() => convertFrom('123', 'invalid')).toThrow(
        'Cannot convert invalid type',
      )
      expect(() => convertFrom('123', 'empty')).toThrow(
        'Cannot convert empty type',
      )
      expect(() => convertFrom('123', 'unknown')).toThrow(
        'Cannot convert unknown type',
      )
    })
  })

  describe('convertTo function', () => {
    test('should convert to decimal strings', () => {
      expect(convertTo(123, 'decimal')).toBe('123')
      expect(convertTo(-45.67, 'decimal')).toBe('-45.67')
    })

    test('should convert to binary strings', () => {
      expect(convertTo(10, 'binary')).toBe('1010')
      expect(convertTo(255, 'binary')).toBe('11111111')
    })

    test('should convert to Roman numerals', () => {
      expect(convertTo(4, 'roman')).toBe('IV')
      expect(convertTo(3999, 'roman')).toBe('MMMCMXCIX')
    })

    test('should convert to English words', () => {
      expect(convertTo(1, 'english_words')).toBe('one')
      expect(convertTo(21, 'english_words')).toBe('twenty-one')
    })

    test('should convert to Chinese words', () => {
      expect(convertTo(1, 'chinese_words')).toBe('一')
      expect(convertTo(123, 'chinese_words')).toBe('一百二十三')
    })

    test('should throw error for unsupported types', () => {
      expect(() =>
        convertTo(123, 'unsupported_type' as unknown as NumType),
      ).toThrow('Unsupported type: unsupported_type')
    })

    test('should throw error for invalid conversions', () => {
      expect(() => convertTo(0, 'roman')).toThrow(
        'Failed to convert 0 to type "roman"',
      )
    })

    test('should throw error for special types', () => {
      expect(() => convertTo(123, 'invalid')).toThrow(
        'Cannot convert to invalid type',
      )
      expect(() => convertTo(123, 'empty')).toThrow(
        'Cannot convert to empty type',
      )
      expect(() => convertTo(123, 'unknown')).toThrow(
        'Cannot convert to unknown type',
      )
    })
  })

  describe('Round-trip conversions', () => {
    test('should work for decimal', () => {
      const original = 123.45
      const converted = convertTo(original, 'decimal')
      const back = convertFrom(converted, 'decimal')
      expect(back).toBe(original)
    })

    test('should work for binary', () => {
      const original = 42
      const converted = convertTo(original, 'binary')
      const back = convertFrom(converted, 'binary')
      expect(back).toBe(original)
    })

    test('should work for English words', () => {
      const original = 123
      const converted = convertTo(original, 'english_words')
      const back = convertFrom(converted, 'english_words')
      expect(back).toBe(original)
    })

    test('should work for Chinese words', () => {
      const original = 123
      const converted = convertTo(original, 'chinese_words')
      const back = convertFrom(converted, 'chinese_words')
      expect(back).toBe(original)
    })
  })
})
