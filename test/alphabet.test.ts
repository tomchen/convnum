import { expect, test, describe } from 'bun:test'
import {
  toLatinLetter,
  fromLatinLetter,
  toGreekLetter,
  fromGreekLetter,
  toNatoPhonetic,
  fromNatoPhonetic,
  toCyrillicLetter,
  fromCyrillicLetter,
} from '../src'

describe('Alphabet-related conversions', () => {
  describe('Latin letter conversions', () => {
    test('toLatinLetter basic cases', () => {
      expect(toLatinLetter(1)).toBe('a')
      expect(toLatinLetter(26)).toBe('z')
      expect(toLatinLetter(1, true)).toBe('A')
      expect(toLatinLetter(26, true)).toBe('Z')
    })

    test('toLatinLetter all letters lowercase', () => {
      const expected = 'abcdefghijklmnopqrstuvwxyz'
      for (let i = 1; i <= expected.length; i++) {
        expect(toLatinLetter(i)).toBe(expected[i - 1])
      }
    })

    test('toLatinLetter all letters uppercase', () => {
      const expected = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let i = 1; i <= expected.length; i++) {
        expect(toLatinLetter(i, true)).toBe(expected[i - 1])
      }
    })

    test('toLatinLetter invalid inputs', () => {
      expect(() => toLatinLetter(0)).toThrow()
      expect(() => toLatinLetter(27)).toThrow()
      expect(() => toLatinLetter(-1)).toThrow()
      expect(() => toLatinLetter(1.5)).toThrow()
    })

    test('fromLatinLetter basic cases', () => {
      expect(fromLatinLetter('a')).toBe(1)
      expect(fromLatinLetter('z')).toBe(26)
      expect(fromLatinLetter('A')).toBe(1)
      expect(fromLatinLetter('Z')).toBe(26)
    })

    test('fromLatinLetter all letters', () => {
      const lowercase = 'abcdefghijklmnopqrstuvwxyz'
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let i = 0; i < 26; i++) {
        expect(fromLatinLetter(lowercase[i])).toBe(i + 1)
        expect(fromLatinLetter(uppercase[i])).toBe(i + 1)
      }
    })

    test('fromLatinLetter invalid inputs', () => {
      expect(() => fromLatinLetter('')).toThrow()
      expect(() => fromLatinLetter('aa')).toThrow()
      expect(() => fromLatinLetter('1')).toThrow()
      expect(() => fromLatinLetter('!')).toThrow()
      expect(() => fromLatinLetter('@')).toThrow()
      expect(() => fromLatinLetter('[')).toThrow()
      expect(() => fromLatinLetter('`')).toThrow()
      expect(() => fromLatinLetter('{')).toThrow()
    })
  })

  describe('Greek letter conversions', () => {
    test('toGreekLetter basic cases', () => {
      expect(toGreekLetter(1)).toBe('α')
      expect(toGreekLetter(24)).toBe('ω')
      expect(toGreekLetter(1, true)).toBe('Α')
      expect(toGreekLetter(24, true)).toBe('Ω')
    })

    test('toGreekLetter all letters lowercase', () => {
      const expected = 'αβγδεζηθικλμνξοπρστυφχψω'
      for (let i = 1; i <= expected.length; i++) {
        expect(toGreekLetter(i)).toBe(expected[i - 1])
      }
    })

    test('toGreekLetter all letters uppercase', () => {
      const expected = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
      for (let i = 1; i <= expected.length; i++) {
        expect(toGreekLetter(i, true)).toBe(expected[i - 1])
      }
    })

    test('toGreekLetter invalid inputs', () => {
      expect(() => toGreekLetter(0)).toThrow()
      expect(() => toGreekLetter(25)).toThrow()
      expect(() => toGreekLetter(-1)).toThrow()
      expect(() => toGreekLetter(1.5)).toThrow()
    })

    test('fromGreekLetter basic cases', () => {
      expect(fromGreekLetter('α')).toBe(1)
      expect(fromGreekLetter('ω')).toBe(24)
      expect(fromGreekLetter('Α')).toBe(1)
      expect(fromGreekLetter('Ω')).toBe(24)
    })

    test('fromGreekLetter all letters', () => {
      const lowercase = 'αβγδεζηθικλμνξοπρστυφχψω'
      const uppercase = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
      for (let i = 0; i < 24; i++) {
        expect(fromGreekLetter(lowercase[i])).toBe(i + 1)
        expect(fromGreekLetter(uppercase[i])).toBe(i + 1)
      }
    })

    test('fromGreekLetter special inputs', () => {
      expect(fromGreekLetter('ρ')).toBe(17)
      expect(fromGreekLetter('σ')).toBe(18)
      expect(fromGreekLetter('τ')).toBe(19)

      expect(fromGreekLetter('ς')).toBe(18)
      expect(fromGreekLetter('Σ')).toBe(18)
    })

    test('fromGreekLetter invalid inputs', () => {
      expect(() => fromGreekLetter('')).toThrow()
      expect(() => fromGreekLetter('αα')).toThrow()
      expect(() => fromGreekLetter('a')).toThrow()
      expect(() => fromGreekLetter('1')).toThrow()
      expect(() => fromGreekLetter('𝛂')).toThrow()
      expect(() => fromGreekLetter('Ἅ')).toThrow()
      expect(() => fromGreekLetter('ΰ')).toThrow()
      expect(() => fromGreekLetter('ϊ')).toThrow()
      expect(() => fromGreekLetter('ΐ')).toThrow()
      expect(() => fromGreekLetter('Ϊ')).toThrow()
    })
  })

  describe('Cyrillic letter conversions', () => {
    test('toCyrillicLetter basic cases', () => {
      expect(toCyrillicLetter(1)).toBe('а')
      expect(toCyrillicLetter(33)).toBe('я')
      expect(toCyrillicLetter(1, true)).toBe('А')
      expect(toCyrillicLetter(33, true)).toBe('Я')
      expect(toCyrillicLetter(7)).toBe('ё')
      expect(toCyrillicLetter(7, true)).toBe('Ё')
    })

    test('toCyrillicLetter all letters lowercase', () => {
      const expected = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
      for (let i = 1; i <= expected.length; i++) {
        expect(toCyrillicLetter(i)).toBe(expected[i - 1])
      }
    })

    test('toCyrillicLetter all letters uppercase', () => {
      const expected = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
      for (let i = 1; i <= expected.length; i++) {
        expect(toCyrillicLetter(i, true)).toBe(expected[i - 1])
      }
    })

    test('toCyrillicLetter invalid inputs', () => {
      expect(() => toCyrillicLetter(0)).toThrow()
      expect(() => toCyrillicLetter(34)).toThrow()
      expect(() => toCyrillicLetter(-1)).toThrow()
      expect(() => toCyrillicLetter(1.5)).toThrow()
    })

    test('fromCyrillicLetter basic cases', () => {
      expect(fromCyrillicLetter('а')).toBe(1)
      expect(fromCyrillicLetter('я')).toBe(33)
      expect(fromCyrillicLetter('А')).toBe(1)
      expect(fromCyrillicLetter('Я')).toBe(33)
      expect(fromCyrillicLetter('ё')).toBe(7)
      expect(fromCyrillicLetter('Ё')).toBe(7)
    })

    test('fromCyrillicLetter all letters', () => {
      const lowercase = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
      const uppercase = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
      for (let i = 0; i < 33; i++) {
        expect(fromCyrillicLetter(lowercase[i])).toBe(i + 1)
        expect(fromCyrillicLetter(uppercase[i])).toBe(i + 1)
      }
    })

    test('fromCyrillicLetter special case for ё/Ё', () => {
      expect(fromCyrillicLetter('е')).toBe(6)
      expect(fromCyrillicLetter('ё')).toBe(7)
      expect(fromCyrillicLetter('ж')).toBe(8)
      expect(fromCyrillicLetter('Е')).toBe(6)
      expect(fromCyrillicLetter('Ё')).toBe(7)
      expect(fromCyrillicLetter('Ж')).toBe(8)
    })

    test('fromCyrillicLetter invalid inputs', () => {
      expect(() => fromCyrillicLetter('')).toThrow()
      expect(() => fromCyrillicLetter('аа')).toThrow()
      expect(() => fromCyrillicLetter('a')).toThrow()
      expect(() => fromCyrillicLetter('1')).toThrow()
      expect(() => fromCyrillicLetter('!')).toThrow()
      expect(() => fromCyrillicLetter('α')).toThrow()
      expect(() => fromCyrillicLetter('č')).toThrow() // Latin with diacritics
      expect(() => fromCyrillicLetter('ґ')).toThrow() // Ukrainian-specific Cyrillic
      expect(() => fromCyrillicLetter('ђ')).toThrow() // Serbian-specific Cyrillic
    })
  })

  describe('NATO phonetic alphabet conversions', () => {
    test('toNatoPhonetic basic cases', () => {
      expect(toNatoPhonetic(1)).toBe('Alfa')
      expect(toNatoPhonetic(26)).toBe('Zulu')
    })

    test('toNatoPhonetic all words', () => {
      const expected = [
        'Alfa',
        'Bravo',
        'Charlie',
        'Delta',
        'Echo',
        'Foxtrot',
        'Golf',
        'Hotel',
        'India',
        'Juliett',
        'Kilo',
        'Lima',
        'Mike',
        'November',
        'Oscar',
        'Papa',
        'Quebec',
        'Romeo',
        'Sierra',
        'Tango',
        'Uniform',
        'Victor',
        'Whiskey',
        'X-ray',
        'Yankee',
        'Zulu',
      ]
      for (let i = 1; i <= expected.length; i++) {
        expect(toNatoPhonetic(i)).toBe(expected[i - 1])
      }
    })

    test('toNatoPhonetic invalid inputs', () => {
      expect(() => toNatoPhonetic(0)).toThrow()
      expect(() => toNatoPhonetic(27)).toThrow()
      expect(() => toNatoPhonetic(-1)).toThrow()
      expect(() => toNatoPhonetic(1.5)).toThrow()
    })

    test('fromNatoPhonetic basic cases', () => {
      expect(fromNatoPhonetic('Alfa')).toBe(1)
      expect(fromNatoPhonetic('Zulu')).toBe(26)
    })

    test('fromNatoPhonetic case insensitive', () => {
      expect(fromNatoPhonetic('alfa')).toBe(1)
      expect(fromNatoPhonetic('zulu')).toBe(26)
      expect(fromNatoPhonetic('ALPHA')).toBe(1)
      expect(fromNatoPhonetic('ZULU')).toBe(26)
    })

    test('fromNatoPhonetic all words', () => {
      const words = [
        'Alfa',
        'Bravo',
        'Charlie',
        'Delta',
        'Echo',
        'Foxtrot',
        'Golf',
        'Hotel',
        'India',
        'Juliett',
        'Kilo',
        'Lima',
        'Mike',
        'November',
        'Oscar',
        'Papa',
        'Quebec',
        'Romeo',
        'Sierra',
        'Tango',
        'Uniform',
        'Victor',
        'Whiskey',
        'X-ray',
        'Yankee',
        'Zulu',
      ]
      for (let i = 0; i < 26; i++) {
        expect(fromNatoPhonetic(words[i])).toBe(i + 1)
      }
    })

    test('fromNatoPhonetic aliases', () => {
      expect(fromNatoPhonetic('Alpha')).toBe(1)
      expect(fromNatoPhonetic('Juliet')).toBe(10)
      expect(fromNatoPhonetic('Xray')).toBe(24)
      // Test case insensitivity
      expect(fromNatoPhonetic('ALPHA')).toBe(1)
      expect(fromNatoPhonetic('juliet')).toBe(10)
      expect(fromNatoPhonetic('XRAY')).toBe(24)
    })

    test('fromNatoPhonetic invalid inputs', () => {
      expect(() => fromNatoPhonetic('')).toThrow()
      expect(() => fromNatoPhonetic('NotAWord')).toThrow()
    })
  })
})
