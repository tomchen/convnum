import { expect, test, describe } from 'bun:test'
import { toEnglishCardinal, fromEnglishCardinal } from '../src/englishCardinal'

describe('toEnglishCardinal', () => {
  test('converts positive numbers correctly', () => {
    expect(toEnglishCardinal(1)).toBe('1st')
    expect(toEnglishCardinal(2)).toBe('2nd')
    expect(toEnglishCardinal(3)).toBe('3rd')
    expect(toEnglishCardinal(4)).toBe('4th')
    expect(toEnglishCardinal(5)).toBe('5th')
    expect(toEnglishCardinal(10)).toBe('10th')
    expect(toEnglishCardinal(11)).toBe('11th')
    expect(toEnglishCardinal(12)).toBe('12th')
    expect(toEnglishCardinal(13)).toBe('13th')
    expect(toEnglishCardinal(14)).toBe('14th')
    expect(toEnglishCardinal(20)).toBe('20th')
    expect(toEnglishCardinal(21)).toBe('21st')
    expect(toEnglishCardinal(22)).toBe('22nd')
    expect(toEnglishCardinal(23)).toBe('23rd')
    expect(toEnglishCardinal(24)).toBe('24th')
    expect(toEnglishCardinal(100)).toBe('100th')
    expect(toEnglishCardinal(101)).toBe('101st')
    expect(toEnglishCardinal(102)).toBe('102nd')
    expect(toEnglishCardinal(103)).toBe('103rd')
    expect(toEnglishCardinal(104)).toBe('104th')
  })

  test('converts negative numbers correctly', () => {
    expect(toEnglishCardinal(-1)).toBe('-1st')
    expect(toEnglishCardinal(-2)).toBe('-2nd')
    expect(toEnglishCardinal(-3)).toBe('-3rd')
    expect(toEnglishCardinal(-4)).toBe('-4th')
    expect(toEnglishCardinal(-11)).toBe('-11th')
    expect(toEnglishCardinal(-12)).toBe('-12th')
    expect(toEnglishCardinal(-13)).toBe('-13th')
    expect(toEnglishCardinal(-21)).toBe('-21st')
    expect(toEnglishCardinal(-22)).toBe('-22nd')
    expect(toEnglishCardinal(-23)).toBe('-23rd')
  })

  test('handles zero correctly', () => {
    expect(toEnglishCardinal(0)).toBe('0th')
  })

  test('throws error for non-finite numbers', () => {
    expect(() => toEnglishCardinal(NaN)).toThrow(
      'Input must be a finite number',
    )
    expect(() => toEnglishCardinal(Infinity)).toThrow(
      'Input must be a finite number',
    )
    expect(() => toEnglishCardinal(-Infinity)).toThrow(
      'Input must be a finite number',
    )
  })
})

describe('fromEnglishCardinal', () => {
  test('converts positive cardinal numbers correctly', () => {
    expect(fromEnglishCardinal('1st')).toBe(1)
    expect(fromEnglishCardinal('2nd')).toBe(2)
    expect(fromEnglishCardinal('3rd')).toBe(3)
    expect(fromEnglishCardinal('4th')).toBe(4)
    expect(fromEnglishCardinal('5th')).toBe(5)
    expect(fromEnglishCardinal('10th')).toBe(10)
    expect(fromEnglishCardinal('11th')).toBe(11)
    expect(fromEnglishCardinal('12th')).toBe(12)
    expect(fromEnglishCardinal('13th')).toBe(13)
    expect(fromEnglishCardinal('14th')).toBe(14)
    expect(fromEnglishCardinal('20th')).toBe(20)
    expect(fromEnglishCardinal('21st')).toBe(21)
    expect(fromEnglishCardinal('22nd')).toBe(22)
    expect(fromEnglishCardinal('23rd')).toBe(23)
    expect(fromEnglishCardinal('24th')).toBe(24)
    expect(fromEnglishCardinal('100th')).toBe(100)
    expect(fromEnglishCardinal('101st')).toBe(101)
    expect(fromEnglishCardinal('102nd')).toBe(102)
    expect(fromEnglishCardinal('103rd')).toBe(103)
    expect(fromEnglishCardinal('104th')).toBe(104)
  })

  test('converts negative cardinal numbers correctly', () => {
    expect(fromEnglishCardinal('-1st')).toBe(-1)
    expect(fromEnglishCardinal('-2nd')).toBe(-2)
    expect(fromEnglishCardinal('-3rd')).toBe(-3)
    expect(fromEnglishCardinal('-4th')).toBe(-4)
    expect(fromEnglishCardinal('-11th')).toBe(-11)
    expect(fromEnglishCardinal('-12th')).toBe(-12)
    expect(fromEnglishCardinal('-13th')).toBe(-13)
    expect(fromEnglishCardinal('-21st')).toBe(-21)
    expect(fromEnglishCardinal('-22nd')).toBe(-22)
    expect(fromEnglishCardinal('-23rd')).toBe(-23)
  })

  test('handles zero correctly', () => {
    expect(fromEnglishCardinal('0th')).toBe(0)
  })

  test('handles whitespace correctly', () => {
    expect(fromEnglishCardinal(' 1st ')).toBe(1)
    expect(fromEnglishCardinal('\t2nd\n')).toBe(2)
    expect(fromEnglishCardinal(' 3rd ')).toBe(3)
  })

  test('throws error for invalid inputs', () => {
    expect(() => fromEnglishCardinal('1')).toThrow('Invalid cardinal number')
    expect(() => fromEnglishCardinal('0st')).toThrow('Invalid cardinal number')
    expect(() => fromEnglishCardinal('1st1')).toThrow('Invalid cardinal number')
    expect(() => fromEnglishCardinal('abc')).toThrow('Invalid cardinal number')
    expect(() => fromEnglishCardinal('1th')).toThrow('Invalid cardinal number')
    expect(() => fromEnglishCardinal('2st')).toThrow('Invalid cardinal number')
    expect(() => fromEnglishCardinal('3nd')).toThrow('Invalid cardinal number')
  })
})
