# ConvNum: TypeScript / JavaScript utility library for converting between number representations, numeral systems

A comprehensive TypeScript utility library for converting between various number representations, numeral systems, date/time formats, etc.

## Installation

```bash
npm install convnum
```

## Usage

```typescript
import {
  toEnglishWords,
  fromChineseWords,
} from 'convnum'

console.log(toEnglishWords(12345)) // 'twelve thousand three hundred forty-five'
console.log(fromChineseWords('一万二千三百四十五')) // 12345
```

## Features

- Number system conversions:

  - Roman numerals (e.g. "VI") (1-3999)
  - Binary, Octal, Hexadecimal, and custom base conversion
  - Arabic numerals (e.g. ٠, ١, ٢, etc.)

- Language-specific number words:

  - English words (e.g. "one hundred twenty-three")
  - English cardinal numbers (e.g. "1st")
  - French words (e.g. "cent-vingt-trois")
  - Chinese words (e.g. "一百二十三")
  - Chinese financial characters (e.g. "壹佰贰拾叁")
  - Chinese Heavenly Stems (天干) (e.g. "甲") and Earthly Branches (地支) (e.g. "子")
  - Chinese Solar Terms (节气) (e.g. "立春")

- Alphabet conversions:

  - Latin letters (A-Z, a-z)
  - Greek letters (Α-Ω, α-ω)
  - Cyrillic letters (А-Я, а-я)
  - NATO phonetic alphabet ("Alpha", "Bravo", "Charlie")

- Date and time conversions:

  - Month names in multiple languages (e.g. "January") (all languages supported by [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl))
  - Day of week names in multiple languages (e.g. "Monday") (all languages supported by [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl))
  - [Julian day](https://en.wikipedia.org/wiki/Julian_day) conversions
  - Astrological signs (e.g. "Aries")

- Chinese language utilities:

  - Simplified to Traditional Chinese conversion
  - Traditional to Simplified Chinese conversion

- Validation functions for all conversions

- Comprehensive error handling for invalid inputs

- Support for:
  - Negative numbers
  - Decimal numbers
  - Large numbers (up to quintillions)
  - Zero and special cases
  - Multiple locales and formats
  - Case-insensitive matching

## To-do:

- Braille
- Morse code

## License

MIT
