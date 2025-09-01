import { describe, expect, it } from "vitest";

import { encodeFromString, encodeToString } from "@/Encoding";

type Test = [buffer: Buffer, string: string];

const tests: Test[] = [
  [Buffer.from("hello"), "hello"],
  [Buffer.from("botão\0", "utf8"), "botão\0"],
  [Buffer.from("bot\xc3\xa3o\0", "binary"), "botão\0"],
  [Buffer.from("bot\xc3\xa3o\xc2", "binary"), "botão\udcc2"],
  [Buffer.from("bot\xc3\xa3o\xc2\xc2", "binary"), "botão\udcc2\udcc2"],
  [Buffer.from([0xcf, 0xff]), "\udccf\udcff"],
  [Buffer.from([0xff]), "\udcff"],
  [Buffer.from([0xfe]), "\udcfe"],
  [Buffer.from([0x41, 0xc2, 0x42, 0xff]), "A\udcc2B\udcff"],
  [Buffer.from("Привет", "utf8"), "Привет"],
  [Buffer.from("Ïÿ", "binary"), "\udccf\udcff"],
];

describe("encoding", () => {
  it.each(tests)("function encodeToString(%j) = %j", (buffer, string) => {
    expect(encodeToString(buffer)).toBe(string);
  });

  it.each(tests)("function encodeFromString(%j) = %j", (buffer, string) => {
    expect(encodeFromString(string)).toStrictEqual(buffer);
  });
});
