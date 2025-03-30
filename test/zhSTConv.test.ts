import { expect, test, describe } from 'bun:test'
import { s2t, t2s } from '../src/utils/zhSTConv'

const sText =
  '零一二三四五六七八九壹贰叁肆伍陆柒捌玖两十百千万亿点负拾佰仟甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥立春雨水惊蛰分清明谷夏小满芒种至暑大秋处白露寒霜降冬雪人民币元角厘整'

const tText =
  '零一二三四五六七八九壹貳叄肆伍陸柒捌玖兩十百千萬億點負拾佰仟甲乙丙丁戊己庚辛壬癸子醜寅卯辰巳午未申酉戌亥立春雨水驚蟄分清明谷夏小滿芒種至暑大秋處白露寒霜降冬雪人民幣元角釐整'

describe('zh conversions', () => {
  describe('s2t', () => {
    test('Simplified to Traditional Chinese', () => {
      expect(s2t(sText)).toBe(tText)
    })
  })

  describe('t2s', () => {
    test('Traditional to Simplified Chinese', () => {
      expect(t2s(tText)).toBe(sText)
    })
  })
})
