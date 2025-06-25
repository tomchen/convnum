import { expect, test, describe } from 'bun:test'
import { toBin, fromBin, toOct, fromOct, toHex, fromHex } from '../src'

describe('Binary conversions', () => {
  test('toBin should convert numbers to binary strings', () => {
    expect(toBin(0)).toBe('0')
    expect(toBin(1)).toBe('1')
    expect(toBin(10)).toBe('1010')
    expect(toBin(255)).toBe('11111111')
  })

  test('toBin should support prefix options', () => {
    expect(toBin(10, false)).toBe('1010')
    expect(toBin(10, 'lower')).toBe('0b1010')
    expect(toBin(10, 'upper')).toBe('0B1010')
    expect(toBin(255, 'lower')).toBe('0b11111111')
    expect(toBin(255, 'upper')).toBe('0B11111111')
  })

  test('fromBin should convert binary strings to numbers', () => {
    expect(fromBin('0')).toBe(0)
    expect(fromBin('1')).toBe(1)
    expect(fromBin('1010')).toBe(10)
    expect(fromBin('11111111')).toBe(255)
  })

  test('fromBin should handle prefixed binary strings', () => {
    expect(fromBin('0b1010')).toBe(10)
    expect(fromBin('0B1010')).toBe(10)
    expect(fromBin('0b11111111')).toBe(255)
    expect(fromBin('0B11111111')).toBe(255)
    expect(fromBin('0b0')).toBe(0)
    expect(fromBin('0B1')).toBe(1)
  })

  test('fromBin should handle leading zeros in various formats', () => {
    // Test without prefix
    expect(fromBin('1')).toBe(1)
    expect(fromBin('01')).toBe(1)
    expect(fromBin('001')).toBe(1)
    expect(fromBin('0001')).toBe(1)
    expect(fromBin('00010')).toBe(2)

    // Test with 0b prefix
    expect(fromBin('0b1')).toBe(1)
    expect(fromBin('0b01')).toBe(1)
    expect(fromBin('0b001')).toBe(1)
    expect(fromBin('0b0001')).toBe(1)
    expect(fromBin('0b00010')).toBe(2)

    // Test with 0B prefix
    expect(fromBin('0B1')).toBe(1)
    expect(fromBin('0B01')).toBe(1)
    expect(fromBin('0B001')).toBe(1)
    expect(fromBin('0B0001')).toBe(1)
    expect(fromBin('0B00010')).toBe(2)

    // Test larger values with leading zeros
    expect(fromBin('0b00001010')).toBe(10)
    expect(fromBin('0000111111')).toBe(63) // 6 ones in binary
  })

  test('should handle invalid binary strings', () => {
    expect(() => fromBin('123')).toThrow()
    expect(() => fromBin('abc')).toThrow()
    expect(() => fromBin('0b2')).toThrow()
    expect(() => fromBin('0B9')).toThrow()
  })
})

describe('Octal conversions', () => {
  test('toOct should convert numbers to octal strings', () => {
    expect(toOct(0)).toBe('0')
    expect(toOct(8)).toBe('10')
    expect(toOct(64)).toBe('100')
    expect(toOct(511)).toBe('777')
  })

  test('toOct should support prefix options', () => {
    expect(toOct(8, false)).toBe('10')
    expect(toOct(8, 'lower')).toBe('0o10')
    expect(toOct(8, 'upper')).toBe('0O10')
    expect(toOct(511, 'lower')).toBe('0o777')
    expect(toOct(511, 'upper')).toBe('0O777')
  })

  test('fromOct should convert octal strings to numbers', () => {
    expect(fromOct('0')).toBe(0)
    expect(fromOct('10')).toBe(8)
    expect(fromOct('100')).toBe(64)
    expect(fromOct('777')).toBe(511)
  })

  test('fromOct should handle prefixed octal strings', () => {
    expect(fromOct('0o10')).toBe(8)
    expect(fromOct('0O10')).toBe(8)
    expect(fromOct('0o777')).toBe(511)
    expect(fromOct('0O777')).toBe(511)
    expect(fromOct('0o0')).toBe(0)
    expect(fromOct('0O7')).toBe(7)
  })

  test('fromOct should handle leading zeros in various formats', () => {
    // Test without prefix
    expect(fromOct('1')).toBe(1)
    expect(fromOct('01')).toBe(1)
    expect(fromOct('001')).toBe(1)
    expect(fromOct('0001')).toBe(1)
    expect(fromOct('00010')).toBe(8)

    // Test with 0o prefix
    expect(fromOct('0o1')).toBe(1)
    expect(fromOct('0o01')).toBe(1)
    expect(fromOct('0o001')).toBe(1)
    expect(fromOct('0o0001')).toBe(1)
    expect(fromOct('0o00010')).toBe(8)

    // Test with 0O prefix
    expect(fromOct('0O1')).toBe(1)
    expect(fromOct('0O01')).toBe(1)
    expect(fromOct('0O001')).toBe(1)
    expect(fromOct('0O0001')).toBe(1)
    expect(fromOct('0O00010')).toBe(8)

    // Test larger values with leading zeros
    expect(fromOct('0o000100')).toBe(64)
    expect(fromOct('000777')).toBe(511)
  })

  test('should handle invalid octal strings', () => {
    expect(() => fromOct('9')).toThrow()
    expect(() => fromOct('abc')).toThrow()
    expect(() => fromOct('0o8')).toThrow()
    expect(() => fromOct('0O9')).toThrow()
  })
})

describe('Hexadecimal conversions', () => {
  test('toHex should convert numbers to hex strings', () => {
    expect(toHex(0)).toBe('0')
    expect(toHex(10)).toBe('a')
    expect(toHex(255)).toBe('ff')
    expect(toHex(4096)).toBe('1000')
  })

  test('toHex should support prefix options', () => {
    expect(toHex(255, false)).toBe('ff')
    expect(toHex(255, 'lower')).toBe('0xff')
    expect(toHex(255, 'upper')).toBe('0XFF')
    expect(toHex(171, 'lower')).toBe('0xab')
    expect(toHex(171, 'upper')).toBe('0XAB')
  })

  test('fromHex should convert hex strings to numbers', () => {
    expect(fromHex('0')).toBe(0)
    expect(fromHex('a')).toBe(10)
    expect(fromHex('ff')).toBe(255)
    expect(fromHex('1000')).toBe(4096)
  })

  test('fromHex should handle prefixed hex strings', () => {
    expect(fromHex('0xff')).toBe(255)
    expect(fromHex('0xFF')).toBe(255)
    expect(fromHex('0Xff')).toBe(255)
    expect(fromHex('0xaB')).toBe(171)
    expect(fromHex('0XAB')).toBe(171)
    expect(fromHex('0x0')).toBe(0)
    expect(fromHex('0Xa')).toBe(10)
  })

  test('fromHex should handle leading zeros in various formats', () => {
    // Test without prefix
    expect(fromHex('1')).toBe(1)
    expect(fromHex('01')).toBe(1)
    expect(fromHex('001')).toBe(1)
    expect(fromHex('0001')).toBe(1)
    expect(fromHex('00010')).toBe(16)

    // Test with 0x prefix
    expect(fromHex('0x1')).toBe(1)
    expect(fromHex('0x01')).toBe(1)
    expect(fromHex('0x001')).toBe(1)
    expect(fromHex('0x0001')).toBe(1)
    expect(fromHex('0x00010')).toBe(16)

    // Test with 0X prefix
    expect(fromHex('0X1')).toBe(1)
    expect(fromHex('0X01')).toBe(1)
    expect(fromHex('0X001')).toBe(1)
    expect(fromHex('0X0001')).toBe(1)
    expect(fromHex('0X00010')).toBe(16)

    // Test larger values with leading zeros
    expect(fromHex('0x000ff')).toBe(255)
    expect(fromHex('0x0000100')).toBe(256)
    expect(fromHex('000abc')).toBe(2748) // 0xabc = 2748
  })

  test('should handle invalid hex strings', () => {
    expect(() => fromHex('g')).toThrow()
    expect(() => fromHex('xyz')).toThrow()
    expect(() => fromHex('0xg')).toThrow()
    expect(() => fromHex('0Xz')).toThrow()
  })
})
