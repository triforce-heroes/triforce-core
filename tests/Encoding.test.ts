import { describe, expect, it } from "vitest";

import { encodeFromString, encodeToString } from "@/Encoding";

type Test = [buffer: Buffer, string: string];

const tests: Test[] = [
  [Buffer.from("hello"), "hello"],
  [Buffer.from("botão\0", "utf8"), "botão\0"],
  [Buffer.from("bot\u00C3\u00A3o\0", "binary"), "botão\0"],
  [Buffer.from("bot\u00C3\u00A3o\u00C2", "binary"), "botão\uDCC2"],
  [Buffer.from("bot\u00C3\u00A3o\u00C2\u00C2", "binary"), "botão\uDCC2\uDCC2"],
  [Buffer.from([0xcf, 0xff]), "\uDCCF\uDCFF"],
  [Buffer.from([0xff]), "\uDCFF"],
  [Buffer.from([0xfe]), "\uDCFE"],
  [Buffer.from([0x41, 0xc2, 0x42, 0xff]), "A\uDCC2B\uDCFF"],
  [Buffer.from("Привет", "utf8"), "Привет"],
  [Buffer.from("Ïÿ", "binary"), "\uDCCF\uDCFF"],
  [Buffer.from([0xa9]), "\uDCA9"],
  [Buffer.from([0xa9, 0x31]), "\uDCA91"],
];

describe("encoding", () => {
  it.each(tests)("function encodeToString(%j) = %j", (buffer, string) => {
    expect(encodeToString(buffer)).toBe(string);
  });

  it.each(tests)("function encodeFromString(%j) = %j", (buffer, string) => {
    expect(encodeFromString(string)).toStrictEqual(buffer);
  });

  for (let i = 0; i <= 255; i++) {
    const string = String.fromCodePoint(i);

    it(`function encodeToString(${JSON.stringify(string)})`, () => {
      const buffer = Buffer.from(i <= 0x7f ? [i] : i <= 0xbf ? [194, i] : [195, i - 64]);

      expect(encodeFromString(string)).toStrictEqual(buffer);
      expect(encodeToString(buffer)).toBe(string);
    });
  }
});
