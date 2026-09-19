import { describe, expect, it } from "vitest";

import {
  decodeBuffer,
  encodeFromString,
  encodeString,
  encodeToString,
  getNullTerminatorByteLength,
  type TextEncoding,
} from "#/Encoding";

type Test = [buffer: Buffer, string: string];

const tests: Test[] = [
  [Buffer.from("hello"), "hello"],
  [Buffer.from("botão\0", "utf-8"), "botão\0"],
  [Buffer.from("bot\u{C3}\u{A3}o\0", "binary"), "botão\0"],
  [Buffer.from("bot\u{C3}\u{A3}o\u{C2}", "binary"), "botão\u{DCC2}"],
  [Buffer.from("bot\u{C3}\u{A3}o\u{C2}\u{C2}", "binary"), "botão\u{DCC2}\u{DCC2}"],
  [Buffer.from([0xcf, 0xff]), "\u{DCCF}\u{DCFF}"],
  [Buffer.from([0xff]), "\u{DCFF}"],
  [Buffer.from([0xfe]), "\u{DCFE}"],
  [Buffer.from([0x41, 0xc2, 0x42, 0xff]), "A\u{DCC2}B\u{DCFF}"],
  [Buffer.from("Привет", "utf-8"), "Привет"],
  [Buffer.from("Ïÿ", "binary"), "\u{DCCF}\u{DCFF}"],
  [Buffer.from([0xa9]), "\u{DCA9}"],
  [Buffer.from([0xa9, 0x31]), "\u{DCA9}1"],
];

const byteCases = Array.from({ length: 256 }, (_, index) => {
  const string = String.fromCodePoint(index);

  const buffer = Buffer.from(
    index <= 0x7f ? [index] : index <= 0xbf ? [194, index] : [195, index - 64],
  );

  return [string, buffer] as const;
});

describe("encoding", () => {
  it.each(tests)("function encodeToString(%j) = %j", (buffer, string) => {
    expect(encodeToString(buffer)).toBe(string);
  });

  it.each(tests)("function encodeFromString(%j) = %j", (buffer, string) => {
    expect(encodeFromString(string)).toStrictEqual(buffer);
  });

  it.each(byteCases)("function encodeToString(%j)", (string, buffer) => {
    expect(encodeFromString(string)).toStrictEqual(buffer);
    expect(encodeToString(buffer)).toBe(string);
  });

  const extraCases: Array<[encoding: TextEncoding, text: string]> = [
    ["shift-jis", "こんにちは"],
    ["big5", "繁體中文"],
    ["gbk", "简体中文"],
    ["euc-kr", "한국어"],
  ];

  it.each(extraCases)("function decodeBuffer/encodeString(%s) roundtrip", (encoding, text) => {
    const buffer = encodeString(text, encoding);

    expect(buffer.length).toBeGreaterThan(text.length);
    expect(decodeBuffer(buffer, encoding)).toBe(text);
  });

  it("function decodeBuffer/encodeString(utf16-le) matches Buffer utf16le bytes", () => {
    expect(encodeString("Olá!", "utf16-le")).toStrictEqual(Buffer.from("Olá!", "utf16le"));
    expect(decodeBuffer(Buffer.from("Olá!", "utf16le"), "utf16-le")).toBe("Olá!");
  });

  const terminatorCases: Array<[encoding: TextEncoding, length: number]> = [
    ["latin1", 1],
    ["utf-8", 1],
    ["utf16-le", 2],
    ["shift-jis", 1],
    ["big5", 1],
    ["gbk", 1],
    ["euc-kr", 1],
  ];

  it.each(terminatorCases)("function getNullTerminatorByteLength(%s) = %i", (encoding, length) => {
    expect(getNullTerminatorByteLength(encoding)).toBe(length);
  });
});
