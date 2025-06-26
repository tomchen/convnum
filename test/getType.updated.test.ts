import { expect, test, describe } from 'bun:test'
import { getTypes, hasType } from '../src'
import {
  CaseType,
  FormatType,
  NumType,
  PrefixType,
  TypeInfo,
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
  if (caseType !== undefined) {
    info.case = caseType
  }
  if (format !== undefined) {
    info.format = format
  }
  if (prefix !== undefined) {
    info.prefix = prefix
  }
  if (zhst !== undefined) {
    info.zhst = zhst
  }
  return info
}

describe('getTypes function', () => {
  describe('Basic type detection', () => {
    test('should detect decimal numbers', () => {
      expect(getTypes('123')).toContainEqual(typeInfo('decimal'))
      expect(getTypes('-45.67')).toEqual([typeInfo('decimal')])
      expect(getTypes('0')).toContainEqual(typeInfo('decimal'))
    })

    test('should detect binary numbers', () => {
      expect(getTypes('1010')).toContainEqual(
        typeInfo('binary', undefined, undefined, false),
      )
      expect(getTypes('0')).toContainEqual(
        typeInfo('binary', undefined, undefined, false),
      )
    })

    test('should detect hexadecimal with case', () => {
      expect(getTypes('A')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, false),
      )
      expect(getTypes('a')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, false),
      )
      expect(getTypes('FF')).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, false),
      )
      expect(getTypes('ff')).toContainEqual(
        typeInfo('hexadecimal', 'lower', undefined, false),
      )
    })

    test('should detect Roman numerals with case', () => {
      expect(getTypes('IV')).toContainEqual(typeInfo('roman', 'upper'))
      expect(getTypes('iv')).toContainEqual(typeInfo('roman', 'lower'))
      expect(getTypes('MCDXL')).toContainEqual(typeInfo('roman', 'upper'))
    })
  })

  describe('Letter types with case', () => {
    test('should detect Latin letters with case', () => {
      expect(getTypes('A')).toContainEqual(typeInfo('latin_letter', 'upper'))
      expect(getTypes('a')).toContainEqual(typeInfo('latin_letter', 'lower'))
      expect(getTypes('Z')).toContainEqual(typeInfo('latin_letter', 'upper'))
      expect(getTypes('z')).toContainEqual(typeInfo('latin_letter', 'lower'))
    })

    test('should detect Greek letters with case', () => {
      expect(getTypes('Α')).toContainEqual(typeInfo('greek_letter', 'upper'))
      expect(getTypes('α')).toContainEqual(typeInfo('greek_letter', 'lower'))
      expect(getTypes('Ω')).toContainEqual(typeInfo('greek_letter', 'upper'))
      expect(getTypes('ω')).toContainEqual(typeInfo('greek_letter', 'lower'))
    })

    test('should detect Cyrillic letters with case', () => {
      expect(getTypes('А')).toContainEqual(typeInfo('cyrillic_letter', 'upper'))
      expect(getTypes('а')).toContainEqual(typeInfo('cyrillic_letter', 'lower'))
      expect(getTypes('Я')).toContainEqual(typeInfo('cyrillic_letter', 'upper'))
    })
  })

  describe('Word types with case', () => {
    test('should detect astrological signs with case', () => {
      expect(getTypes('Aries')).toContainEqual(
        typeInfo('astrological_sign', 'sentence'),
      )
      expect(getTypes('ARIES')).toContainEqual(
        typeInfo('astrological_sign', 'upper'),
      )
      expect(getTypes('aries')).toContainEqual(
        typeInfo('astrological_sign', 'lower'),
      )
    })

    test('should detect NATO phonetic with case', () => {
      expect(getTypes('Alfa')).toContainEqual(
        typeInfo('nato_phonetic', 'sentence'),
      )
      expect(getTypes('ALFA')).toContainEqual(
        typeInfo('nato_phonetic', 'upper'),
      )
      expect(getTypes('alfa')).toContainEqual(
        typeInfo('nato_phonetic', 'lower'),
      )
    })

    test('should detect English words with case', () => {
      expect(getTypes('one')).toContainEqual(typeInfo('english_words', 'lower'))
      expect(getTypes('One')).toContainEqual(
        typeInfo('english_words', 'sentence'),
      )
      expect(getTypes('ONE')).toContainEqual(typeInfo('english_words', 'upper'))
      expect(getTypes('Twenty-One')).toContainEqual(
        typeInfo('english_words', 'title'),
      )
    })

    test('should detect French words with case', () => {
      expect(getTypes('un')).toContainEqual(typeInfo('french_words', 'lower'))
      expect(getTypes('Un')).toContainEqual(
        typeInfo('french_words', 'sentence'),
      )
      expect(getTypes('UN')).toContainEqual(typeInfo('french_words', 'upper'))
      expect(getTypes('Vingt-Et-Un')).toContainEqual(
        typeInfo('french_words', 'title'),
      )
    })
  })

  describe('Date/time types with case and format', () => {
    test('should detect month names with case and format', () => {
      expect(getTypes('January')).toContainEqual(
        typeInfo('month_name', 'sentence', 'long'),
      )
      expect(getTypes('JANUARY')).toContainEqual(
        typeInfo('month_name', 'upper', 'long'),
      )
      expect(getTypes('january')).toContainEqual(
        typeInfo('month_name', 'lower', 'long'),
      )
      expect(getTypes('Jan')).toContainEqual(
        typeInfo('month_name', 'sentence', 'short'),
      )
      expect(getTypes('JAN')).toContainEqual(
        typeInfo('month_name', 'upper', 'short'),
      )
      expect(getTypes('jan')).toContainEqual(
        typeInfo('month_name', 'lower', 'short'),
      )
    })

    test('should detect day of week with case and format', () => {
      expect(getTypes('Monday')).toContainEqual(
        typeInfo('day_of_week', 'sentence', 'long'),
      )
      expect(getTypes('MONDAY')).toContainEqual(
        typeInfo('day_of_week', 'upper', 'long'),
      )
      expect(getTypes('monday')).toContainEqual(
        typeInfo('day_of_week', 'lower', 'long'),
      )
      expect(getTypes('Mon')).toContainEqual(
        typeInfo('day_of_week', 'sentence', 'short'),
      )
      expect(getTypes('MON')).toContainEqual(
        typeInfo('day_of_week', 'upper', 'short'),
      )
      expect(getTypes('mon')).toContainEqual(
        typeInfo('day_of_week', 'lower', 'short'),
      )
    })
  })

  describe('Chinese types', () => {
    test('should detect Chinese words', () => {
      expect(getTypes('一')).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 2),
      )
      expect(getTypes('十一')).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 2),
      )
      expect(getTypes('一百二十三')).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 2),
      )
    })

    test('should detect Chinese financial', () => {
      expect(getTypes('壹')).toContainEqual(
        typeInfo('chinese_financial', undefined, undefined, undefined, 2),
      )
      expect(getTypes('壹佰贰拾叁')).toContainEqual(
        typeInfo('chinese_financial', undefined, undefined, undefined, 0),
      )
    })

    test('should detect Chinese heavenly stems', () => {
      expect(getTypes('甲')).toContainEqual(typeInfo('chinese_heavenly_stem'))
      expect(getTypes('乙')).toContainEqual(typeInfo('chinese_heavenly_stem'))
    })

    test('should detect Chinese earthly branches', () => {
      expect(getTypes('子')).toContainEqual(typeInfo('chinese_earthly_branch'))
      expect(getTypes('丑')).toContainEqual(typeInfo('chinese_earthly_branch'))
    })

    test('should detect Chinese solar terms', () => {
      expect(getTypes('立春')).toContainEqual(
        typeInfo('chinese_solar_term', undefined, undefined, undefined, 2),
      )
      expect(getTypes('夏至')).toContainEqual(
        typeInfo('chinese_solar_term', undefined, undefined, undefined, 2),
      )
    })
  })

  describe('Multiple type detection', () => {
    test('should detect overlapping types correctly', () => {
      const result = getTypes('A')
      expect(result).toContainEqual(typeInfo('latin_letter', 'upper'))
      expect(result).toContainEqual(
        typeInfo('hexadecimal', 'upper', undefined, false),
      )
      expect(result.length).toBe(2)
    })

    test('should detect Dec as both hexadecimal and month', () => {
      const result = getTypes('Dec')
      expect(result).toContainEqual(
        typeInfo('hexadecimal', 'sentence', undefined, false),
      )
      expect(result).toContainEqual(typeInfo('month_name', 'sentence', 'short'))
      expect(result.length).toBe(2)
    })

    test('should detect overlapping Chinese types', () => {
      const result = getTypes('零')
      expect(result).toContainEqual(
        typeInfo('chinese_words', undefined, undefined, undefined, 2),
      )
      expect(result).toContainEqual(
        typeInfo('chinese_financial', undefined, undefined, undefined, 2),
      )
      expect(result.length).toBe(2)
    })
  })

  describe('Special cases', () => {
    test('should handle invalid inputs', () => {
      expect(getTypes(null as unknown as string)).toEqual([typeInfo('invalid')])
      expect(getTypes(undefined as unknown as string)).toEqual([
        typeInfo('invalid'),
      ])
      expect(getTypes(123 as unknown as string)).toEqual([typeInfo('invalid')])
    })

    test('should handle empty strings', () => {
      expect(getTypes('')).toEqual([typeInfo('empty')])
      expect(getTypes('   ')).toEqual([typeInfo('empty')])
      expect(getTypes('\t\n')).toEqual([typeInfo('empty')])
    })

    test('should handle unknown types', () => {
      expect(getTypes('invalid-string')).toEqual([typeInfo('unknown')])
      expect(getTypes('xyz123')).toEqual([typeInfo('unknown')])
    })
  })

  describe('English cardinal numbers', () => {
    test('should detect English cardinal with case', () => {
      expect(getTypes('1st')).toContainEqual(
        typeInfo('english_cardinal', 'lower'),
      )
      expect(getTypes('1ST')).toContainEqual(
        typeInfo('english_cardinal', 'upper'),
      )
      expect(getTypes('2nd')).toContainEqual(
        typeInfo('english_cardinal', 'lower'),
      )
      expect(getTypes('2ND')).toContainEqual(
        typeInfo('english_cardinal', 'upper'),
      )
    })
  })

  describe('Arabic numerals', () => {
    test('should detect Arabic numerals', () => {
      expect(getTypes('١٢٣')).toContainEqual(typeInfo('arabic'))
      expect(getTypes('٠')).toContainEqual(typeInfo('arabic'))
    })
  })
})

describe('hasType function', () => {
  test('should work with all basic types', () => {
    expect(hasType('123', 'decimal')).toBe(true)
    expect(hasType('A', 'latin_letter')).toBe(true)
    expect(hasType('Aries', 'astrological_sign')).toBe(true)
    expect(hasType('January', 'month_name')).toBe(true)
    expect(hasType('IV', 'roman')).toBe(true)
    expect(hasType('invalid', 'roman')).toBe(false)
  })

  test('should handle special types', () => {
    expect(hasType('', 'empty')).toBe(true)
    expect(hasType('invalid-string', 'unknown')).toBe(true)
    expect(hasType(null as unknown as string, 'invalid')).toBe(true)
  })
})
