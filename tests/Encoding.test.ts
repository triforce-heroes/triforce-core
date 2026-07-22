import { describe, expect, it } from "vitest";

import { encodeFromString, encodeToString } from "@/Encoding";

type Test = [buffer: Buffer, string: string];

const tests: Test[] = [
  [Buffer.from("hello"), "hello"],
  [Buffer.from("botão\0", "utf8"), "botão\0"],
  [Buffer.from("bot\u{C3}\u{A3}o\0", "binary"), "botão\0"],
  [Buffer.from("bot\u{C3}\u{A3}o\u{C2}", "binary"), "botão\u{DCC2}"],
  [Buffer.from("bot\u{C3}\u{A3}o\u{C2}\u{C2}", "binary"), "botão\u{DCC2}\u{DCC2}"],
  [Buffer.from([0xcf, 0xff]), "\u{DCCF}\u{DCFF}"],
  [Buffer.from([0xff]), "\u{DCFF}"],
  [Buffer.from([0xfe]), "\u{DCFE}"],
  [Buffer.from([0x41, 0xc2, 0x42, 0xff]), "A\u{DCC2}B\u{DCFF}"],
  [Buffer.from("Привет", "utf8"), "Привет"],
  [Buffer.from("Ïÿ", "binary"), "\u{DCCF}\u{DCFF}"],
  [Buffer.from([0xa9]), "\u{DCA9}"],
  [Buffer.from([0xa9, 0x31]), "\u{DCA9}1"],
];

describe("encoding", () => {
  it.each(tests)("function encodeToString(%j) = %j", (buffer, string) => {
    expect(encodeToString(buffer)).toBe(string);
  });

  it.each(tests)("function encodeFromString(%j) = %j", (buffer, string) => {
    expect(encodeFromString(string)).toStrictEqual(buffer);
  });

  for (let index = 0; index <= 255; index++) {
    const string = String.fromCodePoint(index);

    it(`function encodeToString(${JSON.stringify(string)})`, () => {
      const buffer = Buffer.from(
        index <= 0x7f ? [index] : index <= 0xbf ? [194, index] : [195, index - 64],
      );

      expect(encodeFromString(string)).toStrictEqual(buffer);
      expect(encodeToString(buffer)).toBe(string);
    });
  }
});
