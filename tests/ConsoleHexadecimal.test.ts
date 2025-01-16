import chalk from "chalk";
import strip from "strip-ansi";
import { describe, expect, it, vitest } from "vitest";

import { printHexadecimal } from "../src/ConsoleHexadecimal.js";
import { PrintHexadecimalPreset } from "../src/types/PrintHexadecimalPreset.js";

describe("console", () => {
  chalk.level = 2;

  const samples = [
    ["simplified empty", Buffer.from([]), PrintHexadecimalPreset.SIMPLIFIED],
    ["simplified 1 byte", Buffer.from([0]), PrintHexadecimalPreset.SIMPLIFIED],
    [
      "simplified 40 bytes",
      Buffer.from("hello".repeat(8)),
      PrintHexadecimalPreset.SIMPLIFIED,
    ],
    ["UINT8 1 byte", Buffer.from([0]), PrintHexadecimalPreset.UINT8],
    ["INT8 1 byte", Buffer.from([0]), PrintHexadecimalPreset.INT8],
    [
      "UINT8 5 bytes",
      Buffer.from([10, 20, 30, 40, 250]),
      PrintHexadecimalPreset.UINT8,
    ],
    [
      "INT8 5 bytes",
      Buffer.from([10, 20, 30, 40, 250]),
      PrintHexadecimalPreset.INT8,
    ],
    [
      "INT8 26 bytes",
      Buffer.from([
        0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
        160, 170, 180, 190, 200, 210, 220, 230, 240, 250,
      ]),
      PrintHexadecimalPreset.INT8,
    ],
    [
      "UINT16_LE 5 bytes",
      Buffer.from([10, 20, 30, 250, 250]),
      PrintHexadecimalPreset.UINT16_LE,
    ],
    [
      "INT16_LE 5 bytes",
      Buffer.from([10, 20, 30, 250, 250]),
      PrintHexadecimalPreset.INT16_LE,
    ],
    [
      "UINT32_LE 5 bytes",
      Buffer.from([10, 20, 30, 250, 250]),
      PrintHexadecimalPreset.UINT32_LE,
    ],
    [
      "INT32_LE 5 bytes",
      Buffer.from([10, 20, 30, 250, 250]),
      PrintHexadecimalPreset.INT32_LE,
    ],
    [
      "FLOAT_LE 9 bytes",
      Buffer.from([0x42, 0xf6, 0xe9, 0x79, 0x79, 0xe9, 0xf6, 0x42, 0x00]),
      PrintHexadecimalPreset.FLOAT_LE,
    ],
    [
      "UINT16_BE 5 bytes",
      Buffer.from([10, 20, 30, 250, 250]),
      PrintHexadecimalPreset.UINT16_BE,
    ],
    [
      "INT16_BE 5 bytes",
      Buffer.from([10, 20, 30, 250, 250]),
      PrintHexadecimalPreset.INT16_BE,
    ],
    [
      "UINT32_BE 5 bytes",
      Buffer.from([10, 20, 30, 250, 250]),
      PrintHexadecimalPreset.UINT32_BE,
    ],
    [
      "INT32_BE 5 bytes",
      Buffer.from([10, 20, 30, 250, 250]),
      PrintHexadecimalPreset.INT32_BE,
    ],
    [
      "FLOAT_BE 9 bytes",
      Buffer.from([0x42, 0xf6, 0xe9, 0x79, 0x79, 0xe9, 0xf6, 0x42, 0x00]),
      PrintHexadecimalPreset.FLOAT_BE,
    ],
  ] as const;

  it.each(samples)("function printHexadecimal(): %s", (_, buffer, preset) => {
    let stdoutMessage: Uint8Array | string | undefined;

    vitest
      .spyOn(process.stdout, "write")
      .mockImplementationOnce((str: Uint8Array | string) => {
        stdoutMessage = str;

        return true;
      });

    printHexadecimal(buffer, preset);

    expect(strip(stdoutMessage as string)).toMatchSnapshot("ansi");
    expect(stdoutMessage).toMatchSnapshot("colors");
  });
});
