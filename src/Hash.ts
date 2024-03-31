const multiplier = 2 ** 16;

export async function secureHash(input: Buffer) {
  const buffer = Buffer.from(await crypto.subtle.digest("SHA-256", input));

  return buffer.readUInt32LE() * multiplier + buffer.readUInt16LE(4);
}
