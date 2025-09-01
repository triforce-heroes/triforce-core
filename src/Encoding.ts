export function encodeToString(buffer: Buffer) {
  let string = "";

  for (let bufferOffset = 0; bufferOffset < buffer.length; bufferOffset++) {
    const bufferChar1 = buffer[bufferOffset]!;

    if (bufferChar1 <= 0x7f) {
      string += String.fromCodePoint(bufferChar1);

      continue;
    }

    if (
      bufferOffset + 1 < buffer.length &&
      bufferChar1 >= 0xc2 &&
      bufferChar1 <= 0xdf
    ) {
      const bufferChar2 = buffer[bufferOffset + 1]!;

      if (bufferChar2 >= 0x80 && bufferChar2 <= 0xbf) {
        const bufferCodePoint =
          // eslint-disable-next-line no-bitwise
          ((bufferChar1 & 0x1f) << 6) | (bufferChar2 & 0x3f);

        string += String.fromCodePoint(bufferCodePoint);
        bufferOffset++;

        continue;
      }
    }

    // eslint-disable-next-line no-bitwise
    string += String.fromCodePoint(0xdc00 | bufferChar1);
  }

  return string;
}

export function encodeFromString(string: string) {
  const buffer = Buffer.alloc(string.length * 2);
  let bufferOffset = 0;

  for (let stringOffset = 0; stringOffset < string.length; stringOffset++) {
    const stringCodePoint = string.codePointAt(stringOffset)!;

    if (stringCodePoint <= 0x7f) {
      buffer[bufferOffset++] = stringCodePoint;
    } else if (stringCodePoint >= 0xdc00 && stringCodePoint <= 0xdcff) {
      // eslint-disable-next-line no-bitwise
      buffer[bufferOffset++] = stringCodePoint & 0xff;
    } else {
      // eslint-disable-next-line no-bitwise
      buffer[bufferOffset++] = 0xc0 | (stringCodePoint >> 6);
      // eslint-disable-next-line no-bitwise
      buffer[bufferOffset++] = 0x80 | (stringCodePoint & 0x3f);
    }
  }

  return buffer.subarray(0, bufferOffset);
}
