import { expect, test, describe } from 'bun:test'
import { getTypes, hasType } from '../src'
import { NumType } from '../src/utils/types'

// Helper function to check if two arrays contain the same elements regardless of order
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((val, index) => val === sortedB[index])
}

describe('getTypes function', () => {
  describe('Invalid and edge cases', () => {
    test('arraysEqual works', () => {
      expect(
        arraysEqual(
          ['binary', 'hexadecimal', 'octal', 'decimal'],
          ['binary', 'decimal', 'hexadecimal', 'octal'],
        ),
      ).toBe(true)
      expect(
        arraysEqual(
          ['binary', 'hexadecimal', 'octal', 'decimal'],
          ['binary', 'decimal', 'hexadecimal'],
        ),
      ).toBe(false)
      expect(
        arraysEqual(
          ['binary', 'hexadecimal', 'octal', 'dezcimal'],
          ['binary', 'decimal', 'hexadecimal', 'octal'],
        ),
      ).toBe(false)
    })

    test('should handle invalid inputs', () => {
      expect(getTypes(null as unknown as string)).toEqual(['invalid'])
      expect(getTypes(undefined as unknown as string)).toEqual(['invalid'])
      expect(getTypes(123 as unknown as string)).toEqual(['invalid'])
      expect(getTypes({} as unknown as string)).toEqual(['invalid'])
    })

    test('should handle empty strings', () => {
      expect(getTypes('')).toEqual(['empty'])
      expect(getTypes('   ')).toEqual(['empty'])
      expect(getTypes('\t\n')).toEqual(['empty'])
    })
  })

  describe('Decimal numbers', () => {
    test('should identify positive integers', () => {
      expect(
        arraysEqual(getTypes('0'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('123'), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
      expect(arraysEqual(getTypes('999'), ['decimal', 'hexadecimal'])).toBe(
        true,
      )
    })

    test('should identify negative integers', () => {
      expect(getTypes('-123')).toEqual(['decimal'])
      expect(getTypes('-0')).toEqual(['decimal'])
      expect(getTypes('-999')).toEqual(['decimal'])
    })

    test('should identify decimal numbers', () => {
      expect(getTypes('3.14')).toEqual(['decimal'])
      expect(getTypes('-2.718')).toEqual(['decimal'])
      expect(getTypes('0.001')).toEqual(['decimal'])
    })

    test('should identify numbers with leading zeros', () => {
      expect(
        arraysEqual(getTypes('001'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('007'), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('000123'), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
    })
  })

  describe('Binary numbers', () => {
    test('should identify binary numbers', () => {
      expect(
        arraysEqual(getTypes('0'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('1'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('10'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('101'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('11111111'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
    })

    test('should not identify non-binary strings', () => {
      expect(
        arraysEqual(getTypes('2'), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
      expect(arraysEqual(getTypes('8'), ['decimal', 'hexadecimal'])).toBe(true)
      expect(arraysEqual(getTypes('9'), ['decimal', 'hexadecimal'])).toBe(true)
      expect(arraysEqual(getTypes('A'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
      expect(arraysEqual(getTypes('F'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
    })
  })

  describe('Octal numbers', () => {
    test('should identify octal numbers', () => {
      expect(
        arraysEqual(getTypes('7'), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('10'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('77'), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('100'), [
          'binary',
          'decimal',
          'octal',
          'hexadecimal',
        ]),
      ).toBe(true)
    })

    test('should not identify non-octal strings', () => {
      expect(arraysEqual(getTypes('8'), ['decimal', 'hexadecimal'])).toBe(true)
      expect(arraysEqual(getTypes('9'), ['decimal', 'hexadecimal'])).toBe(true)
      expect(arraysEqual(getTypes('A'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
    })
  })

  describe('Hexadecimal numbers', () => {
    test('should identify hexadecimal numbers', () => {
      expect(arraysEqual(getTypes('A'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
      expect(arraysEqual(getTypes('F'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
      expect(
        arraysEqual(getTypes('10'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
      expect(arraysEqual(getTypes('FF'), ['hexadecimal'])).toBe(true)
      expect(arraysEqual(getTypes('ABC'), ['hexadecimal'])).toBe(true)
      expect(arraysEqual(getTypes('DEF'), ['hexadecimal'])).toBe(true)
    })

    test('should not identify non-hex strings', () => {
      expect(arraysEqual(getTypes('G'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('Z'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('XYZ'), ['unknown'])).toBe(true)
    })
  })

  describe('Roman numerals', () => {
    test('should identify valid Roman numerals', () => {
      expect(arraysEqual(getTypes('I'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('V'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('X'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('L'), ['roman', 'latin_letter'])).toBe(true)
      expect(
        arraysEqual(getTypes('C'), ['hexadecimal', 'roman', 'latin_letter']),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('D'), ['hexadecimal', 'roman', 'latin_letter']),
      ).toBe(true)
      expect(arraysEqual(getTypes('M'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('IV'), ['roman'])).toBe(true)
      expect(arraysEqual(getTypes('IX'), ['roman'])).toBe(true)
      expect(arraysEqual(getTypes('XL'), ['roman'])).toBe(true)
      expect(arraysEqual(getTypes('XC'), ['roman'])).toBe(true)
      expect(arraysEqual(getTypes('CD'), ['roman', 'hexadecimal'])).toBe(true)
      expect(arraysEqual(getTypes('CM'), ['roman'])).toBe(true)
      expect(arraysEqual(getTypes('MMMCMXCIX'), ['roman'])).toBe(true)
      expect(arraysEqual(getTypes('MDCCLXXVI'), ['roman'])).toBe(true)
    })

    test('should identify case-insensitive Roman numerals', () => {
      expect(arraysEqual(getTypes('i'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('v'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('x'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('iv'), ['roman'])).toBe(true)
      expect(arraysEqual(getTypes('ix'), ['roman'])).toBe(true)
    })

    test('should not identify invalid Roman numerals', () => {
      expect(getTypes('IIII')).toEqual(['unknown'])
      expect(getTypes('VV')).toEqual(['unknown'])
      expect(arraysEqual(getTypes('ABC'), ['hexadecimal'])).toBe(true)
      expect(
        arraysEqual(getTypes('123'), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
    })
  })

  describe('Arabic numerals', () => {
    test('should identify Arabic numerals', () => {
      expect(getTypes('٠')).toEqual(['arabic'])
      expect(getTypes('١')).toEqual(['arabic'])
      expect(getTypes('٢')).toEqual(['arabic'])
      expect(getTypes('٣')).toEqual(['arabic'])
      expect(getTypes('٤')).toEqual(['arabic'])
      expect(getTypes('٥')).toEqual(['arabic'])
      expect(getTypes('٦')).toEqual(['arabic'])
      expect(getTypes('٧')).toEqual(['arabic'])
      expect(getTypes('٨')).toEqual(['arabic'])
      expect(getTypes('٩')).toEqual(['arabic'])
      expect(getTypes('١٢٣')).toEqual(['arabic'])
      expect(getTypes('٤٥٦')).toEqual(['arabic'])
      expect(getTypes('١٢٣٤٥٦٧٨٩٠')).toEqual(['arabic'])
    })

    test('should identify Arabic numerals with decimal point', () => {
      expect(getTypes('١٢٣.٤٥٦')).toEqual(['arabic'])
      expect(getTypes('٠.١')).toEqual(['arabic'])
    })

    test('should identify Arabic numerals with negative sign', () => {
      expect(getTypes('-١٢٣')).toEqual(['arabic'])
      expect(getTypes('-١٢٣.٤٥٦')).toEqual(['arabic'])
    })

    test('should not identify mixed Arabic and Latin digits', () => {
      expect(getTypes('١2٣')).toEqual(['unknown'])
      expect(getTypes('123٤')).toEqual(['unknown'])
    })
  })

  describe('English cardinal numbers', () => {
    test('should identify English cardinal numbers', () => {
      expect(getTypes('1st')).toEqual(['english_cardinal'])
      expect(getTypes('2nd')).toEqual(['english_cardinal'])
      expect(getTypes('3rd')).toEqual(['english_cardinal'])
      expect(getTypes('4th')).toEqual(['english_cardinal'])
      expect(getTypes('5th')).toEqual(['english_cardinal'])
      expect(getTypes('10th')).toEqual(['english_cardinal'])
      expect(getTypes('11th')).toEqual(['english_cardinal'])
      expect(getTypes('12th')).toEqual(['english_cardinal'])
      expect(getTypes('13th')).toEqual(['english_cardinal'])
      expect(getTypes('21st')).toEqual(['english_cardinal'])
      expect(getTypes('22nd')).toEqual(['english_cardinal'])
      expect(getTypes('23rd')).toEqual(['english_cardinal'])
      expect(getTypes('24th')).toEqual(['english_cardinal'])
      expect(getTypes('100th')).toEqual(['english_cardinal'])
      expect(getTypes('101st')).toEqual(['english_cardinal'])
      expect(getTypes('102nd')).toEqual(['english_cardinal'])
      expect(getTypes('103rd')).toEqual(['english_cardinal'])
      expect(getTypes('104th')).toEqual(['english_cardinal'])
    })

    test('should identify English cardinal numbers with mixed case', () => {
      expect(getTypes('2nD')).toEqual(['english_cardinal'])
      expect(getTypes('12TH')).toEqual(['english_cardinal'])
      expect(getTypes('103Rd')).toEqual(['english_cardinal'])
    })

    test('should identify negative English cardinal numbers', () => {
      expect(getTypes('-1st')).toEqual(['english_cardinal'])
      expect(getTypes('-2nd')).toEqual(['english_cardinal'])
      expect(getTypes('-3rd')).toEqual(['english_cardinal'])
      expect(getTypes('-4th')).toEqual(['english_cardinal'])
    })

    test('should not identify invalid English cardinal numbers', () => {
      expect(getTypes('1th')).toEqual(['unknown'])
      expect(getTypes('2st')).toEqual(['unknown'])
      expect(getTypes('3nd')).toEqual(['unknown'])
      expect(getTypes('11st')).toEqual(['unknown'])
      expect(getTypes('12nd')).toEqual(['unknown'])
      expect(getTypes('13rd')).toEqual(['unknown'])
    })
  })

  describe('English words', () => {
    test('should identify basic English number words', () => {
      expect(getTypes('zero')).toEqual(['english_words'])
      expect(getTypes('one')).toEqual(['english_words'])
      expect(getTypes('two')).toEqual(['english_words'])
      expect(getTypes('ten')).toEqual(['english_words'])
      expect(getTypes('eleven')).toEqual(['english_words'])
      expect(getTypes('twenty')).toEqual(['english_words'])
    })

    test('should identify compound English number words', () => {
      expect(getTypes('twenty-one')).toEqual(['english_words'])
      expect(getTypes('one hundred')).toEqual(['english_words'])
      expect(getTypes('one hundred twenty-three')).toEqual(['english_words'])
      expect(getTypes('one thousand')).toEqual(['english_words'])
      expect(getTypes('one million')).toEqual(['english_words'])
      expect(getTypes('one billion')).toEqual(['english_words'])
    })

    test('should identify compound English number words with mixed case', () => {
      expect(getTypes('TWENTy-One')).toEqual(['english_words'])
      expect(getTypes('one hunDREd twenty-three')).toEqual(['english_words'])
      expect(getTypes('one BILLion')).toEqual(['english_words'])
    })

    test('should identify negative English number words', () => {
      expect(getTypes('negative one')).toEqual(['english_words'])
      expect(getTypes('negative five')).toEqual(['english_words'])
      expect(getTypes('negative one hundred')).toEqual(['english_words'])
    })

    test('should not identify invalid English number words', () => {
      expect(getTypes('one two three')).toEqual(['unknown'])
      expect(getTypes('invalid')).toEqual(['unknown'])
      expect(getTypes('one hundred invalid')).toEqual(['unknown'])
      expect(getTypes('hundred')).toEqual(['unknown'])
      expect(getTypes('thousand')).toEqual(['unknown'])
      expect(getTypes('million')).toEqual(['unknown'])
    })
  })

  describe('French words', () => {
    test('should identify basic French number words', () => {
      expect(getTypes('zéro')).toEqual(['french_words'])
      expect(getTypes('un')).toEqual(['french_words'])
      expect(getTypes('deux')).toEqual(['french_words'])
      expect(arraysEqual(getTypes('dix'), ['roman', 'french_words'])).toBe(true)
      expect(getTypes('vingt')).toEqual(['french_words'])
      expect(getTypes('cent')).toEqual(['french_words'])
      expect(getTypes('mille')).toEqual(['french_words'])
    })

    test('should identify compound French number words', () => {
      expect(getTypes('vingt-et-un')).toEqual(['french_words'])
      expect(getTypes('quatre-vingt-dix')).toEqual(['french_words'])
      expect(getTypes('cent vingt-trois')).toEqual(['french_words'])
      expect(getTypes('mille deux cents')).toEqual(['french_words'])
    })

    test('should identify compound French number words with mixed case', () => {
      expect(getTypes('VINGT-et-un')).toEqual(['french_words'])
      expect(getTypes('cent VINGT-TROIS')).toEqual(['french_words'])
      expect(getTypes('MILLE deux cents')).toEqual(['french_words'])
    })

    test('should identify negative French number words', () => {
      expect(getTypes('moins un')).toEqual(['french_words'])
      expect(getTypes('moins vingt')).toEqual(['french_words'])
      expect(getTypes('moins cent')).toEqual(['french_words'])
    })

    test('should not identify invalid French number words', () => {
      expect(getTypes('invalid-french')).toEqual(['unknown'])
      expect(getTypes('not-a-number')).toEqual(['unknown'])
      expect(getTypes('random-words')).toEqual(['unknown'])
    })
  })

  describe('Chinese words', () => {
    test('should identify basic Chinese number words', () => {
      expect(
        arraysEqual(getTypes('零'), ['chinese_words', 'chinese_financial']),
      ).toBe(true)
      expect(arraysEqual(getTypes('一'), ['chinese_words'])).toBe(true)
      expect(arraysEqual(getTypes('二'), ['chinese_words'])).toBe(true)
      expect(arraysEqual(getTypes('十'), ['chinese_words'])).toBe(true)
      expect(arraysEqual(getTypes('百'), ['unknown'])).toBe(true)
      expect(arraysEqual(getTypes('千'), ['unknown'])).toBe(true)
      expect(arraysEqual(getTypes('万'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('亿'), ['chinese_financial'])).toBe(true)
    })

    test('should identify compound Chinese number words', () => {
      expect(getTypes('十一')).toEqual(['chinese_words'])
      expect(getTypes('二十')).toEqual(['chinese_words'])
      expect(getTypes('一百二十三')).toEqual(['chinese_words'])
      expect(getTypes('一千零一')).toEqual(['chinese_words'])
      expect(getTypes('一万二千三百四十五')).toEqual(['chinese_words'])
    })

    test('should identify Chinese number words with decimal point', () => {
      expect(getTypes('三点一四')).toEqual(['chinese_words'])
      expect(getTypes('零点五')).toEqual(['chinese_words'])
      expect(getTypes('负二点七一八')).toEqual(['chinese_words'])
    })

    test('should identify negative Chinese number words', () => {
      expect(getTypes('负一')).toEqual(['chinese_words'])
      expect(getTypes('负十')).toEqual(['chinese_words'])
      expect(getTypes('负一百')).toEqual(['chinese_words'])
    })

    test('should not identify invalid Chinese number words', () => {
      expect(getTypes('无效中文')).toEqual(['unknown'])
      expect(getTypes('不是数字')).toEqual(['unknown'])
      expect(getTypes('随机文字')).toEqual(['unknown'])
    })
  })

  describe('Chinese financial characters', () => {
    test('should identify Chinese financial characters', () => {
      expect(
        arraysEqual(getTypes('零'), ['chinese_words', 'chinese_financial']),
      ).toBe(true) // 零 is both regular and financial
      expect(arraysEqual(getTypes('壹'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('贰'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('叁'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('肆'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('伍'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('陆'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('柒'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('捌'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('玖'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('拾'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('佰'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('仟'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('万'), ['chinese_financial'])).toBe(true)
      expect(arraysEqual(getTypes('亿'), ['chinese_financial'])).toBe(true)
    })

    test('should identify compound Chinese financial characters', () => {
      expect(getTypes('壹佰贰拾叁')).toEqual(['chinese_financial'])
      expect(getTypes('壹仟零壹')).toEqual(['chinese_financial'])
      expect(getTypes('万贰仟叁佰肆拾伍')).toEqual(['chinese_financial'])
    })

    test('should not identify mixed regular and financial characters', () => {
      expect(getTypes('一佰二拾三')).toEqual(['unknown'])
      expect(getTypes('壹百贰十叁')).toEqual(['unknown'])
    })
  })

  describe('Chinese Heavenly Stems (天干)', () => {
    test('should identify all Chinese Heavenly Stems', () => {
      expect(getTypes('甲')).toEqual(['chinese_heavenly_stem'])
      expect(getTypes('乙')).toEqual(['chinese_heavenly_stem'])
      expect(getTypes('丙')).toEqual(['chinese_heavenly_stem'])
      expect(getTypes('丁')).toEqual(['chinese_heavenly_stem'])
      expect(getTypes('戊')).toEqual(['chinese_heavenly_stem'])
      expect(getTypes('己')).toEqual(['chinese_heavenly_stem'])
      expect(getTypes('庚')).toEqual(['chinese_heavenly_stem'])
      expect(getTypes('辛')).toEqual(['chinese_heavenly_stem'])
      expect(getTypes('壬')).toEqual(['chinese_heavenly_stem'])
      expect(getTypes('癸')).toEqual(['chinese_heavenly_stem'])
    })

    test('should not identify invalid Heavenly Stems', () => {
      expect(getTypes('子')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('一')).toEqual(['chinese_words'])
      expect(getTypes('invalid')).toEqual(['unknown'])
    })
  })

  describe('Chinese Earthly Branches (地支)', () => {
    test('should identify all Chinese Earthly Branches', () => {
      expect(getTypes('子')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('丑')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('寅')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('卯')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('辰')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('巳')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('午')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('未')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('申')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('酉')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('戌')).toEqual(['chinese_earthly_branch'])
      expect(getTypes('亥')).toEqual(['chinese_earthly_branch'])
    })

    test('should not identify invalid Earthly Branches', () => {
      expect(getTypes('甲')).toEqual(['chinese_heavenly_stem'])
      expect(getTypes('一')).toEqual(['chinese_words'])
      expect(getTypes('invalid')).toEqual(['unknown'])
    })
  })

  describe('Chinese Solar Terms (节气)', () => {
    test('should identify all Chinese Solar Terms', () => {
      expect(getTypes('立春')).toEqual(['chinese_solar_term'])
      expect(getTypes('雨水')).toEqual(['chinese_solar_term'])
      expect(getTypes('惊蛰')).toEqual(['chinese_solar_term'])
      expect(getTypes('春分')).toEqual(['chinese_solar_term'])
      expect(getTypes('清明')).toEqual(['chinese_solar_term'])
      expect(getTypes('谷雨')).toEqual(['chinese_solar_term'])
      expect(getTypes('立夏')).toEqual(['chinese_solar_term'])
      expect(getTypes('小满')).toEqual(['chinese_solar_term'])
      expect(getTypes('芒种')).toEqual(['chinese_solar_term'])
      expect(getTypes('夏至')).toEqual(['chinese_solar_term'])
      expect(getTypes('小暑')).toEqual(['chinese_solar_term'])
      expect(getTypes('大暑')).toEqual(['chinese_solar_term'])
      expect(getTypes('立秋')).toEqual(['chinese_solar_term'])
      expect(getTypes('处暑')).toEqual(['chinese_solar_term'])
      expect(getTypes('白露')).toEqual(['chinese_solar_term'])
      expect(getTypes('秋分')).toEqual(['chinese_solar_term'])
      expect(getTypes('寒露')).toEqual(['chinese_solar_term'])
      expect(getTypes('霜降')).toEqual(['chinese_solar_term'])
      expect(getTypes('立冬')).toEqual(['chinese_solar_term'])
      expect(getTypes('小雪')).toEqual(['chinese_solar_term'])
      expect(getTypes('大雪')).toEqual(['chinese_solar_term'])
      expect(getTypes('冬至')).toEqual(['chinese_solar_term'])
      expect(getTypes('小寒')).toEqual(['chinese_solar_term'])
      expect(getTypes('大寒')).toEqual(['chinese_solar_term'])
    })

    test('should not identify invalid Solar Terms', () => {
      expect(getTypes('春天')).toEqual(['unknown'])
      expect(getTypes('夏天')).toEqual(['unknown'])
      expect(getTypes('秋天')).toEqual(['unknown'])
      expect(getTypes('冬天')).toEqual(['unknown'])
    })
  })

  describe('Astrological signs', () => {
    test('should identify all astrological signs', () => {
      expect(getTypes('Aries')).toEqual(['astrological_sign'])
      expect(getTypes('Taurus')).toEqual(['astrological_sign'])
      expect(getTypes('Gemini')).toEqual(['astrological_sign'])
      expect(getTypes('Cancer')).toEqual(['astrological_sign'])
      expect(getTypes('Leo')).toEqual(['astrological_sign'])
      expect(getTypes('Virgo')).toEqual(['astrological_sign'])
      expect(getTypes('Libra')).toEqual(['astrological_sign'])
      expect(getTypes('Scorpio')).toEqual(['astrological_sign'])
      expect(getTypes('Sagittarius')).toEqual(['astrological_sign'])
      expect(getTypes('Capricorn')).toEqual(['astrological_sign'])
      expect(getTypes('Aquarius')).toEqual(['astrological_sign'])
      expect(getTypes('Pisces')).toEqual(['astrological_sign'])
    })

    test('should identify case-insensitive astrological signs', () => {
      expect(getTypes('aries')).toEqual(['astrological_sign'])
      expect(getTypes('ARIES')).toEqual(['astrological_sign'])
      expect(getTypes('AqUaRiUs')).toEqual(['astrological_sign'])
    })

    test('should not identify invalid astrological signs', () => {
      expect(getTypes('Ophiuchus')).toEqual(['unknown'])
      expect(getTypes('Invalid')).toEqual(['unknown'])
    })
  })

  describe('NATO phonetic alphabet', () => {
    test('should identify all NATO phonetic alphabet words', () => {
      expect(getTypes('Alfa')).toEqual(['nato_phonetic'])
      expect(getTypes('Bravo')).toEqual(['nato_phonetic'])
      expect(getTypes('Charlie')).toEqual(['nato_phonetic'])
      expect(getTypes('Delta')).toEqual(['nato_phonetic'])
      expect(getTypes('Echo')).toEqual(['nato_phonetic'])
      expect(getTypes('Foxtrot')).toEqual(['nato_phonetic'])
      expect(getTypes('Golf')).toEqual(['nato_phonetic'])
      expect(getTypes('Hotel')).toEqual(['nato_phonetic'])
      expect(getTypes('India')).toEqual(['nato_phonetic'])
      expect(getTypes('Juliett')).toEqual(['nato_phonetic'])
      expect(getTypes('Kilo')).toEqual(['nato_phonetic'])
      expect(getTypes('Lima')).toEqual(['nato_phonetic'])
      expect(getTypes('Mike')).toEqual(['nato_phonetic'])
      expect(
        arraysEqual(getTypes('November'), ['nato_phonetic', 'month_name']),
      ).toBe(true)
      expect(getTypes('Oscar')).toEqual(['nato_phonetic'])
      expect(getTypes('Papa')).toEqual(['nato_phonetic'])
      expect(getTypes('Quebec')).toEqual(['nato_phonetic'])
      expect(getTypes('Romeo')).toEqual(['nato_phonetic'])
      expect(getTypes('Sierra')).toEqual(['nato_phonetic'])
      expect(getTypes('Tango')).toEqual(['nato_phonetic'])
      expect(getTypes('Uniform')).toEqual(['nato_phonetic'])
      expect(getTypes('Victor')).toEqual(['nato_phonetic'])
      expect(getTypes('Whiskey')).toEqual(['nato_phonetic'])
      expect(getTypes('X-ray')).toEqual(['nato_phonetic'])
      expect(getTypes('Yankee')).toEqual(['nato_phonetic'])
      expect(getTypes('Zulu')).toEqual(['nato_phonetic'])
    })

    test('should identify case variations of NATO words', () => {
      expect(getTypes('alfa')).toEqual(['nato_phonetic'])
      expect(getTypes('BRAVO')).toEqual(['nato_phonetic'])
      expect(getTypes('Charlie')).toEqual(['nato_phonetic'])
    })

    test('should identify aliases of NATO words', () => {
      expect(getTypes('Alpha')).toEqual(['nato_phonetic'])
      expect(getTypes('Juliet')).toEqual(['nato_phonetic'])
      expect(getTypes('Xray')).toEqual(['nato_phonetic'])
    })

    test('should not identify invalid NATO words', () => {
      expect(getTypes('Invalid')).toEqual(['unknown'])
      expect(getTypes('NotNATO')).toEqual(['unknown'])
      expect(getTypes('Random')).toEqual(['unknown'])
    })
  })

  describe('Latin letters', () => {
    test('should identify all Latin letters', () => {
      expect(arraysEqual(getTypes('a'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
      expect(arraysEqual(getTypes('b'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
      expect(
        arraysEqual(getTypes('c'), ['hexadecimal', 'latin_letter', 'roman']),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('d'), ['hexadecimal', 'latin_letter', 'roman']),
      ).toBe(true)
      expect(arraysEqual(getTypes('e'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
      expect(arraysEqual(getTypes('f'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
      expect(arraysEqual(getTypes('g'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('h'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('i'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('j'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('k'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('l'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('m'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('n'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('o'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('p'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('q'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('r'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('s'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('t'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('u'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('v'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('w'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('x'), ['roman', 'latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('y'), ['latin_letter'])).toBe(true)
      expect(arraysEqual(getTypes('z'), ['latin_letter'])).toBe(true)
    })

    test('should not identify non-Latin letters', () => {
      expect(getTypes('α')).toEqual(['greek_letter'])
      expect(getTypes('А')).toEqual(['cyrillic_letter'])
      expect(
        arraysEqual(getTypes('1'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
    })
  })

  describe('Greek letters', () => {
    test('should identify all Greek letters', () => {
      expect(getTypes('α')).toEqual(['greek_letter'])
      expect(getTypes('β')).toEqual(['greek_letter'])
      expect(getTypes('γ')).toEqual(['greek_letter'])
      expect(getTypes('δ')).toEqual(['greek_letter'])
      expect(getTypes('ε')).toEqual(['greek_letter'])
      expect(getTypes('ζ')).toEqual(['greek_letter'])
      expect(getTypes('η')).toEqual(['greek_letter'])
      expect(getTypes('θ')).toEqual(['greek_letter'])
      expect(getTypes('ι')).toEqual(['greek_letter'])
      expect(getTypes('κ')).toEqual(['greek_letter'])
      expect(getTypes('λ')).toEqual(['greek_letter'])
      expect(getTypes('μ')).toEqual(['greek_letter'])
      expect(getTypes('ν')).toEqual(['greek_letter'])
      expect(getTypes('ξ')).toEqual(['greek_letter'])
      expect(getTypes('ο')).toEqual(['greek_letter'])
      expect(getTypes('π')).toEqual(['greek_letter'])
      expect(getTypes('ρ')).toEqual(['greek_letter'])
      expect(getTypes('σ')).toEqual(['greek_letter'])
      expect(getTypes('τ')).toEqual(['greek_letter'])
      expect(getTypes('υ')).toEqual(['greek_letter'])
      expect(getTypes('φ')).toEqual(['greek_letter'])
      expect(getTypes('χ')).toEqual(['greek_letter'])
      expect(getTypes('ψ')).toEqual(['greek_letter'])
      expect(getTypes('ω')).toEqual(['greek_letter'])
      expect(getTypes('Α')).toEqual(['greek_letter'])
      expect(getTypes('Β')).toEqual(['greek_letter'])
      expect(getTypes('Γ')).toEqual(['greek_letter'])
      expect(getTypes('Δ')).toEqual(['greek_letter'])
      expect(getTypes('Ε')).toEqual(['greek_letter'])
      expect(getTypes('Ζ')).toEqual(['greek_letter'])
      expect(getTypes('Η')).toEqual(['greek_letter'])
      expect(getTypes('Θ')).toEqual(['greek_letter'])
      expect(getTypes('Ι')).toEqual(['greek_letter'])
      expect(getTypes('Κ')).toEqual(['greek_letter'])
      expect(getTypes('Λ')).toEqual(['greek_letter'])
      expect(getTypes('Μ')).toEqual(['greek_letter'])
      expect(getTypes('Ν')).toEqual(['greek_letter'])
      expect(getTypes('Ξ')).toEqual(['greek_letter'])
      expect(getTypes('Ο')).toEqual(['greek_letter'])
      expect(getTypes('Π')).toEqual(['greek_letter'])
      expect(getTypes('Ρ')).toEqual(['greek_letter'])
      expect(getTypes('Σ')).toEqual(['greek_letter'])
      expect(getTypes('Τ')).toEqual(['greek_letter'])
      expect(getTypes('Υ')).toEqual(['greek_letter'])
      expect(getTypes('Φ')).toEqual(['greek_letter'])
      expect(getTypes('Χ')).toEqual(['greek_letter'])
      expect(getTypes('Ψ')).toEqual(['greek_letter'])
      expect(getTypes('Ω')).toEqual(['greek_letter'])
    })

    test('should handle special Greek letter cases', () => {
      expect(getTypes('ς')).toEqual(['greek_letter']) // Final sigma
      expect(getTypes('σ')).toEqual(['greek_letter']) // Regular sigma
      expect(getTypes('ρ')).toEqual(['greek_letter']) // Rho
      expect(getTypes('ϑ')).toEqual(['unknown']) // Unsupported Theta symbol
      expect(getTypes('ϰ')).toEqual(['unknown']) // Unsupported Kappa symbol
      expect(getTypes('ϱ')).toEqual(['unknown']) // Unsupported Rho symbol
      expect(getTypes('ϵ')).toEqual(['unknown']) // Unsupported Epsilon symbol
    })

    test('should not identify non-Greek letters', () => {
      expect(arraysEqual(getTypes('a'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
      expect(getTypes('А')).toEqual(['cyrillic_letter'])
      expect(
        arraysEqual(getTypes('1'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
    })
  })

  describe('Cyrillic letters', () => {
    test('should identify all Cyrillic letters', () => {
      expect(getTypes('А')).toEqual(['cyrillic_letter'])
      expect(getTypes('Б')).toEqual(['cyrillic_letter'])
      expect(getTypes('В')).toEqual(['cyrillic_letter'])
      expect(getTypes('Г')).toEqual(['cyrillic_letter'])
      expect(getTypes('Д')).toEqual(['cyrillic_letter'])
      expect(getTypes('Е')).toEqual(['cyrillic_letter'])
      expect(getTypes('Ё')).toEqual(['cyrillic_letter'])
      expect(getTypes('Ж')).toEqual(['cyrillic_letter'])
      expect(getTypes('З')).toEqual(['cyrillic_letter'])
      expect(getTypes('И')).toEqual(['cyrillic_letter'])
      expect(getTypes('Й')).toEqual(['cyrillic_letter'])
      expect(getTypes('К')).toEqual(['cyrillic_letter'])
      expect(getTypes('Л')).toEqual(['cyrillic_letter'])
      expect(getTypes('М')).toEqual(['cyrillic_letter'])
      expect(getTypes('Н')).toEqual(['cyrillic_letter'])
      expect(getTypes('О')).toEqual(['cyrillic_letter'])
      expect(getTypes('П')).toEqual(['cyrillic_letter'])
      expect(getTypes('Р')).toEqual(['cyrillic_letter'])
      expect(getTypes('С')).toEqual(['cyrillic_letter'])
      expect(getTypes('Т')).toEqual(['cyrillic_letter'])
      expect(getTypes('У')).toEqual(['cyrillic_letter'])
      expect(getTypes('Ф')).toEqual(['cyrillic_letter'])
      expect(getTypes('Х')).toEqual(['cyrillic_letter'])
      expect(getTypes('Ц')).toEqual(['cyrillic_letter'])
      expect(getTypes('Ч')).toEqual(['cyrillic_letter'])
      expect(getTypes('Ш')).toEqual(['cyrillic_letter'])
      expect(getTypes('Щ')).toEqual(['cyrillic_letter'])
      expect(getTypes('Ъ')).toEqual(['cyrillic_letter'])
      expect(getTypes('Ы')).toEqual(['cyrillic_letter'])
      expect(getTypes('Ь')).toEqual(['cyrillic_letter'])
      expect(getTypes('Э')).toEqual(['cyrillic_letter'])
      expect(getTypes('Ю')).toEqual(['cyrillic_letter'])
      expect(getTypes('Я')).toEqual(['cyrillic_letter'])
      expect(getTypes('а')).toEqual(['cyrillic_letter'])
      expect(getTypes('б')).toEqual(['cyrillic_letter'])
      expect(getTypes('в')).toEqual(['cyrillic_letter'])
      expect(getTypes('г')).toEqual(['cyrillic_letter'])
      expect(getTypes('д')).toEqual(['cyrillic_letter'])
      expect(getTypes('е')).toEqual(['cyrillic_letter'])
      expect(getTypes('ё')).toEqual(['cyrillic_letter'])
      expect(getTypes('ж')).toEqual(['cyrillic_letter'])
      expect(getTypes('з')).toEqual(['cyrillic_letter'])
      expect(getTypes('и')).toEqual(['cyrillic_letter'])
      expect(getTypes('й')).toEqual(['cyrillic_letter'])
      expect(getTypes('к')).toEqual(['cyrillic_letter'])
      expect(getTypes('л')).toEqual(['cyrillic_letter'])
      expect(getTypes('м')).toEqual(['cyrillic_letter'])
      expect(getTypes('н')).toEqual(['cyrillic_letter'])
      expect(getTypes('о')).toEqual(['cyrillic_letter'])
      expect(getTypes('п')).toEqual(['cyrillic_letter'])
      expect(getTypes('р')).toEqual(['cyrillic_letter'])
      expect(getTypes('с')).toEqual(['cyrillic_letter'])
      expect(getTypes('т')).toEqual(['cyrillic_letter'])
      expect(getTypes('у')).toEqual(['cyrillic_letter'])
      expect(getTypes('ф')).toEqual(['cyrillic_letter'])
      expect(getTypes('х')).toEqual(['cyrillic_letter'])
      expect(getTypes('ц')).toEqual(['cyrillic_letter'])
      expect(getTypes('ч')).toEqual(['cyrillic_letter'])
      expect(getTypes('ш')).toEqual(['cyrillic_letter'])
      expect(getTypes('щ')).toEqual(['cyrillic_letter'])
      expect(getTypes('ъ')).toEqual(['cyrillic_letter'])
      expect(getTypes('ы')).toEqual(['cyrillic_letter'])
      expect(getTypes('ь')).toEqual(['cyrillic_letter'])
      expect(getTypes('э')).toEqual(['cyrillic_letter'])
      expect(getTypes('ю')).toEqual(['cyrillic_letter'])
      expect(getTypes('я')).toEqual(['cyrillic_letter'])
    })

    test('should handle special Cyrillic letter cases', () => {
      expect(getTypes('Ё')).toEqual(['cyrillic_letter'])
      expect(getTypes('ё')).toEqual(['cyrillic_letter'])
    })

    test('should not identify non-Cyrillic letters', () => {
      expect(arraysEqual(getTypes('a'), ['hexadecimal', 'latin_letter'])).toBe(
        true,
      )
      expect(getTypes('α')).toEqual(['greek_letter'])
      expect(
        arraysEqual(getTypes('1'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
    })
  })

  describe('Month names', () => {
    test('should identify English month names', () => {
      expect(getTypes('January')).toEqual(['month_name'])
      expect(getTypes('February')).toEqual(['month_name'])
      expect(getTypes('March')).toEqual(['month_name'])
      expect(getTypes('April')).toEqual(['month_name'])
      expect(getTypes('May')).toEqual(['month_name'])
      expect(getTypes('June')).toEqual(['month_name'])
      expect(getTypes('July')).toEqual(['month_name'])
      expect(getTypes('August')).toEqual(['month_name'])
      expect(getTypes('September')).toEqual(['month_name'])
      expect(getTypes('October')).toEqual(['month_name'])
      expect(
        arraysEqual(getTypes('November'), ['nato_phonetic', 'month_name']),
      ).toBe(true)
      expect(getTypes('December')).toEqual(['month_name'])
    })

    test('should identify abbreviated month names', () => {
      expect(getTypes('Jan')).toEqual(['month_name'])
      expect(getTypes('Feb')).toEqual(['hexadecimal', 'month_name'])
      expect(getTypes('Mar')).toEqual(['month_name'])
      expect(getTypes('Apr')).toEqual(['month_name'])
      expect(getTypes('May')).toEqual(['month_name'])
      expect(getTypes('Jun')).toEqual(['month_name'])
      expect(getTypes('Jul')).toEqual(['month_name'])
      expect(getTypes('Aug')).toEqual(['month_name'])
      expect(getTypes('Sep')).toEqual(['month_name'])
      expect(getTypes('Oct')).toEqual(['month_name'])
      expect(getTypes('Nov')).toEqual(['month_name'])
      expect(getTypes('Dec')).toEqual(['hexadecimal', 'month_name'])
    })

    test('should identify case-insensitive month names', () => {
      expect(getTypes('january')).toEqual(['month_name'])
      expect(getTypes('JANUARY')).toEqual(['month_name'])
      expect(getTypes('jan')).toEqual(['month_name'])
    })

    test('should not identify invalid month names', () => {
      expect(getTypes('Janu')).toEqual(['unknown'])
      expect(getTypes('Invalid')).toEqual(['unknown'])
    })
  })

  describe('Day of week names', () => {
    test('should identify English day of week names', () => {
      expect(getTypes('Monday')).toEqual(['day_of_week'])
      expect(getTypes('Tuesday')).toEqual(['day_of_week'])
      expect(getTypes('Wednesday')).toEqual(['day_of_week'])
      expect(getTypes('Thursday')).toEqual(['day_of_week'])
      expect(getTypes('Friday')).toEqual(['day_of_week'])
      expect(getTypes('Saturday')).toEqual(['day_of_week'])
      expect(getTypes('Sunday')).toEqual(['day_of_week'])
    })

    test('should identify abbreviated day of week names', () => {
      expect(getTypes('Mon')).toEqual(['day_of_week'])
      expect(getTypes('Tue')).toEqual(['day_of_week'])
      expect(getTypes('Wed')).toEqual(['day_of_week'])
      expect(getTypes('Thu')).toEqual(['day_of_week'])
      expect(getTypes('Fri')).toEqual(['day_of_week'])
      expect(getTypes('Sat')).toEqual(['day_of_week'])
      expect(getTypes('Sun')).toEqual(['day_of_week'])
    })

    test('should identify case-insensitive day of week names', () => {
      expect(getTypes('monday')).toEqual(['day_of_week'])
      expect(getTypes('TUESDAY')).toEqual(['day_of_week'])
      expect(getTypes('Wednesday')).toEqual(['day_of_week'])
    })

    test('should not identify invalid day of week names', () => {
      expect(getTypes('InvalidDay')).toEqual(['unknown'])
      expect(getTypes('NotADay')).toEqual(['unknown'])
      expect(getTypes('Random')).toEqual(['unknown'])
    })
  })

  describe('Unknown types', () => {
    test('should identify unknown types', () => {
      expect(getTypes('invalid-string')).toEqual(['unknown'])
      expect(getTypes('not-a-number')).toEqual(['unknown'])
      expect(getTypes('random-words')).toEqual(['unknown'])
      expect(getTypes('mixed123abc')).toEqual(['unknown'])
    })
  })

  describe('Priority and edge cases', () => {
    test('should handle priority correctly', () => {
      // Decimal should take priority over binary/octal/hex for ambiguous cases
      expect(
        arraysEqual(getTypes('10'), [
          'binary',
          'decimal',
          'hexadecimal',
          'octal',
        ]),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('100'), [
          'binary',
          'decimal',
          'octal',
          'hexadecimal',
        ]),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('123'), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('1234'), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
    })

    test('should handle whitespace correctly', () => {
      expect(
        arraysEqual(getTypes(' 123 '), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
      expect(
        arraysEqual(getTypes('\t456\n'), ['decimal', 'octal', 'hexadecimal']),
      ).toBe(true)
      expect(arraysEqual(getTypes('  ABC  '), ['hexadecimal'])).toBe(true)
    })

    test('should handle mixed case correctly', () => {
      expect(arraysEqual(getTypes('AbC'), ['hexadecimal'])).toBe(true)
      expect(arraysEqual(getTypes('xIv'), ['roman'])).toBe(true)
      expect(arraysEqual(getTypes('DeAdBeEf'), ['hexadecimal'])).toBe(true)
    })
  })
})

describe('hasType function', () => {
  describe('Basic functionality', () => {
    test('should return true for valid type matches', () => {
      expect(hasType('123', 'decimal')).toBe(true)
      expect(hasType('X', 'roman')).toBe(true)
      expect(hasType('X', 'latin_letter')).toBe(true)
      expect(hasType('Feb', 'month_name')).toBe(true)
      expect(hasType('Feb', 'hexadecimal')).toBe(true)
      expect(hasType('one', 'english_words')).toBe(true)
      expect(hasType('Aries', 'astrological_sign')).toBe(true)
    })

    test('should return false for invalid type matches', () => {
      expect(hasType('123', 'roman')).toBe(false)
      expect(hasType('X', 'decimal')).toBe(false)
      expect(hasType('Feb', 'roman')).toBe(false)
      expect(hasType('invalid', 'decimal')).toBe(false)
      expect(hasType('invalid', 'english_words')).toBe(false)
    })

    test('should handle invalid inputs', () => {
      expect(hasType(null as unknown as string, 'decimal')).toBe(false)
      expect(hasType(undefined as unknown as string, 'decimal')).toBe(false)
      expect(hasType(123 as unknown as string, 'decimal')).toBe(false)
      expect(hasType('', 'decimal')).toBe(false)
      expect(hasType('   ', 'decimal')).toBe(false)
    })
  })

  describe('Edge cases', () => {
    test('should handle case sensitivity correctly', () => {
      expect(hasType('vi', 'roman')).toBe(true)
      expect(hasType('VI', 'roman')).toBe(true)
      expect(hasType('Vi', 'roman')).toBe(true)
      expect(hasType('aries', 'astrological_sign')).toBe(true)
      expect(hasType('ARIES', 'astrological_sign')).toBe(true)
    })

    test('should handle whitespace correctly', () => {
      expect(hasType(' 123 ', 'decimal')).toBe(true)
      expect(hasType(' VI ', 'roman')).toBe(true)
      expect(hasType(' one ', 'english_words')).toBe(true)
    })

    test('should handle ambiguous inputs correctly', () => {
      // '10' can be decimal, binary, octal, or hexadecimal
      expect(hasType('10', 'decimal')).toBe(true)
      expect(hasType('10', 'binary')).toBe(true)
      expect(hasType('10', 'octal')).toBe(true)
      expect(hasType('10', 'hexadecimal')).toBe(true)
      expect(hasType('10', 'roman')).toBe(false)

      // 'X' can be roman or latin_letter
      expect(hasType('X', 'roman')).toBe(true)
      expect(hasType('X', 'latin_letter')).toBe(true)
      expect(hasType('X', 'decimal')).toBe(false)

      // 'Feb' can be hexadecimal or month_name
      expect(hasType('Feb', 'hexadecimal')).toBe(true)
      expect(hasType('Feb', 'month_name')).toBe(true)
      expect(hasType('Feb', 'roman')).toBe(false)
    })
  })

  describe('All supported types', () => {
    test('should work with all decimal types', () => {
      expect(hasType('123', 'decimal')).toBe(true)
      expect(hasType('-123', 'decimal')).toBe(true)
      expect(hasType('123.45', 'decimal')).toBe(true)
      expect(hasType('0', 'decimal')).toBe(true)
    })

    test('should work with binary numbers', () => {
      expect(hasType('1010', 'binary')).toBe(true)
      expect(hasType('11111111', 'binary')).toBe(true)
      expect(hasType('10', 'binary')).toBe(true)
      expect(hasType('1', 'binary')).toBe(true)
    })

    test('should work with octal numbers', () => {
      expect(hasType('77', 'octal')).toBe(true)
      expect(hasType('1234', 'octal')).toBe(true)
      expect(hasType('10', 'octal')).toBe(true)
      expect(hasType('8', 'octal')).toBe(false)
    })

    test('should work with hexadecimal numbers', () => {
      expect(hasType('FF', 'hexadecimal')).toBe(true)
      expect(hasType('deadbeef', 'hexadecimal')).toBe(true)
      expect(hasType('10', 'hexadecimal')).toBe(true)
      expect(hasType('G', 'hexadecimal')).toBe(false)
    })

    test('should work with Roman numerals', () => {
      expect(hasType('IV', 'roman')).toBe(true)
      expect(hasType('MMMCMXCIX', 'roman')).toBe(true)
      expect(hasType('X', 'roman')).toBe(true)
      expect(hasType('IIII', 'roman')).toBe(false)
    })

    test('should work with Arabic numerals', () => {
      expect(hasType('١٢٣', 'arabic')).toBe(true)
      expect(hasType('٠', 'arabic')).toBe(true)
      expect(hasType('123', 'arabic')).toBe(false)
    })

    test('should work with English cardinal numbers', () => {
      expect(hasType('1st', 'english_cardinal')).toBe(true)
      expect(hasType('2nd', 'english_cardinal')).toBe(true)
      expect(hasType('3rd', 'english_cardinal')).toBe(true)
      expect(hasType('4th', 'english_cardinal')).toBe(true)
      expect(hasType('1th', 'english_cardinal')).toBe(false)
    })

    test('should work with English words', () => {
      expect(hasType('one', 'english_words')).toBe(true)
      expect(hasType('twenty-one', 'english_words')).toBe(true)
      expect(hasType('one hundred', 'english_words')).toBe(true)
      expect(hasType('invalid', 'english_words')).toBe(false)
    })

    test('should work with French words', () => {
      expect(hasType('un', 'french_words')).toBe(true)
      expect(hasType('dix-sept', 'french_words')).toBe(true)
      expect(hasType('invalid', 'french_words')).toBe(false)
    })

    test('should work with Chinese words', () => {
      expect(hasType('一', 'chinese_words')).toBe(true)
      expect(hasType('一百二十三', 'chinese_words')).toBe(true)
      expect(hasType('invalid', 'chinese_words')).toBe(false)
    })

    test('should work with Chinese financial characters', () => {
      expect(hasType('壹', 'chinese_financial')).toBe(true)
      expect(hasType('壹佰贰拾叁', 'chinese_financial')).toBe(true)
      expect(hasType('一', 'chinese_financial')).toBe(false)
    })

    test('should work with Chinese Heavenly Stems', () => {
      expect(hasType('甲', 'chinese_heavenly_stem')).toBe(true)
      expect(hasType('乙', 'chinese_heavenly_stem')).toBe(true)
      expect(hasType('子', 'chinese_heavenly_stem')).toBe(false)
    })

    test('should work with Chinese Earthly Branches', () => {
      expect(hasType('子', 'chinese_earthly_branch')).toBe(true)
      expect(hasType('丑', 'chinese_earthly_branch')).toBe(true)
      expect(hasType('甲', 'chinese_earthly_branch')).toBe(false)
    })

    test('should work with Chinese Solar Terms', () => {
      expect(hasType('立春', 'chinese_solar_term')).toBe(true)
      expect(hasType('春分', 'chinese_solar_term')).toBe(true)
      expect(hasType('春天', 'chinese_solar_term')).toBe(false)
    })

    test('should work with astrological signs', () => {
      expect(hasType('Aries', 'astrological_sign')).toBe(true)
      expect(hasType('Taurus', 'astrological_sign')).toBe(true)
      expect(hasType('Invalid', 'astrological_sign')).toBe(false)
    })

    test('should work with NATO phonetic alphabet', () => {
      expect(hasType('Alfa', 'nato_phonetic')).toBe(true)
      expect(hasType('Bravo', 'nato_phonetic')).toBe(true)
      expect(hasType('alpha', 'nato_phonetic')).toBe(true)
    })

    test('should work with month names', () => {
      expect(hasType('January', 'month_name')).toBe(true)
      expect(hasType('Jan', 'month_name')).toBe(true)
      expect(hasType('Feb', 'month_name')).toBe(true)
      expect(hasType('Invalid', 'month_name')).toBe(false)
    })

    test('should work with day of week names', () => {
      expect(hasType('Sunday', 'day_of_week')).toBe(true)
      expect(hasType('Sun', 'day_of_week')).toBe(true)
      expect(hasType('Invalid', 'day_of_week')).toBe(false)
    })

    test('should work with Latin letters', () => {
      expect(hasType('A', 'latin_letter')).toBe(true)
      expect(hasType('z', 'latin_letter')).toBe(true)
      expect(hasType('1', 'latin_letter')).toBe(false)
    })

    test('should work with Greek letters', () => {
      expect(hasType('α', 'greek_letter')).toBe(true)
      expect(hasType('Ω', 'greek_letter')).toBe(true)
      expect(hasType('A', 'greek_letter')).toBe(false)
    })

    test('should work with Cyrillic letters', () => {
      expect(hasType('А', 'cyrillic_letter')).toBe(true)
      expect(hasType('я', 'cyrillic_letter')).toBe(true)
      expect(hasType('A', 'cyrillic_letter')).toBe(false)
    })
  })

  describe('Special cases', () => {
    test('should handle unknown types', () => {
      expect(hasType('invalid', 'unknown')).toBe(true)
      expect(hasType('!@#$%', 'unknown')).toBe(true)
      expect(hasType('123', 'unknown')).toBe(false)
    })

    test('should handle invalid and empty inputs', () => {
      expect(hasType(null as unknown as string, 'invalid')).toBe(true)
      expect(hasType(undefined as unknown as string, 'invalid')).toBe(true)
      expect(hasType('', 'empty')).toBe(true)
      expect(hasType('   ', 'empty')).toBe(true)
    })

    test('should handle non-existent types', () => {
      expect(hasType('123', 'non_existent_type' as unknown as NumType)).toBe(
        false,
      )
      expect(hasType('X', 'non_existent_type' as unknown as NumType)).toBe(
        false,
      )
      expect(
        hasType('invalid', 'non_existent_type' as unknown as NumType),
      ).toBe(false)
    })
  })
})
