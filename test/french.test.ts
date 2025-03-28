import { expect, test, describe } from 'bun:test'
import {
  toFrenchWords,
  fromFrenchWords,
  validateFrenchWords,
} from '../src/french'

const arr = [
  'zéro',
  'un',
  'deux',
  'trois',
  'quatre',
  'cinq',
  'six',
  'sept',
  'huit',
  'neuf',
  'dix',
  'onze',
  'douze',
  'treize',
  'quatorze',
  'quinze',
  'seize',
  'dix-sept',
  'dix-huit',
  'dix-neuf',
  'vingt',
  'vingt-et-un',
  'vingt-deux',
  'vingt-trois',
  'vingt-quatre',
  'vingt-cinq',
  'vingt-six',
  'vingt-sept',
  'vingt-huit',
  'vingt-neuf',
  'trente',
  'trente-et-un',
  'trente-deux',
  'trente-trois',
  'trente-quatre',
  'trente-cinq',
  'trente-six',
  'trente-sept',
  'trente-huit',
  'trente-neuf',
  'quarante',
  'quarante-et-un',
  'quarante-deux',
  'quarante-trois',
  'quarante-quatre',
  'quarante-cinq',
  'quarante-six',
  'quarante-sept',
  'quarante-huit',
  'quarante-neuf',
  'cinquante',
  'cinquante-et-un',
  'cinquante-deux',
  'cinquante-trois',
  'cinquante-quatre',
  'cinquante-cinq',
  'cinquante-six',
  'cinquante-sept',
  'cinquante-huit',
  'cinquante-neuf',
  'soixante',
  'soixante-et-un',
  'soixante-deux',
  'soixante-trois',
  'soixante-quatre',
  'soixante-cinq',
  'soixante-six',
  'soixante-sept',
  'soixante-huit',
  'soixante-neuf',
  'soixante-dix',
  'soixante-et-onze',
  'soixante-douze',
  'soixante-treize',
  'soixante-quatorze',
  'soixante-quinze',
  'soixante-seize',
  'soixante-dix-sept',
  'soixante-dix-huit',
  'soixante-dix-neuf',
  'quatre-vingts',
  'quatre-vingt-un',
  'quatre-vingt-deux',
  'quatre-vingt-trois',
  'quatre-vingt-quatre',
  'quatre-vingt-cinq',
  'quatre-vingt-six',
  'quatre-vingt-sept',
  'quatre-vingt-huit',
  'quatre-vingt-neuf',
  'quatre-vingt-dix',
  'quatre-vingt-onze',
  'quatre-vingt-douze',
  'quatre-vingt-treize',
  'quatre-vingt-quatorze',
  'quatre-vingt-quinze',
  'quatre-vingt-seize',
  'quatre-vingt-dix-sept',
  'quatre-vingt-dix-huit',
  'quatre-vingt-dix-neuf',
  'cent',
  'cent un',
  'cent deux',
  'cent trois',
  'cent quatre',
  'cent cinq',
  'cent six',
  'cent sept',
  'cent huit',
  'cent neuf',
  'cent dix',
  'cent onze',
  'cent douze',
  'cent treize',
  'cent quatorze',
  'cent quinze',
  'cent seize',
  'cent dix-sept',
  'cent dix-huit',
  'cent dix-neuf',
  'cent vingt',
  'cent vingt-et-un',
  'cent vingt-deux',
  'cent vingt-trois',
  'cent vingt-quatre',
  'cent vingt-cinq',
  'cent vingt-six',
  'cent vingt-sept',
  'cent vingt-huit',
  'cent vingt-neuf',
  'cent trente',
  'cent trente-et-un',
]

describe('French number words conversions', () => {
  test('toFrenchWords should convert numbers to French words', () => {
    // Basic numbers
    expect(toFrenchWords(0)).toBe('zéro')
    expect(toFrenchWords(1)).toBe('un')
    expect(toFrenchWords(2)).toBe('deux')
    expect(toFrenchWords(9)).toBe('neuf')

    // Teens
    expect(toFrenchWords(11)).toBe('onze')
    expect(toFrenchWords(12)).toBe('douze')
    expect(toFrenchWords(13)).toBe('treize')
    expect(toFrenchWords(14)).toBe('quatorze')
    expect(toFrenchWords(15)).toBe('quinze')
    expect(toFrenchWords(16)).toBe('seize')
    expect(toFrenchWords(17)).toBe('dix-sept')
    expect(toFrenchWords(18)).toBe('dix-huit')
    expect(toFrenchWords(19)).toBe('dix-neuf')

    // Tens with et-un
    expect(toFrenchWords(21)).toBe('vingt-et-un')
    expect(toFrenchWords(31)).toBe('trente-et-un')
    expect(toFrenchWords(41)).toBe('quarante-et-un')
    expect(toFrenchWords(51)).toBe('cinquante-et-un')
    expect(toFrenchWords(61)).toBe('soixante-et-un')

    // Regular tens combinations
    expect(toFrenchWords(22)).toBe('vingt-deux')
    expect(toFrenchWords(35)).toBe('trente-cinq')
    expect(toFrenchWords(48)).toBe('quarante-huit')
    expect(toFrenchWords(53)).toBe('cinquante-trois')
    expect(toFrenchWords(69)).toBe('soixante-neuf')

    // Special seventies
    expect(toFrenchWords(70)).toBe('soixante-dix')
    expect(toFrenchWords(71)).toBe('soixante-et-onze')
    expect(toFrenchWords(72)).toBe('soixante-douze')
    expect(toFrenchWords(73)).toBe('soixante-treize')
    expect(toFrenchWords(79)).toBe('soixante-dix-neuf')

    // Eighties
    expect(toFrenchWords(80)).toBe('quatre-vingts')
    expect(toFrenchWords(81)).toBe('quatre-vingt-un')
    expect(toFrenchWords(82)).toBe('quatre-vingt-deux')
    expect(toFrenchWords(89)).toBe('quatre-vingt-neuf')

    // Nineties
    expect(toFrenchWords(90)).toBe('quatre-vingt-dix')
    expect(toFrenchWords(91)).toBe('quatre-vingt-onze')
    expect(toFrenchWords(92)).toBe('quatre-vingt-douze')
    expect(toFrenchWords(99)).toBe('quatre-vingt-dix-neuf')

    // Hundreds
    expect(toFrenchWords(100)).toBe('cent')
    expect(toFrenchWords(101)).toBe('cent un')
    expect(toFrenchWords(110)).toBe('cent dix')
    expect(toFrenchWords(111)).toBe('cent onze')
    expect(toFrenchWords(200)).toBe('deux cents')
    expect(toFrenchWords(201)).toBe('deux cent un')
    expect(toFrenchWords(999)).toBe('neuf cent quatre-vingt-dix-neuf')

    // Thousands
    expect(toFrenchWords(1000)).toBe('mille')
    expect(toFrenchWords(1001)).toBe('mille un')
    expect(toFrenchWords(1100)).toBe('mille cent')
    expect(toFrenchWords(1101)).toBe('mille cent un')
    expect(toFrenchWords(2000)).toBe('deux mille')
    expect(toFrenchWords(2001)).toBe('deux mille un')
    expect(toFrenchWords(10000)).toBe('dix mille')
    expect(toFrenchWords(100000)).toBe('cent mille')
    expect(toFrenchWords(999999)).toBe(
      'neuf cent quatre-vingt-dix-neuf mille neuf cent quatre-vingt-dix-neuf',
    )

    // Millions
    expect(toFrenchWords(1000000)).toBe('un million')
    expect(toFrenchWords(2000000)).toBe('deux millions')
    expect(toFrenchWords(1000001)).toBe('un million un')
    expect(toFrenchWords(1000100)).toBe('un million cent')
    expect(toFrenchWords(9999999)).toBe(
      'neuf millions neuf cent quatre-vingt-dix-neuf mille neuf cent quatre-vingt-dix-neuf',
    )

    // Billions
    expect(toFrenchWords(1000000000)).toBe('un milliard')
    expect(toFrenchWords(2000000000)).toBe('deux milliards')
    expect(toFrenchWords(1000000001)).toBe('un milliard un')
    expect(toFrenchWords(1234567890)).toBe(
      'un milliard deux cent trente-quatre millions cinq cent soixante-sept mille huit cent quatre-vingt-dix',
    )

    // Negative numbers
    expect(toFrenchWords(-1)).toBe('moins un')
    expect(toFrenchWords(-42)).toBe('moins quarante-deux')
    expect(toFrenchWords(-1000000)).toBe('moins un million')

    // Edge cases with zeros
    expect(toFrenchWords(1000000010)).toBe('un milliard dix')
    expect(toFrenchWords(1001001001)).toBe('un milliard un million mille un')
    expect(toFrenchWords(1000001000)).toBe('un milliard mille')
  })

  describe('toFrenchWords should handle arr', () => {
    test('toFrenchWords should handle arr', () => {
      arr.forEach((item, index) => {
        expect(toFrenchWords(index)).toBe(item)
      })
    })
  })

  test('fromFrenchWords should convert French words to numbers', () => {
    expect(fromFrenchWords('zéro')).toBe(0)
    expect(fromFrenchWords('un')).toBe(1)
    expect(fromFrenchWords('deux')).toBe(2)
    expect(fromFrenchWords('neuf')).toBe(9)

    // Teens
    expect(fromFrenchWords('onze')).toBe(11)
    expect(fromFrenchWords('douze')).toBe(12)
    expect(fromFrenchWords('treize')).toBe(13)
    expect(fromFrenchWords('quatorze')).toBe(14)
    expect(fromFrenchWords('quinze')).toBe(15)
    expect(fromFrenchWords('seize')).toBe(16)
    expect(fromFrenchWords('dix-sept')).toBe(17)
    expect(fromFrenchWords('dix-huit')).toBe(18)
    expect(fromFrenchWords('dix-neuf')).toBe(19)

    // Tens with et-un
    expect(fromFrenchWords('vingt-et-un')).toBe(21)
    expect(fromFrenchWords('trente-et-un')).toBe(31)
    expect(fromFrenchWords('quarante-et-un')).toBe(41)
    expect(fromFrenchWords('cinquante-et-un')).toBe(51)
    expect(fromFrenchWords('soixante-et-un')).toBe(61)

    // Regular tens combinations
    expect(fromFrenchWords('vingt-deux')).toBe(22)
    expect(fromFrenchWords('trente-cinq')).toBe(35)
    expect(fromFrenchWords('quarante-huit')).toBe(48)
    expect(fromFrenchWords('cinquante-trois')).toBe(53)
    expect(fromFrenchWords('soixante-neuf')).toBe(69)

    // Special seventies
    expect(fromFrenchWords('soixante-dix')).toBe(70)
    expect(fromFrenchWords('soixante-et-onze')).toBe(71)
    expect(fromFrenchWords('soixante-douze')).toBe(72)
    expect(fromFrenchWords('soixante-treize')).toBe(73)
    expect(fromFrenchWords('soixante-dix-neuf')).toBe(79)

    // Eighties
    expect(fromFrenchWords('quatre-vingts')).toBe(80)
    expect(fromFrenchWords('quatre-vingt-un')).toBe(81)
    expect(fromFrenchWords('quatre-vingt-deux')).toBe(82)
    expect(fromFrenchWords('quatre-vingt-neuf')).toBe(89)

    // Nineties
    expect(fromFrenchWords('quatre-vingt-dix')).toBe(90)
    expect(fromFrenchWords('quatre-vingt-onze')).toBe(91)
    expect(fromFrenchWords('quatre-vingt-douze')).toBe(92)
    expect(fromFrenchWords('quatre-vingt-dix-neuf')).toBe(99)

    // Hundreds
    expect(fromFrenchWords('cent')).toBe(100)
    expect(fromFrenchWords('cent un')).toBe(101)
    expect(fromFrenchWords('cent dix')).toBe(110)
    expect(fromFrenchWords('cent onze')).toBe(111)
    expect(fromFrenchWords('deux cents')).toBe(200)
    expect(fromFrenchWords('deux cent un')).toBe(201)
    expect(fromFrenchWords('neuf cent quatre-vingt-dix-neuf')).toBe(999)

    // Thousands
    expect(fromFrenchWords('mille')).toBe(1000)
    expect(fromFrenchWords('mille un')).toBe(1001)
    expect(fromFrenchWords('mille cent')).toBe(1100)
    expect(fromFrenchWords('mille cent un')).toBe(1101)
    expect(fromFrenchWords('deux mille')).toBe(2000)
    expect(fromFrenchWords('deux mille un')).toBe(2001)
    expect(fromFrenchWords('dix mille')).toBe(10000)
    expect(fromFrenchWords('cent mille')).toBe(100000)
    expect(
      fromFrenchWords(
        'neuf cent quatre-vingt-dix-neuf mille neuf cent quatre-vingt-dix-neuf',
      ),
    ).toBe(999999)

    // Millions
    expect(fromFrenchWords('un million')).toBe(1000000)
    expect(fromFrenchWords('deux millions')).toBe(2000000)
    expect(fromFrenchWords('un million un')).toBe(1000001)
    expect(fromFrenchWords('un million cent')).toBe(1000100)
    expect(
      fromFrenchWords(
        'neuf millions neuf cent quatre-vingt-dix-neuf mille neuf cent quatre-vingt-dix-neuf',
      ),
    ).toBe(9999999)

    // Billions
    expect(fromFrenchWords('un milliard')).toBe(1000000000)
    expect(fromFrenchWords('deux milliards')).toBe(2000000000)
    expect(fromFrenchWords('un milliard un')).toBe(1000000001)
    expect(
      fromFrenchWords(
        'un milliard deux cent trente-quatre millions cinq cent soixante-sept mille huit cent quatre-vingt-dix',
      ),
    ).toBe(1234567890)

    // Negative numbers
    expect(fromFrenchWords('moins un')).toBe(-1)
    expect(fromFrenchWords('moins quarante-deux')).toBe(-42)
    expect(fromFrenchWords('moins un million')).toBe(-1000000)

    // Edge cases with zeros
    expect(fromFrenchWords('un milliard dix')).toBe(1000000010)
    expect(fromFrenchWords('un milliard un million mille un')).toBe(1001001001)
    expect(fromFrenchWords('un milliard mille')).toBe(1000001000)
  })

  describe('fromFrenchWords should handle arr', () => {
    test('fromFrenchWords should handle arr', () => {
      arr.forEach((item, index) => {
        expect(fromFrenchWords(item)).toBe(index)
      })
    })
  })
})

describe('validateFrenchWords', () => {
  test('should validate correct French number words', () => {
    expect(validateFrenchWords('zéro')).toBe(true)
    expect(validateFrenchWords('un')).toBe(true)
    expect(validateFrenchWords('vingt-et-un')).toBe(true)
    expect(validateFrenchWords('cent')).toBe(true)
    expect(validateFrenchWords('mille deux cent trente-quatre')).toBe(true)
    expect(validateFrenchWords('moins cent')).toBe(true)
  })

  test('should reject invalid French number words', () => {
    expect(validateFrenchWords('')).toBe(false)
    expect(validateFrenchWords('invalide')).toBe(false)
    expect(validateFrenchWords('cent et un')).toBe(false)
    expect(validateFrenchWords('vingt un')).toBe(false)
    expect(validateFrenchWords('cent, un')).toBe(false)
    expect(validateFrenchWords('cent virgule cinq')).toBe(false)
  })

  test('should be case insensitive', () => {
    expect(validateFrenchWords('ZÉRO')).toBe(true)
    expect(validateFrenchWords('VINGT-ET-UN')).toBe(true)
    expect(validateFrenchWords('CENT')).toBe(true)
  })
})
