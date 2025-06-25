# ConvNum: TypeScript/JavaScript Utility Library for Converting Between Number Representations and Numeral Systems

A comprehensive TypeScript utility library for converting between various number representations, numeral systems, date/time formats, and more. Includes validation and type detection capabilities.

## Installation

```bash
npm install convnum
```

## Usage

```typescript
import { toEnglishWords, fromChineseWords } from 'convnum'

console.log(toEnglishWords(12345)) // 'twelve thousand three hundred forty-five'
console.log(fromChineseWords('一万二千三百四十五')) // 12345
```

Detailed documentation is available at [https://convnum.tomchen.org](https://convnum.tomchen.org).

## Supported Types

The library supports conversion and detection of the following number representation types:

(`NumType` is a type used in this library to identify different number representations)

| Name                     | NumType                  | Examples                            | Notes                                                                                                                                                                                                  |
| ------------------------ | ------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Decimal                  | `decimal`                | "123", "456"                        | Standard base-10 numbers                                                                                                                                                                               |
| Latin letters            | `latin_letter`           | "A", "b", "Z"                       | Standard Latin alphabet                                                                                                                                                                                |
| Month                    | `month_name`             | "January", "JAN", "february", "Feb" | Month names in various languages supported for conversion via [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). Only English is supported for detection |
| Day of week              | `day_of_week`            | "Monday", "MON", "tuesday", "Tue"   | Day names in various languages supported for conversion via [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). Only English is supported for detection   |
| Roman numerals           | `roman`                  | "VI", "vi", "MMMCMXCIX"             | Roman numeral system (range: 1-3999). Does not support single Unicode character form like "Ⅵ"                                                                                                          |
| Arabic numerals          | `arabic`                 | "٠", "١", "٢"                       | Eastern Arabic numerals                                                                                                                                                                                |
| English cardinal         | `english_cardinal`       | "1st", "2Nd", "3RD"                 | Ordinal numbers with suffixes                                                                                                                                                                          |
| English words            | `english_words`          | "one hundred twenty-three", "thReE" | Written English numbers                                                                                                                                                                                |
| French words             | `french_words`           | "cent vingt-trois", "TroIs"         | Written French numbers (currently supports traditional writing like "cent vingt-trois", not "cent-vingt-trois")                                                                                        |
| Chinese words            | `chinese_words`          | "一百二十三"                        | Standard Chinese numerals                                                                                                                                                                              |
| Chinese financial        | `chinese_financial`      | "壹佰贰拾叁"                        | Traditional financial characters                                                                                                                                                                       |
| Binary                   | `binary`                 | "1010", "1101"                      | Base-2 numbers (0-1 only)                                                                                                                                                                              |
| Octal                    | `octal`                  | "123", "456"                        | Base-8 numbers (0-7 only)                                                                                                                                                                              |
| Hexadecimal              | `hexadecimal`            | "1A", "FF", "abc"                   | Base-16 numbers (0-9, A-F)                                                                                                                                                                             |
| Greek letters            | `greek_letter`           | "Α", "α", "Ω"                       | Greek alphabet                                                                                                                                                                                         |
| Cyrillic letters         | `cyrillic_letter`        | "А", "а", "Я"                       | Cyrillic alphabet                                                                                                                                                                                      |
| Chinese Heavenly Stems   | `chinese_heavenly_stem`  | "甲", "乙", "丙"                    | 天干 (Tiān Gān)                                                                                                                                                                                        |
| Chinese Earthly Branches | `chinese_earthly_branch` | "子", "丑", "寅"                    | 地支 (Dì Zhī)                                                                                                                                                                                          |
| Chinese Solar Terms      | `chinese_solar_term`     | "立春", "雨水"                      | 节气 (Jié Qì)                                                                                                                                                                                          |
| Astrological signs       | `astrological_sign`      | "Aries", "tauRuS"                   | Zodiac signs                                                                                                                                                                                           |
| NATO phonetic            | `nato_phonetic`          | "Alfa", "alpha", "braVo", "Charlie" | NATO phonetic alphabet                                                                                                                                                                                 |

**Special types:**
| Name | NumType | Examples | Notes |
|------|---------|----------|-------|
| Invalid | `invalid` | `null`, `undefined` | Any non-string inputs (type errors) |
| Empty | `empty` | `""`, `"   "` | Empty or whitespace-only strings |
| Unknown | `unknown` | "xyz", "!@#$" | Non-empty strings that don't match any type |

**Note:**

- [Julian day](https://en.wikipedia.org/wiki/Julian_day) is supported only for conversion, not for detection, and is therefore not included in the `NumType` type.
- `parseDateString` and `formatDateString` are date functions, not number representations and not included in the `NumType` type. The two functions are used for precise parsing and formatting of date strings.

## Features

- **Conversion, validation, and detection** functions for all supported types
- **Robust error handling** for invalid or unexpected inputs
- **Thorough test coverage**, including edge cases and uncommon scenarios
- **Full support for:**
  - Zero, negative values, large numbers (up to quintillions), and other edge cases
  - Multiple locales and number formats
  - Simplified ⇄ Traditional Chinese conversion (limited to characters used in this library)
  - Case-insensitive input across all functions
  - Zero runtime dependencies
  - Tree-shakable builds (when using specific functions — not the all-in-one version — with ES modules and a proper bundler)

## Release Notes

### 0.1.0

- Initial release

### 0.2.0

- Date functions
- Detailed typeInfo
- Base prefix (e.g. "0x01", "0b01", "0o01")
- Circular support

### 0.2.1

- Simplify ParseDateResult interface

### 0.2.2

- Out-of-range circular support for all types in `convertTo`
- Export version

### 0.2.3

- Add year-month only support

## To-do

- Loose matching for French and English words
- _Maybe not in this lib: braille and morse code support_

## License

MIT
