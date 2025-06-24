import { NumType } from "./types";

/**
 * Mapping of numeral types to their length
 */
export const numeralLength: Partial<Record<NumType, number>> = {
  latin_letter: 26,
  greek_letter: 24,
  month_name: 12,
  day_of_week: 7,
  roman: 3999,
  chinese_heavenly_stem: 10,
  chinese_earthly_branch: 12,
  chinese_solar_term: 24,
  cyrillic_letter: 33,
  astrological_sign: 12,
  nato_phonetic: 26,
}
