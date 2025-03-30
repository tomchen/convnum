import { reverseKeyValue } from './reverseKeyValue'

// all used: 零一二三四五六七八九壹贰叁肆伍陆柒捌玖两十百千万亿点负拾佰仟甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥立春雨水惊蛰分清明谷夏小满芒种至暑大秋处白露寒霜降冬雪人民币元角厘整

const s2tMap = {
  贰: '貳',
  叁: '叄',
  陆: '陸',
  两: '兩',
  万: '萬',
  亿: '億',
  点: '點',
  负: '負',
  丑: '醜',
  惊: '驚',
  蛰: '蟄',
  满: '滿',
  种: '種',
  处: '處',
  币: '幣',
  厘: '釐',
}

export function s2t(text: string) {
  const keys = []
  for (const key in s2tMap) {
    keys.push(key)
  }
  const pattern = new RegExp(keys.join('|'), 'g')
  return text.replace(pattern, function (char) {
    return s2tMap[char as keyof typeof s2tMap]
  })
}

export function t2s(text: string) {
  const t2sMap = reverseKeyValue(s2tMap)
  const keys = []
  for (const key in t2sMap) {
    keys.push(key)
  }
  const pattern = new RegExp(keys.join('|'), 'g')
  return text.replace(pattern, function (char) {
    return t2sMap[char as keyof typeof t2sMap]
  })
}
