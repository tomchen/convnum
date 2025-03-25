/**
 * Converts a decimal number to a hexadecimal string
 * @param num - The decimal number to convert
 * @returns The hexadecimal representation as a string
 */
export function toHex(num: number): string {
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }
  return num.toString(16)
}

/**
 * Converts a hexadecimal string to a decimal number
 * @param hex - The hexadecimal string to convert
 * @returns The decimal representation as a number
 * @throws Error if input is not a valid hexadecimal string
 */
export function fromHex(hex: string): number {
  if (!/^[0-9a-fA-F]+$/.test(hex)) {
    throw new Error('Input must be a valid hexadecimal string')
  }
  return parseInt(hex, 16)
}

/**
 * Converts a decimal number to a binary string
 * @param num - The decimal number to convert
 * @returns The binary representation as a string
 */
export function toBin(num: number): string {
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }
  return num.toString(2)
}

/**
 * Converts a binary string to a decimal number
 * @param binary - The binary string to convert
 * @returns The decimal representation as a number
 * @throws Error if input is not a valid binary string
 */
export function fromBin(binary: string): number {
  if (!/^[01]+$/.test(binary)) {
    throw new Error('Input must be a valid binary string')
  }
  return parseInt(binary, 2)
}

/**
 * Converts a decimal number to an octal string
 * @param num - The decimal number to convert
 * @returns The octal representation as a string
 */
export function toOct(num: number): string {
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }
  return num.toString(8)
}

/**
 * Converts an octal string to a decimal number
 * @param octal - The octal string to convert
 * @returns The decimal representation as a number
 * @throws Error if input is not a valid octal string
 */
export function fromOct(octal: string): number {
  if (!/^[0-7]+$/.test(octal)) {
    throw new Error('Input must be a valid octal string')
  }
  return parseInt(octal, 8)
}

/**
 * Converts a decimal number to a string in the specified base
 * @param num - The decimal number to convert
 * @param base - The base to convert to (2-36)
 * @returns The representation in the specified base as a string
 * @throws Error if base is out of range
 */
export function toBase(num: number, base: number): string {
  if (base < 2 || base > 36) {
    throw new Error('Base must be between 2 and 36')
  }
  if (!Number.isInteger(num)) {
    throw new Error('Input must be an integer')
  }
  return num.toString(base)
}

/**
 * Converts a string in the specified base to a decimal number
 * @param str - The string to convert
 * @param base - The base of the input string (2-36)
 * @returns The decimal representation as a number
 * @throws Error if base is out of range or if input is invalid
 */
export function fromBase(str: string, base: number): number {
  if (base < 2 || base > 36) {
    throw new Error('Base must be between 2 and 36')
  }

  const digits =
    base <= 10
      ? `[0-${base - 1}]`
      : `[0-9a-${String.fromCharCode(97 + (base - 11))}A-${String.fromCharCode(65 + (base - 11))}]`

  const regex = new RegExp(`^${digits}+$`)
  if (!regex.test(str)) {
    throw new Error(`Input must be a valid string in base ${base}`)
  }

  return parseInt(str, base)
}
