import { expect, test, describe } from 'bun:test'
import { toEnglishWords, fromEnglishWords, validateEnglishWords } from '../src'

const arr = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
  'twenty-one',
  'twenty-two',
  'twenty-three',
  'twenty-four',
  'twenty-five',
  'twenty-six',
  'twenty-seven',
  'twenty-eight',
  'twenty-nine',
  'thirty',
  'thirty-one',
  'thirty-two',
  'thirty-three',
  'thirty-four',
  'thirty-five',
  'thirty-six',
  'thirty-seven',
  'thirty-eight',
  'thirty-nine',
  'forty',
  'forty-one',
  'forty-two',
  'forty-three',
  'forty-four',
  'forty-five',
  'forty-six',
  'forty-seven',
  'forty-eight',
  'forty-nine',
  'fifty',
  'fifty-one',
  'fifty-two',
  'fifty-three',
  'fifty-four',
  'fifty-five',
  'fifty-six',
  'fifty-seven',
  'fifty-eight',
  'fifty-nine',
  'sixty',
  'sixty-one',
  'sixty-two',
  'sixty-three',
  'sixty-four',
  'sixty-five',
  'sixty-six',
  'sixty-seven',
  'sixty-eight',
  'sixty-nine',
  'seventy',
  'seventy-one',
  'seventy-two',
  'seventy-three',
  'seventy-four',
  'seventy-five',
  'seventy-six',
  'seventy-seven',
  'seventy-eight',
  'seventy-nine',
  'eighty',
  'eighty-one',
  'eighty-two',
  'eighty-three',
  'eighty-four',
  'eighty-five',
  'eighty-six',
  'eighty-seven',
  'eighty-eight',
  'eighty-nine',
  'ninety',
  'ninety-one',
  'ninety-two',
  'ninety-three',
  'ninety-four',
  'ninety-five',
  'ninety-six',
  'ninety-seven',
  'ninety-eight',
  'ninety-nine',
  'one hundred',
  'one hundred one',
  'one hundred two',
  'one hundred three',
  'one hundred four',
  'one hundred five',
  'one hundred six',
  'one hundred seven',
  'one hundred eight',
  'one hundred nine',
  'one hundred ten',
  'one hundred eleven',
  'one hundred twelve',
  'one hundred thirteen',
  'one hundred fourteen',
  'one hundred fifteen',
  'one hundred sixteen',
  'one hundred seventeen',
  'one hundred eighteen',
  'one hundred nineteen',
  'one hundred twenty',
  'one hundred twenty-one',
  'one hundred twenty-two',
  'one hundred twenty-three',
  'one hundred twenty-four',
  'one hundred twenty-five',
  'one hundred twenty-six',
  'one hundred twenty-seven',
  'one hundred twenty-eight',
  'one hundred twenty-nine',
  'one hundred thirty',
  'one hundred thirty-one',
]

describe('English number word conversions', () => {
  // Basic conversions - toEnglishWords
  describe('toEnglishWords - basic conversions', () => {
    test('should convert single-digit numbers correctly', () => {
      expect(toEnglishWords(0)).toBe('zero')
      expect(toEnglishWords(1)).toBe('one')
      expect(toEnglishWords(2)).toBe('two')
      expect(toEnglishWords(3)).toBe('three')
      expect(toEnglishWords(4)).toBe('four')
      expect(toEnglishWords(5)).toBe('five')
      expect(toEnglishWords(6)).toBe('six')
      expect(toEnglishWords(7)).toBe('seven')
      expect(toEnglishWords(8)).toBe('eight')
      expect(toEnglishWords(9)).toBe('nine')
    })

    test('should convert teen numbers correctly', () => {
      expect(toEnglishWords(10)).toBe('ten')
      expect(toEnglishWords(11)).toBe('eleven')
      expect(toEnglishWords(12)).toBe('twelve')
      expect(toEnglishWords(13)).toBe('thirteen')
      expect(toEnglishWords(14)).toBe('fourteen')
      expect(toEnglishWords(15)).toBe('fifteen')
      expect(toEnglishWords(16)).toBe('sixteen')
      expect(toEnglishWords(17)).toBe('seventeen')
      expect(toEnglishWords(18)).toBe('eighteen')
      expect(toEnglishWords(19)).toBe('nineteen')
    })

    test('should convert multiples of ten correctly', () => {
      expect(toEnglishWords(20)).toBe('twenty')
      expect(toEnglishWords(30)).toBe('thirty')
      expect(toEnglishWords(40)).toBe('forty')
      expect(toEnglishWords(50)).toBe('fifty')
      expect(toEnglishWords(60)).toBe('sixty')
      expect(toEnglishWords(70)).toBe('seventy')
      expect(toEnglishWords(80)).toBe('eighty')
      expect(toEnglishWords(90)).toBe('ninety')
    })

    test('should convert two-digit numbers with hyphens correctly', () => {
      expect(toEnglishWords(21)).toBe('twenty-one')
      expect(toEnglishWords(34)).toBe('thirty-four')
      expect(toEnglishWords(49)).toBe('forty-nine')
      expect(toEnglishWords(65)).toBe('sixty-five')
      expect(toEnglishWords(78)).toBe('seventy-eight')
      expect(toEnglishWords(83)).toBe('eighty-three')
      expect(toEnglishWords(92)).toBe('ninety-two')
      expect(toEnglishWords(99)).toBe('ninety-nine')
    })

    test('should convert hundreds correctly', () => {
      expect(toEnglishWords(100)).toBe('one hundred')
      expect(toEnglishWords(200)).toBe('two hundred')
      expect(toEnglishWords(300)).toBe('three hundred')
      expect(toEnglishWords(400)).toBe('four hundred')
      expect(toEnglishWords(500)).toBe('five hundred')
      expect(toEnglishWords(600)).toBe('six hundred')
      expect(toEnglishWords(700)).toBe('seven hundred')
      expect(toEnglishWords(800)).toBe('eight hundred')
      expect(toEnglishWords(900)).toBe('nine hundred')
    })

    test('should convert three-digit numbers correctly', () => {
      expect(toEnglishWords(101)).toBe('one hundred one')
      expect(toEnglishWords(111)).toBe('one hundred eleven')
      expect(toEnglishWords(123)).toBe('one hundred twenty-three')
      expect(toEnglishWords(246)).toBe('two hundred forty-six')
      expect(toEnglishWords(370)).toBe('three hundred seventy')
      expect(toEnglishWords(405)).toBe('four hundred five')
      expect(toEnglishWords(568)).toBe('five hundred sixty-eight')
      expect(toEnglishWords(684)).toBe('six hundred eighty-four')
      expect(toEnglishWords(792)).toBe('seven hundred ninety-two')
      expect(toEnglishWords(815)).toBe('eight hundred fifteen')
      expect(toEnglishWords(999)).toBe('nine hundred ninety-nine')
    })

    test('should convert thousands correctly', () => {
      expect(toEnglishWords(1000)).toBe('one thousand')
      expect(toEnglishWords(2000)).toBe('two thousand')
      expect(toEnglishWords(5000)).toBe('five thousand')
      expect(toEnglishWords(1001)).toBe('one thousand one')
      expect(toEnglishWords(1234)).toBe('one thousand two hundred thirty-four')
      expect(toEnglishWords(2345)).toBe('two thousand three hundred forty-five')
      expect(toEnglishWords(5678)).toBe(
        'five thousand six hundred seventy-eight',
      )
      expect(toEnglishWords(9999)).toBe(
        'nine thousand nine hundred ninety-nine',
      )
    })

    test('should convert ten thousands correctly', () => {
      expect(toEnglishWords(10000)).toBe('ten thousand')
      expect(toEnglishWords(12000)).toBe('twelve thousand')
      expect(toEnglishWords(20000)).toBe('twenty thousand')
      expect(toEnglishWords(24680)).toBe(
        'twenty-four thousand six hundred eighty',
      )
      expect(toEnglishWords(35791)).toBe(
        'thirty-five thousand seven hundred ninety-one',
      )
      expect(toEnglishWords(99999)).toBe(
        'ninety-nine thousand nine hundred ninety-nine',
      )
    })

    test('should convert hundred thousands correctly', () => {
      expect(toEnglishWords(100000)).toBe('one hundred thousand')
      expect(toEnglishWords(250000)).toBe('two hundred fifty thousand')
      expect(toEnglishWords(345678)).toBe(
        'three hundred forty-five thousand six hundred seventy-eight',
      )
      expect(toEnglishWords(999999)).toBe(
        'nine hundred ninety-nine thousand nine hundred ninety-nine',
      )
    })

    test('should convert millions correctly', () => {
      expect(toEnglishWords(1000000)).toBe('one million')
      expect(toEnglishWords(2500000)).toBe('two million five hundred thousand')
      expect(toEnglishWords(3456789)).toBe(
        'three million four hundred fifty-six thousand seven hundred eighty-nine',
      )
      expect(toEnglishWords(9999999)).toBe(
        'nine million nine hundred ninety-nine thousand nine hundred ninety-nine',
      )
    })

    test('should convert large numbers correctly', () => {
      expect(toEnglishWords(10000000)).toBe('ten million')
      expect(toEnglishWords(100000000)).toBe('one hundred million')
      expect(toEnglishWords(1000000000)).toBe('one billion')
      expect(toEnglishWords(10000000000)).toBe('ten billion')
      expect(toEnglishWords(100000000000)).toBe('one hundred billion')
      expect(toEnglishWords(1000000000000)).toBe('one trillion')
      expect(toEnglishWords(1000000000000000)).toBe('one quadrillion')
      expect(toEnglishWords(1000000000000000000)).toBe('one quintillion')
    })

    test('should convert complex large numbers correctly', () => {
      expect(toEnglishWords(1234567890)).toBe(
        'one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety',
      )
      expect(toEnglishWords(9876543210)).toBe(
        'nine billion eight hundred seventy-six million five hundred forty-three thousand two hundred ten',
      )

      // Test a number with all possible word components
      const complexNumber = 987654321098765
      expect(toEnglishWords(complexNumber)).toBe(
        'nine hundred eighty-seven trillion six hundred fifty-four billion three hundred twenty-one million ninety-eight thousand seven hundred sixty-five',
      )
    })
  })

  // Edge cases and special values - toEnglishWords
  describe('toEnglishWords - edge cases and special values', () => {
    test('should handle zero correctly', () => {
      expect(toEnglishWords(0)).toBe('zero')
    })

    test('should handle negative numbers correctly', () => {
      expect(toEnglishWords(-1)).toBe('negative one')
      expect(toEnglishWords(-15)).toBe('negative fifteen')
      expect(toEnglishWords(-100)).toBe('negative one hundred')
      expect(toEnglishWords(-1234)).toBe(
        'negative one thousand two hundred thirty-four',
      )
      expect(toEnglishWords(-1000000)).toBe('negative one million')
    })

    test('should reject invalid inputs', () => {
      expect(() => toEnglishWords(NaN)).toThrow('Input must be a finite number')
      expect(() => toEnglishWords(Infinity)).toThrow(
        'Input must be a finite number',
      )
      expect(() => toEnglishWords(-Infinity)).toThrow(
        'Input must be a finite number',
      )
    })

    test('should handle very large numbers', () => {
      // JavaScript's largest safe integer
      // eslint-disable-next-line compat/compat
      const maxSafeInteger = Number.MAX_SAFE_INTEGER
      expect(toEnglishWords(maxSafeInteger)).toBeDefined()
      expect(toEnglishWords(maxSafeInteger).length).toBeGreaterThan(100)
    })
  })

  describe('toEnglishWords should handle arr', () => {
    test('toEnglishWords should handle arr', () => {
      arr.forEach((item, index) => {
        expect(toEnglishWords(index)).toBe(item)
      })
    })
  })

  // Basic conversions - fromEnglishWords
  describe('fromEnglishWords - basic conversions', () => {
    test('should convert single-digit numbers correctly', () => {
      expect(fromEnglishWords('zero')).toBe(0)
      expect(fromEnglishWords('one')).toBe(1)
      expect(fromEnglishWords('two')).toBe(2)
      expect(fromEnglishWords('three')).toBe(3)
      expect(fromEnglishWords('four')).toBe(4)
      expect(fromEnglishWords('five')).toBe(5)
      expect(fromEnglishWords('six')).toBe(6)
      expect(fromEnglishWords('seven')).toBe(7)
      expect(fromEnglishWords('eight')).toBe(8)
      expect(fromEnglishWords('nine')).toBe(9)
    })

    test('should convert teen numbers correctly', () => {
      expect(fromEnglishWords('ten')).toBe(10)
      expect(fromEnglishWords('eleven')).toBe(11)
      expect(fromEnglishWords('twelve')).toBe(12)
      expect(fromEnglishWords('thirteen')).toBe(13)
      expect(fromEnglishWords('fourteen')).toBe(14)
      expect(fromEnglishWords('fifteen')).toBe(15)
      expect(fromEnglishWords('sixteen')).toBe(16)
      expect(fromEnglishWords('seventeen')).toBe(17)
      expect(fromEnglishWords('eighteen')).toBe(18)
      expect(fromEnglishWords('nineteen')).toBe(19)
    })

    test('should convert multiples of ten correctly', () => {
      expect(fromEnglishWords('twenty')).toBe(20)
      expect(fromEnglishWords('thirty')).toBe(30)
      expect(fromEnglishWords('forty')).toBe(40)
      expect(fromEnglishWords('fifty')).toBe(50)
      expect(fromEnglishWords('sixty')).toBe(60)
      expect(fromEnglishWords('seventy')).toBe(70)
      expect(fromEnglishWords('eighty')).toBe(80)
      expect(fromEnglishWords('ninety')).toBe(90)
    })

    test('should convert two-digit numbers with hyphens correctly', () => {
      expect(fromEnglishWords('twenty-one')).toBe(21)
      expect(fromEnglishWords('thirty-four')).toBe(34)
      expect(fromEnglishWords('forty-nine')).toBe(49)
      expect(fromEnglishWords('sixty-five')).toBe(65)
      expect(fromEnglishWords('seventy-eight')).toBe(78)
      expect(fromEnglishWords('eighty-three')).toBe(83)
      expect(fromEnglishWords('ninety-two')).toBe(92)
      expect(fromEnglishWords('ninety-nine')).toBe(99)
    })

    test('should convert two-digit numbers without hyphens correctly', () => {
      expect(fromEnglishWords('twenty one')).toBe(21)
      expect(fromEnglishWords('thirty four')).toBe(34)
      expect(fromEnglishWords('forty nine')).toBe(49)
      expect(fromEnglishWords('sixty five')).toBe(65)
    })

    test('should convert hundreds correctly', () => {
      expect(fromEnglishWords('one hundred')).toBe(100)
      expect(fromEnglishWords('two hundred')).toBe(200)
      expect(fromEnglishWords('three hundred')).toBe(300)
      expect(fromEnglishWords('nine hundred')).toBe(900)
    })

    test('should convert three-digit numbers correctly', () => {
      expect(fromEnglishWords('one hundred one')).toBe(101)
      expect(fromEnglishWords('one hundred eleven')).toBe(111)
      expect(fromEnglishWords('one hundred twenty-three')).toBe(123)
      expect(fromEnglishWords('two hundred forty-six')).toBe(246)
      expect(fromEnglishWords('three hundred seventy')).toBe(370)
      expect(fromEnglishWords('four hundred five')).toBe(405)
      expect(fromEnglishWords('nine hundred ninety-nine')).toBe(999)
    })

    test('should convert thousands correctly', () => {
      expect(fromEnglishWords('one thousand')).toBe(1000)
      expect(fromEnglishWords('two thousand three hundred forty-five')).toBe(
        2345,
      )
      expect(fromEnglishWords('five thousand six hundred seventy-eight')).toBe(
        5678,
      )
      expect(fromEnglishWords('nine thousand nine hundred ninety-nine')).toBe(
        9999,
      )
    })

    test('should convert ten thousands correctly', () => {
      expect(fromEnglishWords('ten thousand')).toBe(10000)
      expect(fromEnglishWords('twelve thousand')).toBe(12000)
      expect(fromEnglishWords('twenty thousand')).toBe(20000)
      expect(fromEnglishWords('twenty-four thousand six hundred eighty')).toBe(
        24680,
      )
      expect(
        fromEnglishWords('thirty-five thousand seven hundred ninety-one'),
      ).toBe(35791)
      expect(
        fromEnglishWords('ninety-nine thousand nine hundred ninety-nine'),
      ).toBe(99999)
    })

    test('should convert hundred thousands correctly', () => {
      expect(fromEnglishWords('one hundred thousand')).toBe(100000)
      expect(fromEnglishWords('two hundred fifty thousand')).toBe(250000)
      expect(
        fromEnglishWords(
          'three hundred forty-five thousand six hundred seventy-eight',
        ),
      ).toBe(345678)
      expect(
        fromEnglishWords(
          'nine hundred ninety-nine thousand nine hundred ninety-nine',
        ),
      ).toBe(999999)
    })

    test('should convert millions correctly', () => {
      expect(fromEnglishWords('one million')).toBe(1000000)
      expect(fromEnglishWords('two million five hundred thousand')).toBe(
        2500000,
      )
      expect(
        fromEnglishWords(
          'three million four hundred fifty-six thousand seven hundred eighty-nine',
        ),
      ).toBe(3456789)
      expect(
        fromEnglishWords(
          'nine million nine hundred ninety-nine thousand nine hundred ninety-nine',
        ),
      ).toBe(9999999)
    })

    test('should convert large numbers correctly', () => {
      expect(fromEnglishWords('ten million')).toBe(10000000)
      expect(fromEnglishWords('one hundred million')).toBe(100000000)
      expect(fromEnglishWords('one billion')).toBe(1000000000)
      expect(fromEnglishWords('ten billion')).toBe(10000000000)
      expect(fromEnglishWords('one hundred billion')).toBe(100000000000)
      expect(fromEnglishWords('one trillion')).toBe(1000000000000)
      expect(fromEnglishWords('one quadrillion')).toBe(1000000000000000)
      expect(fromEnglishWords('one quintillion')).toBe(1000000000000000000)
    })

    test('should convert complex large numbers correctly', () => {
      expect(
        fromEnglishWords(
          'one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety',
        ),
      ).toBe(1234567890)
      expect(
        fromEnglishWords(
          'nine billion eight hundred seventy-six million five hundred forty-three thousand two hundred ten',
        ),
      ).toBe(9876543210)

      // Test a number with all possible word components
      const complexText =
        'nine hundred eighty-seven trillion six hundred fifty-four billion three hundred twenty-one million ninety-eight thousand seven hundred sixty-five'
      expect(fromEnglishWords(complexText)).toBe(987654321098765)
    })
  })

  // Format variations - fromEnglishWords
  describe('fromEnglishWords - format variations', () => {
    test('should handle numbers with "and" in them', () => {
      expect(fromEnglishWords('one hundred and one')).toBe(101)
      expect(fromEnglishWords('one thousand and one')).toBe(1001)
      expect(fromEnglishWords('one thousand two hundred and thirty-four')).toBe(
        1234,
      )
      expect(
        fromEnglishWords('one thousand, two hundred and thirty-four'),
      ).toBe(1234)
      expect(fromEnglishWords('one million and five')).toBe(1000005)
    })

    test('should handle numbers with commas', () => {
      expect(fromEnglishWords('one thousand, two hundred, thirty-four')).toBe(
        1234,
      )
      expect(
        fromEnglishWords(
          'one million, five hundred thousand, four hundred twenty-five',
        ),
      ).toBe(1500425)
    })

    test('should be case insensitive', () => {
      expect(fromEnglishWords('One')).toBe(1)
      expect(fromEnglishWords('TWENTY')).toBe(20)
      expect(fromEnglishWords('Fifty-Five')).toBe(55)
      expect(fromEnglishWords('One Hundred Twenty-Three')).toBe(123)
      expect(fromEnglishWords('ONE THOUSAND')).toBe(1000)
    })

    test('should handle various spacing and formatting', () => {
      expect(fromEnglishWords('twenty  one')).toBe(21) // Extra spaces
      expect(fromEnglishWords(' fifty five ')).toBe(55) // Leading/trailing spaces
      expect(fromEnglishWords('one-hundred')).toBe(100) // Alternative hyphenation
      expect(fromEnglishWords('two-hundred-and-fifty')).toBe(250) // Extra hyphens
    })
  })

  // Edge cases and special values - fromEnglishWords
  describe('fromEnglishWords - edge cases and special values', () => {
    test('should handle zero correctly', () => {
      expect(fromEnglishWords('zero')).toBe(0)
    })

    test('should handle negative numbers correctly', () => {
      expect(fromEnglishWords('negative one')).toBe(-1)
      expect(fromEnglishWords('negative fifteen')).toBe(-15)
      expect(fromEnglishWords('negative one hundred')).toBe(-100)
      expect(
        fromEnglishWords('negative one thousand two hundred thirty-four'),
      ).toBe(-1234)
      expect(fromEnglishWords('negative one million')).toBe(-1000000)
    })

    test('should reject invalid inputs', () => {
      expect(() => fromEnglishWords('')).toThrow()
      expect(() => fromEnglishWords('   ')).toThrow()
      expect(() => fromEnglishWords('abc')).toThrow()
      expect(() => fromEnglishWords('onety-one')).toThrow()
    })

    test('should reject badly formed number words', () => {
      expect(() => fromEnglishWords('twenty-zillion')).toThrow() // Non-existent "zillion"
      expect(() => fromEnglishWords('eleventeen')).toThrow() // Non-existent "eleventeen"
    })
  })

  describe('fromEnglishWords should handle arr', () => {
    test('fromEnglishWords should handle arr', () => {
      arr.forEach((item, index) => {
        expect(fromEnglishWords(item)).toBe(index)
      })
    })
  })

  // Round-trip conversion tests
  describe('Round-trip conversions', () => {
    test('round-trip conversions should yield the original value', () => {
      // Test a range of numbers from 0 to 1000, stepping by 37 (arbitrary prime-ish number)
      for (let num = 0; num <= 1000; num += 37) {
        expect(fromEnglishWords(toEnglishWords(num))).toBe(num)
      }

      // Test some larger numbers
      const largeNumbers = [
        1234, 9876, 10000, 123456, 999999, 1000000, 1234567, 10000000,
        1000000000, 1234567890,
      ]

      for (const num of largeNumbers) {
        expect(fromEnglishWords(toEnglishWords(num))).toBe(num)
      }

      // Test negative numbers
      const negativeNumbers = [-1, -42, -100, -999, -1234, -1000000]

      for (const num of negativeNumbers) {
        expect(fromEnglishWords(toEnglishWords(num))).toBe(num)
      }
    })
  })

  // Specific test cases for known issues or common scenarios
  describe('Specific test cases', () => {
    test('should handle common year expressions correctly', () => {
      expect(fromEnglishWords('nineteen hundred')).toBe(1900)
      expect(fromEnglishWords('nineteen hundred and one')).toBe(1901)
      expect(fromEnglishWords('two thousand')).toBe(2000)
      expect(fromEnglishWords('two thousand and one')).toBe(2001)
    })

    test('should handle financial expressions correctly', () => {
      expect(fromEnglishWords('one million two hundred fifty thousand')).toBe(
        1250000,
      )
      expect(() => fromEnglishWords('three point five million')).toThrow() // Decimal expressions not supported
      expect(fromEnglishWords('five hundred thousand')).toBe(500000)
      expect(fromEnglishWords('one billion')).toBe(1000000000)
    })

    test('should reject uncommon or other unsupported usage', () => {
      expect(() => fromEnglishWords('a dozen')).toThrow()
      expect(() => fromEnglishWords('half a million')).toThrow()
      expect(() => fromEnglishWords('one oh one')).toThrow()
      expect(() => fromEnglishWords('double zero')).toThrow()
    })

    test('should allow some uncommon usage but result may be unexpected', () => {
      expect(fromEnglishWords('twenty-hundred')).toBe(2000)
      expect(fromEnglishWords('hundred one')).toBe(1)
      expect(fromEnglishWords('thousand five')).toBe(5)
      expect(fromEnglishWords('twenty twenty')).toBe(40)
      expect(fromEnglishWords('twenty twenty-one')).toBe(41)
      expect(fromEnglishWords('twenty twenty-three')).toBe(43)
      expect(fromEnglishWords('twenty four seven')).toBe(31)
    })
  })

  // Error message clarity tests
  describe('Error message clarity', () => {
    test('toEnglishWords should provide clear error messages', () => {
      try {
        toEnglishWords(NaN)
        // Should have thrown an error
      } catch (e) {
        expect((e as Error).message).toContain('finite number')
      }

      try {
        toEnglishWords(Infinity)
        // Should have thrown an error
      } catch (e) {
        expect((e as Error).message).toContain('finite number')
      }
    })

    test('fromEnglishWords should provide clear error messages for invalid words', () => {
      try {
        fromEnglishWords('gazillion')
        // Should have thrown an error
      } catch (e) {
        expect((e as Error).message).toContain('Invalid word')
      }

      try {
        fromEnglishWords('eleventy')
        // Should have thrown an error
      } catch (e) {
        expect((e as Error).message).toContain('Invalid word')
      }
    })
  })
})

describe('validateEnglishWords', () => {
  test('should validate correct English number words', () => {
    expect(validateEnglishWords('zero')).toBe(true)
    expect(validateEnglishWords('one')).toBe(true)
    expect(validateEnglishWords('twenty-one')).toBe(true)
    expect(validateEnglishWords('one hundred')).toBe(true)
    expect(validateEnglishWords('one thousand two hundred thirty-four')).toBe(
      true,
    )
  })

  test('should reject invalid English number words', () => {
    expect(validateEnglishWords('')).toBe(false)
    expect(validateEnglishWords('invalid')).toBe(false)
    expect(validateEnglishWords('one hundred and one')).toBe(false)
    expect(validateEnglishWords('twenty one')).toBe(false)
    expect(validateEnglishWords('one hundred, one')).toBe(false)
  })

  test('should be case insensitive', () => {
    expect(validateEnglishWords('ZERO')).toBe(true)
    expect(validateEnglishWords('Twenty-One')).toBe(true)
    expect(validateEnglishWords('ONE HUNDRED')).toBe(true)
  })
})
