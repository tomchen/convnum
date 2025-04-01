import { expect, test, describe } from 'bun:test'
import { getType, hasType } from '../src'

describe('getType function', () => {
  describe('Invalid and edge cases', () => {
    test('should handle invalid inputs', () => {
      expect(getType(null as unknown as string)).toEqual(['invalid'])
      expect(getType(undefined as unknown as string)).toEqual(['invalid'])
      expect(getType(123 as unknown as string)).toEqual(['invalid'])
      expect(getType({} as unknown as string)).toEqual(['invalid'])
      expect(getType([] as unknown as string)).toEqual(['invalid'])
    })

    test('should handle empty strings', () => {
      expect(getType('')).toEqual(['empty'])
      expect(getType('   ')).toEqual(['empty'])
      expect(getType('\t\n\r')).toEqual(['empty'])
    })
  })

  describe('Decimal numbers', () => {
    test('should identify positive integers', () => {
      expect(getType('0')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
      expect(getType('1')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
      expect(getType('123')).toEqual(['decimal', 'octal', 'hexadecimal'])
      expect(getType('999999')).toEqual(['decimal', 'hexadecimal'])
    })

    test('should identify negative integers', () => {
      expect(getType('-1')).toEqual(['decimal'])
      expect(getType('-123')).toEqual(['decimal'])
      expect(getType('-999999')).toEqual(['decimal'])
    })

    test('should identify decimal numbers', () => {
      expect(getType('0.0')).toEqual(['decimal'])
      expect(getType('1.5')).toEqual(['decimal'])
      expect(getType('3.14159')).toEqual(['decimal'])
      expect(getType('-2.718')).toEqual(['decimal'])
      expect(getType('0.001')).toEqual(['decimal'])
    })

    test('should identify numbers with leading zeros', () => {
      expect(getType('001')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
      expect(getType('000123')).toEqual(['decimal', 'octal', 'hexadecimal'])
    })
  })

  describe('Binary numbers', () => {
    test('should identify binary numbers', () => {
      expect(getType('0')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ]) // Single 0 is decimal
      expect(getType('1')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ]) // Single 1 is decimal
      expect(getType('10')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
      expect(getType('1010')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
      expect(getType('11111111')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
      expect(getType('1000000000000000')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
    })

    test('should not identify non-binary strings', () => {
      expect(getType('2')).toEqual(['decimal', 'octal', 'hexadecimal'])
      expect(getType('12')).toEqual(['decimal', 'octal', 'hexadecimal'])
      expect(getType('1012')).toEqual(['decimal', 'octal', 'hexadecimal'])
    })
  })

  describe('Octal numbers', () => {
    test('should identify octal numbers', () => {
      expect(getType('7')).toEqual(['decimal', 'octal', 'hexadecimal'])
      expect(getType('10')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
      expect(getType('77')).toEqual(['decimal', 'octal', 'hexadecimal'])
      expect(getType('1234')).toEqual(['decimal', 'octal', 'hexadecimal'])
      expect(getType('77777777')).toEqual(['decimal', 'octal', 'hexadecimal'])
    })

    test('should not identify non-octal strings', () => {
      expect(getType('8')).toEqual(['decimal', 'hexadecimal'])
      expect(getType('19')).toEqual(['decimal', 'hexadecimal'])
      expect(getType('1238')).toEqual(['decimal', 'hexadecimal'])
    })
  })

  describe('Hexadecimal numbers', () => {
    test('should identify hexadecimal numbers', () => {
      expect(getType('A')).toEqual(['hexadecimal', 'latin_letter'])
      expect(getType('F')).toEqual(['hexadecimal', 'latin_letter'])
      expect(getType('10')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
      expect(getType('FF')).toEqual(['hexadecimal'])
      expect(getType('deadbeef')).toEqual(['hexadecimal'])
      expect(getType('DEADBEEF')).toEqual(['hexadecimal'])
      expect(getType('1234567890ABCDEF')).toEqual(['hexadecimal'])
    })

    test('should not identify non-hex strings', () => {
      expect(getType('G')).toEqual(['latin_letter'])
      expect(getType('Z')).toEqual(['latin_letter'])
      expect(getType('123G')).toEqual(['unknown'])
    })
  })

  describe('Roman numerals', () => {
    test('should identify valid Roman numerals', () => {
      expect(getType('I')).toEqual(['roman', 'latin_letter'])
      expect(getType('V')).toEqual(['roman', 'latin_letter'])
      expect(getType('X')).toEqual(['roman', 'latin_letter'])
      expect(getType('L')).toEqual(['roman', 'latin_letter'])
      expect(getType('C')).toEqual(['hexadecimal', 'roman', 'latin_letter'])
      expect(getType('D')).toEqual(['hexadecimal', 'roman', 'latin_letter'])
      expect(getType('M')).toEqual(['roman', 'latin_letter'])
      expect(getType('IV')).toEqual(['roman'])
      expect(getType('IX')).toEqual(['roman'])
      expect(getType('XL')).toEqual(['roman'])
      expect(getType('XC')).toEqual(['roman'])
      expect(getType('CD')).toEqual(['hexadecimal', 'roman'])
      expect(getType('CM')).toEqual(['roman'])
      expect(getType('MMMCMXCIX')).toEqual(['roman'])
      expect(getType('MDCCLXXVI')).toEqual(['roman'])
    })

    test('should identify case-insensitive Roman numerals', () => {
      expect(getType('i')).toEqual(['roman', 'latin_letter'])
      expect(getType('iv')).toEqual(['roman'])
      expect(getType('mCmXcIx')).toEqual(['roman'])
    })

    test('should not identify invalid Roman numerals', () => {
      expect(getType('IIII')).toEqual(['unknown'])
      expect(getType('VV')).toEqual(['unknown'])
      expect(getType('ABC')).toEqual(['hexadecimal'])
      expect(getType('123')).toEqual(['decimal', 'octal', 'hexadecimal'])
    })
  })

  describe('Arabic numerals', () => {
    test('should identify Arabic numerals', () => {
      expect(getType('٠')).toEqual(['arabic'])
      expect(getType('١')).toEqual(['arabic'])
      expect(getType('٢')).toEqual(['arabic'])
      expect(getType('٣')).toEqual(['arabic'])
      expect(getType('٤')).toEqual(['arabic'])
      expect(getType('٥')).toEqual(['arabic'])
      expect(getType('٦')).toEqual(['arabic'])
      expect(getType('٧')).toEqual(['arabic'])
      expect(getType('٨')).toEqual(['arabic'])
      expect(getType('٩')).toEqual(['arabic'])
      expect(getType('١٢٣')).toEqual(['arabic'])
      expect(getType('٤٥٦')).toEqual(['arabic'])
      expect(getType('١٢٣٤٥٦٧٨٩٠')).toEqual(['arabic'])
    })

    test('should identify Arabic numerals with decimal point', () => {
      expect(getType('١٢٣.٤٥٦')).toEqual(['arabic'])
      expect(getType('٠.١')).toEqual(['arabic'])
    })

    test('should identify Arabic numerals with negative sign', () => {
      expect(getType('-١٢٣')).toEqual(['arabic'])
      expect(getType('-١٢٣.٤٥٦')).toEqual(['arabic'])
    })

    test('should not identify mixed Arabic and Latin digits', () => {
      expect(getType('١2٣')).toEqual(['unknown'])
      expect(getType('123٤')).toEqual(['unknown'])
    })
  })

  describe('English cardinal numbers', () => {
    test('should identify English cardinal numbers', () => {
      expect(getType('1st')).toEqual(['english_cardinal'])
      expect(getType('2nd')).toEqual(['english_cardinal'])
      expect(getType('3rd')).toEqual(['english_cardinal'])
      expect(getType('4th')).toEqual(['english_cardinal'])
      expect(getType('5th')).toEqual(['english_cardinal'])
      expect(getType('10th')).toEqual(['english_cardinal'])
      expect(getType('11th')).toEqual(['english_cardinal'])
      expect(getType('12th')).toEqual(['english_cardinal'])
      expect(getType('13th')).toEqual(['english_cardinal'])
      expect(getType('21st')).toEqual(['english_cardinal'])
      expect(getType('22nd')).toEqual(['english_cardinal'])
      expect(getType('23rd')).toEqual(['english_cardinal'])
      expect(getType('24th')).toEqual(['english_cardinal'])
      expect(getType('100th')).toEqual(['english_cardinal'])
      expect(getType('101st')).toEqual(['english_cardinal'])
      expect(getType('102nd')).toEqual(['english_cardinal'])
      expect(getType('103rd')).toEqual(['english_cardinal'])
      expect(getType('104th')).toEqual(['english_cardinal'])
    })

    test('should identify negative English cardinal numbers', () => {
      expect(getType('-1st')).toEqual(['english_cardinal'])
      expect(getType('-2nd')).toEqual(['english_cardinal'])
      expect(getType('-3rd')).toEqual(['english_cardinal'])
      expect(getType('-4th')).toEqual(['english_cardinal'])
    })

    test('should not identify invalid English cardinal numbers', () => {
      expect(getType('1th')).toEqual(['unknown'])
      expect(getType('2st')).toEqual(['unknown'])
      expect(getType('3nd')).toEqual(['unknown'])
      expect(getType('11st')).toEqual(['unknown'])
      expect(getType('12nd')).toEqual(['unknown'])
      expect(getType('13rd')).toEqual(['unknown'])
    })
  })

  describe('English words', () => {
    test('should identify basic English number words', () => {
      expect(getType('zero')).toEqual(['english_words'])
      expect(getType('one')).toEqual(['english_words'])
      expect(getType('two')).toEqual(['english_words'])
      expect(getType('ten')).toEqual(['english_words'])
      expect(getType('eleven')).toEqual(['english_words'])
      expect(getType('twenty')).toEqual(['english_words'])
    })

    test('should identify compound English number words', () => {
      expect(getType('twenty-one')).toEqual(['english_words'])
      expect(getType('one hundred')).toEqual(['english_words'])
      expect(getType('one hundred twenty-three')).toEqual(['english_words'])
      expect(getType('one thousand')).toEqual(['english_words'])
      expect(getType('one million')).toEqual(['english_words'])
      expect(getType('one billion')).toEqual(['english_words'])
    })

    test('should identify negative English number words', () => {
      expect(getType('negative one')).toEqual(['english_words'])
      expect(getType('negative five')).toEqual(['english_words'])
      expect(getType('negative one hundred')).toEqual(['english_words'])
    })

    test('should not identify invalid English number words', () => {
      expect(getType('one two three')).toEqual(['unknown'])
      expect(getType('invalid')).toEqual(['unknown'])
      expect(getType('one hundred invalid')).toEqual(['unknown'])
      expect(getType('hundred')).toEqual(['unknown'])
      expect(getType('thousand')).toEqual(['unknown'])
      expect(getType('million')).toEqual(['unknown'])
    })
  })

  describe('French words', () => {
    test('should identify basic French number words', () => {
      expect(getType('zéro')).toEqual(['french_words'])
      expect(getType('un')).toEqual(['french_words'])
      expect(getType('deux')).toEqual(['french_words'])
      expect(getType('dix')).toEqual(['roman', 'french_words'])
      expect(getType('onze')).toEqual(['french_words'])
      expect(getType('vingt')).toEqual(['french_words'])
      expect(getType('cent')).toEqual(['french_words'])
      expect(getType('mille')).toEqual(['french_words'])
      expect(getType('million')).toEqual(['unknown'])
    })

    test('should identify compound French number words', () => {
      expect(getType('dix-sept')).toEqual(['french_words'])
      expect(getType('quatre-vingt')).toEqual(['unknown'])
      expect(getType('quatre-vingt-dix')).toEqual(['french_words'])
      expect(getType('cent-vingt-trois')).toEqual(['unknown'])
      expect(getType('mille cent')).toEqual(['french_words'])
    })

    test('should identify negative French number words', () => {
      expect(getType('moins un')).toEqual(['french_words'])
      expect(getType('moins cinq')).toEqual(['french_words'])
    })

    test('should not identify invalid French number words', () => {
      expect(getType('invalid')).toEqual(['unknown'])
      expect(getType('un deux trois')).toEqual(['unknown'])
    })
  })

  describe('Chinese words', () => {
    test('should identify basic Chinese number words', () => {
      expect(getType('零')).toEqual(['chinese_words', 'chinese_financial'])
      expect(getType('一')).toEqual(['chinese_words'])
      expect(getType('二')).toEqual(['chinese_words'])
      expect(getType('十')).toEqual(['chinese_words'])
      expect(getType('百')).not.toEqual(['chinese_words'])
      expect(getType('千')).not.toEqual(['chinese_words'])
      expect(getType('万')).not.toEqual(['chinese_words'])
      expect(getType('亿')).not.toEqual(['chinese_words'])
      expect(getType('一百')).toEqual(['chinese_words'])
      expect(getType('一千')).toEqual(['chinese_words'])
      expect(getType('一万')).toEqual(['chinese_words'])
      expect(getType('一亿')).toEqual(['chinese_words'])
    })

    test('should identify compound Chinese number words', () => {
      expect(getType('十一')).toEqual(['chinese_words'])
      expect(getType('二十')).toEqual(['chinese_words'])
      expect(getType('一百')).toEqual(['chinese_words'])
      expect(getType('一百二十三')).toEqual(['chinese_words'])
      expect(getType('一千')).toEqual(['chinese_words'])
      expect(getType('一万')).toEqual(['chinese_words'])
    })

    test('should identify Chinese number words with decimal point', () => {
      expect(getType('一点五')).toEqual(['chinese_words'])
      expect(getType('三点一四')).toEqual(['chinese_words'])
    })

    test('should identify negative Chinese number words', () => {
      expect(getType('负一')).toEqual(['chinese_words'])
      expect(getType('负五')).toEqual(['chinese_words'])
      expect(getType('负一百')).toEqual(['chinese_words'])
    })

    test('should not identify invalid Chinese number words', () => {
      expect(getType('一二三')).toEqual(['unknown'])
      expect(getType('invalid')).toEqual(['unknown'])
    })
  })

  describe('Chinese financial characters', () => {
    test('should identify Chinese financial characters', () => {
      expect(getType('零')).toEqual(['chinese_words', 'chinese_financial']) // 零 is both regular and financial
      expect(getType('壹')).toEqual(['chinese_financial'])
      expect(getType('贰')).toEqual(['chinese_financial'])
      expect(getType('叁')).toEqual(['chinese_financial'])
      expect(getType('肆')).toEqual(['chinese_financial'])
      expect(getType('伍')).toEqual(['chinese_financial'])
      expect(getType('陆')).toEqual(['chinese_financial'])
      expect(getType('柒')).toEqual(['chinese_financial'])
      expect(getType('捌')).toEqual(['chinese_financial'])
      expect(getType('玖')).toEqual(['chinese_financial'])
      expect(getType('拾')).toEqual(['chinese_financial'])
      expect(getType('佰')).toEqual(['chinese_financial'])
      expect(getType('仟')).toEqual(['chinese_financial'])
      expect(getType('万')).toEqual(['chinese_financial'])
      expect(getType('亿')).toEqual(['chinese_financial'])
    })

    test('should identify compound Chinese financial characters', () => {
      expect(getType('壹佰贰拾叁')).toEqual(['chinese_financial'])
      expect(getType('伍仟')).toEqual(['chinese_financial'])
      expect(getType('万伍')).toEqual(['chinese_financial'])
    })

    test('should not identify mixed regular and financial characters', () => {
      expect(getType('壹佰二拾叁')).toEqual(['unknown'])
      expect(getType('一佰贰拾三')).toEqual(['unknown'])
    })
  })

  describe('Chinese Heavenly Stems (天干)', () => {
    test('should identify all Chinese Heavenly Stems', () => {
      expect(getType('甲')).toEqual(['chinese_heavenly_stem'])
      expect(getType('乙')).toEqual(['chinese_heavenly_stem'])
      expect(getType('丙')).toEqual(['chinese_heavenly_stem'])
      expect(getType('丁')).toEqual(['chinese_heavenly_stem'])
      expect(getType('戊')).toEqual(['chinese_heavenly_stem'])
      expect(getType('己')).toEqual(['chinese_heavenly_stem'])
      expect(getType('庚')).toEqual(['chinese_heavenly_stem'])
      expect(getType('辛')).toEqual(['chinese_heavenly_stem'])
      expect(getType('壬')).toEqual(['chinese_heavenly_stem'])
      expect(getType('癸')).toEqual(['chinese_heavenly_stem'])
    })

    test('should not identify invalid Heavenly Stems', () => {
      expect(getType('子')).toEqual(['chinese_earthly_branch'])
      expect(getType('一')).toEqual(['chinese_words'])
      expect(getType('invalid')).toEqual(['unknown'])
    })
  })

  describe('Chinese Earthly Branches (地支)', () => {
    test('should identify all Chinese Earthly Branches', () => {
      expect(getType('子')).toEqual(['chinese_earthly_branch'])
      expect(getType('丑')).toEqual(['chinese_earthly_branch'])
      expect(getType('寅')).toEqual(['chinese_earthly_branch'])
      expect(getType('卯')).toEqual(['chinese_earthly_branch'])
      expect(getType('辰')).toEqual(['chinese_earthly_branch'])
      expect(getType('巳')).toEqual(['chinese_earthly_branch'])
      expect(getType('午')).toEqual(['chinese_earthly_branch'])
      expect(getType('未')).toEqual(['chinese_earthly_branch'])
      expect(getType('申')).toEqual(['chinese_earthly_branch'])
      expect(getType('酉')).toEqual(['chinese_earthly_branch'])
      expect(getType('戌')).toEqual(['chinese_earthly_branch'])
      expect(getType('亥')).toEqual(['chinese_earthly_branch'])
    })

    test('should not identify invalid Earthly Branches', () => {
      expect(getType('甲')).toEqual(['chinese_heavenly_stem'])
      expect(getType('一')).toEqual(['chinese_words'])
      expect(getType('invalid')).toEqual(['unknown'])
    })
  })

  describe('Chinese Solar Terms (节气)', () => {
    test('should identify all Chinese Solar Terms', () => {
      expect(getType('立春')).toEqual(['chinese_solar_term'])
      expect(getType('雨水')).toEqual(['chinese_solar_term'])
      expect(getType('惊蛰')).toEqual(['chinese_solar_term'])
      expect(getType('春分')).toEqual(['chinese_solar_term'])
      expect(getType('清明')).toEqual(['chinese_solar_term'])
      expect(getType('谷雨')).toEqual(['chinese_solar_term'])
      expect(getType('立夏')).toEqual(['chinese_solar_term'])
      expect(getType('小满')).toEqual(['chinese_solar_term'])
      expect(getType('芒种')).toEqual(['chinese_solar_term'])
      expect(getType('夏至')).toEqual(['chinese_solar_term'])
      expect(getType('小暑')).toEqual(['chinese_solar_term'])
      expect(getType('大暑')).toEqual(['chinese_solar_term'])
      expect(getType('立秋')).toEqual(['chinese_solar_term'])
      expect(getType('处暑')).toEqual(['chinese_solar_term'])
      expect(getType('白露')).toEqual(['chinese_solar_term'])
      expect(getType('秋分')).toEqual(['chinese_solar_term'])
      expect(getType('寒露')).toEqual(['chinese_solar_term'])
      expect(getType('霜降')).toEqual(['chinese_solar_term'])
      expect(getType('立冬')).toEqual(['chinese_solar_term'])
      expect(getType('小雪')).toEqual(['chinese_solar_term'])
      expect(getType('大雪')).toEqual(['chinese_solar_term'])
      expect(getType('冬至')).toEqual(['chinese_solar_term'])
      expect(getType('小寒')).toEqual(['chinese_solar_term'])
      expect(getType('大寒')).toEqual(['chinese_solar_term'])
    })

    test('should not identify invalid Solar Terms', () => {
      expect(getType('春天')).toEqual(['unknown'])
      expect(getType('夏天')).toEqual(['unknown'])
      expect(getType('秋天')).toEqual(['unknown'])
      expect(getType('冬天')).toEqual(['unknown'])
    })
  })

  describe('Astrological signs', () => {
    test('should identify all astrological signs', () => {
      expect(getType('Aries')).toEqual(['astrological_sign'])
      expect(getType('Taurus')).toEqual(['astrological_sign'])
      expect(getType('Gemini')).toEqual(['astrological_sign'])
      expect(getType('Cancer')).toEqual(['astrological_sign'])
      expect(getType('Leo')).toEqual(['astrological_sign'])
      expect(getType('Virgo')).toEqual(['astrological_sign'])
      expect(getType('Libra')).toEqual(['astrological_sign'])
      expect(getType('Scorpio')).toEqual(['astrological_sign'])
      expect(getType('Sagittarius')).toEqual(['astrological_sign'])
      expect(getType('Capricorn')).toEqual(['astrological_sign'])
      expect(getType('Aquarius')).toEqual(['astrological_sign'])
      expect(getType('Pisces')).toEqual(['astrological_sign'])
    })

    test('should identify case-insensitive astrological signs', () => {
      expect(getType('aries')).toEqual(['astrological_sign'])
      expect(getType('ARIES')).toEqual(['astrological_sign'])
      expect(getType('AqUaRiUs')).toEqual(['astrological_sign'])
    })

    test('should not identify invalid astrological signs', () => {
      expect(getType('Ophiuchus')).toEqual(['unknown'])
      expect(getType('Invalid')).toEqual(['unknown'])
    })
  })

  describe('NATO phonetic alphabet', () => {
    test('should identify all NATO phonetic alphabet words', () => {
      expect(getType('Alfa')).toEqual(['nato_phonetic'])
      expect(getType('Bravo')).toEqual(['nato_phonetic'])
      expect(getType('Charlie')).toEqual(['nato_phonetic'])
      expect(getType('Delta')).toEqual(['nato_phonetic'])
      expect(getType('Echo')).toEqual(['nato_phonetic'])
      expect(getType('Foxtrot')).toEqual(['nato_phonetic'])
      expect(getType('Golf')).toEqual(['nato_phonetic'])
      expect(getType('Hotel')).toEqual(['nato_phonetic'])
      expect(getType('India')).toEqual(['nato_phonetic'])
      expect(getType('Juliett')).toEqual(['nato_phonetic'])
      expect(getType('Kilo')).toEqual(['nato_phonetic'])
      expect(getType('Lima')).toEqual(['nato_phonetic'])
      expect(getType('Mike')).toEqual(['nato_phonetic'])
      expect(getType('November')).toEqual(['nato_phonetic', 'month_name'])
      expect(getType('Oscar')).toEqual(['nato_phonetic'])
      expect(getType('Papa')).toEqual(['nato_phonetic'])
      expect(getType('Quebec')).toEqual(['nato_phonetic'])
      expect(getType('Romeo')).toEqual(['nato_phonetic'])
      expect(getType('Sierra')).toEqual(['nato_phonetic'])
      expect(getType('Tango')).toEqual(['nato_phonetic'])
      expect(getType('Uniform')).toEqual(['nato_phonetic'])
      expect(getType('Victor')).toEqual(['nato_phonetic'])
      expect(getType('Whiskey')).toEqual(['nato_phonetic'])
      expect(getType('X-ray')).toEqual(['nato_phonetic'])
      expect(getType('Yankee')).toEqual(['nato_phonetic'])
      expect(getType('Zulu')).toEqual(['nato_phonetic'])
    })

    test('should not identify case variations of NATO words', () => {
      expect(getType('alfa')).toEqual(['unknown'])
      expect(getType('ALFA')).toEqual(['unknown'])
      expect(getType('bravo')).toEqual(['unknown'])
    })

    test('should not identify invalid NATO words', () => {
      expect(getType('Alpha')).toEqual(['unknown']) // Note: NATO uses "Alfa", not "Alpha"
      expect(getType('Invalid')).toEqual(['unknown'])
    })
  })

  describe('Latin letters', () => {
    test('should identify all Latin letters', () => {
      const lowercase = 'abcdefghijklmnopqrstuvwxyz'
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

      for (const letter of lowercase) {
        expect(hasType(letter, 'latin_letter')).toBe(true)
      }

      for (const letter of uppercase) {
        expect(hasType(letter, 'latin_letter')).toBe(true)
      }
    })

    test('should not identify non-Latin letters', () => {
      expect(getType('α')).toEqual(['greek_letter'])
      expect(getType('А')).toEqual(['cyrillic_letter'])
      expect(getType('1')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
      expect(getType('!')).toEqual(['unknown'])
    })
  })

  describe('Greek letters', () => {
    test('should identify all Greek letters', () => {
      const lowercase = 'αβγδεζηθικλμνξοπρστυφχψω'
      const uppercase = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'

      for (const letter of lowercase) {
        expect(getType(letter)).toEqual(['greek_letter'])
      }

      for (const letter of uppercase) {
        expect(getType(letter)).toEqual(['greek_letter'])
      }
    })

    test('should handle special Greek letter cases', () => {
      expect(getType('ς')).toEqual(['greek_letter']) // Final sigma
      expect(getType('σ')).toEqual(['greek_letter']) // Regular sigma
      expect(getType('ρ')).toEqual(['greek_letter']) // Rho
    })

    test('should not identify non-Greek letters', () => {
      expect(getType('a')).toEqual(['hexadecimal', 'latin_letter'])
      expect(getType('А')).toEqual(['cyrillic_letter'])
      expect(getType('1')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
    })
  })

  describe('Cyrillic letters', () => {
    test('should identify all Cyrillic letters', () => {
      const lowercase = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
      const uppercase = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'

      for (const letter of lowercase) {
        expect(hasType(letter, 'cyrillic_letter')).toBe(true)
      }

      for (const letter of uppercase) {
        expect(hasType(letter, 'cyrillic_letter')).toBe(true)
      }
    })

    test('should handle special Cyrillic letter cases', () => {
      expect(getType('ё')).toEqual(['cyrillic_letter'])
      expect(getType('Ё')).toEqual(['cyrillic_letter'])
      expect(getType('е')).toEqual(['cyrillic_letter'])
      expect(getType('Е')).toEqual(['cyrillic_letter'])
    })

    test('should not identify non-Cyrillic letters', () => {
      expect(getType('a')).toEqual(['hexadecimal', 'latin_letter'])
      expect(getType('α')).toEqual(['greek_letter'])
      expect(getType('1')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
    })
  })

  describe('Month names', () => {
    test('should identify English month names', () => {
      expect(getType('January')).toEqual(['month_name'])
      expect(getType('February')).toEqual(['month_name'])
      expect(getType('March')).toEqual(['month_name'])
      expect(getType('April')).toEqual(['month_name'])
      expect(getType('May')).toEqual(['month_name'])
      expect(getType('June')).toEqual(['month_name'])
      expect(getType('July')).toEqual(['month_name'])
      expect(getType('August')).toEqual(['month_name'])
      expect(getType('September')).toEqual(['month_name'])
      expect(getType('October')).toEqual(['month_name'])
      expect(getType('November')).toEqual(['nato_phonetic', 'month_name'])
      expect(getType('December')).toEqual(['month_name'])
    })

    test('should identify abbreviated month names', () => {
      expect(getType('Jan')).toEqual(['month_name'])
      expect(getType('Feb')).toEqual(['hexadecimal', 'month_name'])
      expect(getType('Mar')).toEqual(['month_name'])
      expect(getType('Apr')).toEqual(['month_name'])
      expect(getType('May')).toEqual(['month_name'])
      expect(getType('Jun')).toEqual(['month_name'])
      expect(getType('Jul')).toEqual(['month_name'])
      expect(getType('Aug')).toEqual(['month_name'])
      expect(getType('Sep')).toEqual(['month_name'])
      expect(getType('Oct')).toEqual(['month_name'])
      expect(getType('Nov')).toEqual(['month_name'])
      expect(getType('Dec')).toEqual(['hexadecimal', 'month_name'])
    })

    test('should identify case-insensitive month names', () => {
      expect(getType('january')).toEqual(['month_name'])
      expect(getType('JANUARY')).toEqual(['month_name'])
      expect(getType('jan')).toEqual(['month_name'])
    })

    test('should not identify invalid month names', () => {
      expect(getType('Janu')).toEqual(['unknown'])
      expect(getType('Invalid')).toEqual(['unknown'])
    })
  })

  describe('Day of week names', () => {
    test('should identify English day of week names', () => {
      expect(getType('Sunday')).toEqual(['day_of_week'])
      expect(getType('Monday')).toEqual(['day_of_week'])
      expect(getType('Tuesday')).toEqual(['day_of_week'])
      expect(getType('Wednesday')).toEqual(['day_of_week'])
      expect(getType('Thursday')).toEqual(['day_of_week'])
      expect(getType('Friday')).toEqual(['day_of_week'])
      expect(getType('Saturday')).toEqual(['day_of_week'])
    })

    test('should identify abbreviated day of week names', () => {
      expect(getType('Sun')).toEqual(['day_of_week'])
      expect(getType('Mon')).toEqual(['day_of_week'])
      expect(getType('Tue')).toEqual(['day_of_week'])
      expect(getType('Wed')).toEqual(['day_of_week'])
      expect(getType('Thu')).toEqual(['day_of_week'])
      expect(getType('Fri')).toEqual(['day_of_week'])
      expect(getType('Sat')).toEqual(['day_of_week'])
    })

    test('should identify case-insensitive day of week names', () => {
      expect(getType('sunday')).toEqual(['day_of_week'])
      expect(getType('SUNDAY')).toEqual(['day_of_week'])
      expect(getType('sun')).toEqual(['day_of_week'])
    })

    test('should not identify invalid day of week names', () => {
      expect(getType('Sund')).toEqual(['unknown'])
      expect(getType('Invalid')).toEqual(['unknown'])
    })
  })

  describe('Unknown types', () => {
    test('should identify unknown types', () => {
      expect(getType('invalid')).toEqual(['unknown'])
      expect(getType('hello world')).toEqual(['unknown'])
      expect(getType('123abc')).toEqual(['hexadecimal'])
      expect(getType('abc123')).toEqual(['hexadecimal'])
      expect(getType('!@#$%')).toEqual(['unknown'])
      expect(getType('[')).toEqual(['unknown'])
      expect(getType('`')).toEqual(['unknown'])
      expect(getType('{')).toEqual(['unknown'])
    })
  })

  describe('Priority and edge cases', () => {
    test('should handle priority correctly', () => {
      // Decimal should take priority over binary/octal/hex for ambiguous cases
      expect(getType('10')).toEqual([
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
      ])
      expect(getType('123')).toEqual(['decimal', 'octal', 'hexadecimal'])
      expect(getType('1234')).toEqual(['decimal', 'octal', 'hexadecimal'])
    })

    test('should handle whitespace correctly', () => {
      expect(getType(' 123 ')).toEqual(['decimal', 'octal', 'hexadecimal'])
      expect(getType(' VI ')).toEqual(['roman'])
      expect(getType(' one ')).toEqual(['english_words'])
    })

    test('should handle mixed case correctly', () => {
      expect(getType('Vi')).toEqual(['roman'])
      expect(getType('One')).toEqual(['english_words'])
      expect(getType('Aries')).toEqual(['astrological_sign'])
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
      expect(hasType('alpha', 'nato_phonetic')).toBe(false)
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
      expect(hasType('123', 'non_existent_type')).toBe(false)
      expect(hasType('X', 'non_existent_type')).toBe(false)
      expect(hasType('invalid', 'non_existent_type')).toBe(false)
    })
  })
})
