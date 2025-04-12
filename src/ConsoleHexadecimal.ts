#!/usr/bin/env node

import chalk from "chalk";

import { PrintHexadecimalPreset } from "@/types/PrintHexadecimalPreset.js";

const hexadecimalDot = chalk.ansi256(240)(".");
const hexadecimalNumberPadding = " ".repeat(9);

type PrintHexadecimalPresetData = [
  padding: number,
  bytes: number,
  unsigned?: boolean,
  littleEndian?: boolean,
  isFloat?: boolean,
];

const printHexadecimalPreset: Record<
  PrintHexadecimalPreset,
  PrintHexadecimalPresetData
> = {
  [PrintHexadecimalPreset.SIMPLIFIED]: [2, 1],
  [PrintHexadecimalPreset.UINT8]: [4, 1, true],
  [PrintHexadecimalPreset.UINT16_LE]: [3, 2, true, true],
  [PrintHexadecimalPreset.UINT16_BE]: [3, 2, true],
  [PrintHexadecimalPreset.UINT32_LE]: [3, 4, true, true],
  [PrintHexadecimalPreset.UINT32_BE]: [3, 4, true],
  [PrintHexadecimalPreset.INT8]: [5, 1],
  [PrintHexadecimalPreset.INT16_LE]: [4, 2, false, true],
  [PrintHexadecimalPreset.INT16_BE]: [4, 2],
  [PrintHexadecimalPreset.INT32_LE]: [3, 4, false, true],
  [PrintHexadecimalPreset.INT32_BE]: [3, 4],
  [PrintHexadecimalPreset.FLOAT_LE]: [7, 4, undefined, true, true],
  [PrintHexadecimalPreset.FLOAT_BE]: [7, 4, undefined, false, true],
};

function numberNormalize(number: number) {
  const numberString = String(number);

  if (!numberString.includes(".") || numberString.includes("e")) {
    return numberString;
  }

  return number.toFixed(15 - String(Math.floor(number)).length);
}

function generateNumbers(buffer: Buffer, preset: PrintHexadecimalPreset) {
  let numbers = hexadecimalNumberPadding;

  const [padding, bytes, unsigned, littleEndian, isFloat] =
    printHexadecimalPreset[preset];

  const bufferFunction =
    isFloat === true
      ? littleEndian === true
        ? "readFloatLE"
        : "readFloatBE"
      : littleEndian === true
      ? unsigned === true
        ? "readUIntLE"
        : "readIntLE"
      : unsigned === true
      ? "readUIntBE"
      : "readIntBE";

  for (let j = 0; j <= buffer.length - bytes; j += bytes) {
    numbers += numberNormalize(buffer[bufferFunction](j, bytes)).padStart(
      padding * bytes,
      " ",
    );
  }

  numbers += "\n";

  return chalk.gray(numbers);
}

export function printHexadecimal(
  buffer: Buffer,
  preset = PrintHexadecimalPreset.SIMPLIFIED,
) {
  const [padding] = printHexadecimalPreset[preset];
  let output = "";

  for (let i = 0; i < buffer.length; i += 16) {
    let bufferOutput = chalk.gray(
      `${i.toString(16).toUpperCase().padStart(8, "0")} `,
    );

    let hexadecimals = "";
    let characters = "";

    const bufferDigits = buffer.subarray(i, i + 16);

    for (const bufferDigit of bufferDigits) {
      hexadecimals += bufferDigit
        .toString(16)
        .toUpperCase()
        .padStart(2, "0")
        .padStart(padding, " ");

      characters +=
        (bufferDigit > 31 && bufferDigit < 127) ||
        (bufferDigit > 159 && bufferDigit <= 255)
          ? String.fromCodePoint(bufferDigit)
          : hexadecimalDot;
    }

    bufferOutput += hexadecimals.padEnd(padding * 16 + 1, " ");
    bufferOutput += chalk.whiteBright(characters);
    bufferOutput += "\n";

    output +=
      preset === PrintHexadecimalPreset.SIMPLIFIED
        ? bufferOutput
        : bufferOutput + generateNumbers(bufferDigits, preset);
  }

  process.stdout.write(output);
}
