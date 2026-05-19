export function isAscii(input: Buffer) {
  return input.every((byte) => byte < 0x80);
}
