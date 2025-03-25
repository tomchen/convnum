import { expect, test, describe } from 'bun:test'
import { toBin, fromBin, toOct, fromOct, toHex, fromHex } from '../src'

describe('Binary conversions', () => {
  test('toBin should convert numbers to binary strings', () => {
    expect(toBin(0)).toBe('0')
    expect(toBin(1)).toBe('1')
    expect(toBin(10)).toBe('1010')
    expect(toBin(255)).toBe('11111111')
  })

  test('fromBin should convert binary strings to numbers', () => {
    expect(fromBin('0')).toBe(0)
    expect(fromBin('1')).toBe(1)
    expect(fromBin('1010')).toBe(10)
    expect(fromBin('11111111')).toBe(255)
  })

  test('should handle invalid binary strings', () => {
    expect(() => fromBin('123')).toThrow()
    expect(() => fromBin('abc')).toThrow()
  })
})

describe('Octal conversions', () => {
  test('toOct should convert numbers to octal strings', () => {
    expect(toOct(0)).toBe('0')
    expect(toOct(8)).toBe('10')
    expect(toOct(64)).toBe('100')
    expect(toOct(511)).toBe('777')
  })

  test('fromOct should convert octal strings to numbers', () => {
    expect(fromOct('0')).toBe(0)
    expect(fromOct('10')).toBe(8)
    expect(fromOct('100')).toBe(64)
    expect(fromOct('777')).toBe(511)
  })

  test('should handle invalid octal strings', () => {
    expect(() => fromOct('9')).toThrow()
    expect(() => fromOct('abc')).toThrow()
  })
})

describe('Hexadecimal conversions', () => {
  test('toHex should convert numbers to hex strings', () => {
    expect(toHex(0)).toBe('0')
    expect(toHex(10)).toBe('a')
    expect(toHex(255)).toBe('ff')
    expect(toHex(4096)).toBe('1000')
  })

  test('fromHex should convert hex strings to numbers', () => {
    expect(fromHex('0')).toBe(0)
    expect(fromHex('a')).toBe(10)
    expect(fromHex('ff')).toBe(255)
    expect(fromHex('1000')).toBe(4096)
  })

  test('should handle invalid hex strings', () => {
    expect(() => fromHex('g')).toThrow()
    expect(() => fromHex('xyz')).toThrow()
  })
})
