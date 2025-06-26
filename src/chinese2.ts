import { toFromArrayItemFn, toToArrayItemFn } from './utils/arrayItemFns'
import { reverseKeyValue } from './utils/reverseKeyValue'
import { s2t, t2s } from './utils/zhSTConv'
import { toS2TFn, toT2SFn } from './utils/zhSTConvFns'

const financialNumerals: Record<string, string> = {
  零: '零',
  一: '壹',
  两: '贰',
  二: '贰',
  三: '叁',
  四: '肆',
  五: '伍',
  六: '陆',
  七: '柒',
  八: '捌',
  九: '玖',
  十: '拾',
  百: '佰',
  千: '仟',
  万: '万',
  亿: '亿',
}

const finVals = []
for (const key in financialNumerals) {
  finVals.push(financialNumerals[key])
}
const finPattern = new RegExp(`^[${finVals.join('|')}]+$`)

/**
 * Validates if a string is a strictly valid Chinese financial number word representation
 * by converting it to a number and back to words to check for consistency
 * @param words - The Chinese words to validate
 * @returns true if the words are valid, false otherwise
 */
export function validateChineseFinancial(words: string): boolean {
  return finPattern.test(t2s(words))
}

/**
 * Converts Chinese numeral words to Chinese financial characters
 * @param numeral - The Chinese numeral words to convert
 * @param trad - Whether to convert to Traditional Chinese (default: false)
 * @returns The Chinese financial character representation
 */
export function chineseWordstoFinancial(numeral: string, trad = false): string {
  let result = ''
  for (let i = 0; i < numeral.length; i++) {
    result += financialNumerals[numeral[i]] || numeral[i]
  }
  if (trad) {
    result = s2t(result)
  }
  return result
}

/**
 * Converts Chinese financial characters to Chinese numeral words
 * @param numeral - The Chinese financial characters to convert
 * @returns The Chinese numeral word representation
 */
export function chineseFinancialtoWords(numeral: string): string {
  numeral = t2s(numeral)
  const reversedFinancialNumerals = reverseKeyValue(financialNumerals)
  reversedFinancialNumerals['贰'] = '二'
  let result = ''
  for (let i = 0; i < numeral.length; i++) {
    result += reversedFinancialNumerals[numeral[i]] || numeral[i]
  }
  return result
}

// prettier-ignore
const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

/**
 * Converts a number to Chinese Heavenly Stem (天干) word
 * @param num - The number to convert (must be between 1 and 10)
 * @returns The Chinese Heavenly Stem character
 * @throws Error if input is out of valid range
 */
export const toChineseHeavenlyStem = toToArrayItemFn(stems)

/**
 * Converts a Chinese Heavenly Stem (天干) character to its corresponding number
 * @param item - The Chinese Heavenly Stem character
 * @returns The corresponding number (1-10)
 * @throws Error if input is not a valid Heavenly Stem character
 */
export const fromChineseHeavenlyStem = toFromArrayItemFn(stems)

// prettier-ignore
const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

/**
 * Converts a number to Chinese Earthly Branch (地支) word
 * @param num - The number to convert (must be between 1 and 12)
 * @returns The Chinese Earthly Branch character
 * @throws Error if input is out of valid range
 */
export const toChineseEarthlyBranch = toToArrayItemFn(branches)

/**
 * Converts a Chinese Earthly Branch (地支) character to its corresponding number
 * @param item - The Chinese Earthly Branch character
 * @returns The corresponding number (1-12)
 * @throws Error if input is not a valid Earthly Branch character
 */
export const fromChineseEarthlyBranch = toFromArrayItemFn(branches)

// prettier-ignore
const solarTerms = [
  '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
]

/**
 * Converts a number to a 节气 (Solar Term) character
 * @param num - The number to convert (must be between 1 and 24)
 * @param circular - Whether to use circular indexing (default: false)
 * @returns The 节气 character
 * @throws Error if input is out of valid range
 */
export const toChineseSolarTerm = toS2TFn(toToArrayItemFn(solarTerms))

/**
 * Converts a 节气 (Solar Term) character to its corresponding number
 * @param item - The 节气 character
 * @returns The corresponding number (1-24)
 * @throws Error if input is not a valid 节气 character
 */
export const fromChineseSolarTerm = toT2SFn(toFromArrayItemFn(solarTerms))
