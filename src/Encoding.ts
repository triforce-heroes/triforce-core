// oxlint-disable id-match
import { decode, encode } from "iconv-lite";

export type NativeEncoding = "latin1" | "utf-8" | "utf16-le";

export type ExtraEncoding = "shift-jis" | "big5" | "gbk" | "euc-kr";

export type TextEncoding = NativeEncoding | ExtraEncoding;

const NATIVE_ENCODINGS: ReadonlySet<string> = new Set(["latin1", "utf-8", "utf16-le"]);

function isNativeEncoding(encoding: TextEncoding): encoding is NativeEncoding {
  return NATIVE_ENCODINGS.has(encoding.toLowerCase());
}

function toNativeEncoding(encoding: NativeEncoding): BufferEncoding {
  if (encoding.toLowerCase() === "utf16-le") {
    return "utf16le";
  }

  return encoding as Exclude<NativeEncoding, "utf16-le">;
}

export function decodeBuffer(buffer: Buffer | Uint8Array, encoding: TextEncoding = "utf-8") {
  if (isNativeEncoding(encoding)) {
    const nativeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

    return nativeBuffer.toString(toNativeEncoding(encoding));
  }

  // Dashed labels are canonicalized by iconv-lite at runtime.
  return decode(Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer), encoding);
}

export function encodeString(value: string, encoding: TextEncoding = "utf-8") {
  if (isNativeEncoding(encoding)) {
    return Buffer.from(value, toNativeEncoding(encoding));
  }

  // Dashed labels are canonicalized by iconv-lite at runtime.
  return encode(value, encoding);
}

export function getNullTerminator(encoding: TextEncoding = "utf-8") {
  return encodeString("\0", encoding);
}

export function getNullTerminatorByteLength(encoding: TextEncoding = "utf-8") {
  return getNullTerminator(encoding).length;
}

export function encodeToString(buffer: Buffer) {
  let string = "";

  for (let bufferOffset = 0; bufferOffset < buffer.length; bufferOffset++) {
    const bufferChar1 = buffer[bufferOffset]!;

    if (bufferChar1 <= 0x7f) {
      string += String.fromCodePoint(bufferChar1);

      continue;
    }

    if (bufferOffset + 1 < buffer.length && bufferChar1 >= 0xc2 && bufferChar1 <= 0xdf) {
      const bufferChar2 = buffer.at(bufferOffset + 1)!;

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
    string += String.fromCodePoint(0xdc_00 | bufferChar1);
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
    } else if (stringCodePoint >= 0xdc_00 && stringCodePoint <= 0xdc_ff) {
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
