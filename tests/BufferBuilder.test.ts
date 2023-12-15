import { describe, it, expect } from "vitest";

import { BufferBuilder } from "../src/BufferBuilder.js";
import { ByteOrder } from "../src/types/ByteOrder.js";

import {
  TEST_FLOAT,
  TEST_FLOAT_BUFFER_BE,
  TEST_FLOAT_BUFFER_LE,
  TEST_INT16,
  TEST_INT16_BUFFER_BE,
  TEST_INT16_BUFFER_LE,
  TEST_INT16_NEGATIVE,
  TEST_INT16_NEGATIVE_BUFFER_BE,
  TEST_INT16_NEGATIVE_BUFFER_LE,
  TEST_INT32,
  TEST_INT32_BUFFER_BE,
  TEST_INT32_BUFFER_LE,
  TEST_INT32_NEGATIVE,
  TEST_INT32_NEGATIVE_BUFFER_BE,
  TEST_INT32_NEGATIVE_BUFFER_LE,
  TEST_INT8,
  TEST_INT8_BUFFER_LE,
  TEST_STRING_100000_BYTES,
  TEST_STRING_100000_BYTES_LENGTH,
  TEST_STRING_100000_BYTES_LENGTH_BE,
  TEST_STRING_100000_BYTES_MULTIBYTE,
  TEST_STRING_127_BYTES,
  TEST_STRING_127_BYTES_LENGTH,
  TEST_STRING_127_BYTES_LENGTH_BE,
  TEST_STRING_127_BYTES_MULTIBYTE,
  TEST_STRING_128_BYTES,
  TEST_STRING_128_BYTES_LENGTH,
  TEST_STRING_128_BYTES_LENGTH_BE,
  TEST_STRING_128_BYTES_MULTIBYTE,
  TEST_STRING_256_BYTES,
  TEST_STRING_256_BYTES_LENGTH,
  TEST_STRING_256_BYTES_LENGTH_BE,
  TEST_STRING_256_BYTES_MULTIBYTE,
  TEST_STRING_4000_BYTES,
  TEST_STRING_4000_BYTES_LENGTH,
  TEST_STRING_4000_BYTES_LENGTH_BE,
  TEST_STRING_4000_BYTES_MULTIBYTE,
  TEST_STRING_EMPTY,
  TEST_STRING_LENGTH,
  TEST_STRING_MULTIBYTE,
} from "./fixtures/data.js";

describe("class BufferBuilder", () => {
  const writeIntLETests = [
    ["writeByte", TEST_INT8, TEST_INT8_BUFFER_LE],
    ["writeInt16", TEST_INT16, TEST_INT16_BUFFER_LE],
    ["writeInt16", TEST_INT16_NEGATIVE, TEST_INT16_NEGATIVE_BUFFER_LE],
    ["writeUnsignedInt16", TEST_INT16, TEST_INT16_BUFFER_LE],
    ["writeInt32", TEST_INT32, TEST_INT32_BUFFER_LE],
    ["writeInt32", TEST_INT32_NEGATIVE, TEST_INT32_NEGATIVE_BUFFER_LE],
    ["writeUnsignedInt32", TEST_INT32, TEST_INT32_BUFFER_LE],
    ["writeFloat", TEST_FLOAT, TEST_FLOAT_BUFFER_LE],
  ] as const;

  it.each(writeIntLETests)("method %s(%s) LE", (method, value, expected) => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder[method](value);

    expect(bufferBuilder.build()).toStrictEqual(expected);
  });

  const writeIntBETests = [
    ["writeInt16", TEST_INT16, TEST_INT16_BUFFER_BE],
    ["writeInt16", TEST_INT16_NEGATIVE, TEST_INT16_NEGATIVE_BUFFER_BE],
    ["writeUnsignedInt16", TEST_INT16, TEST_INT16_BUFFER_BE],
    ["writeInt32", TEST_INT32, TEST_INT32_BUFFER_BE],
    ["writeInt32", TEST_INT32_NEGATIVE, TEST_INT32_NEGATIVE_BUFFER_BE],
    ["writeUnsignedInt32", TEST_INT32, TEST_INT32_BUFFER_BE],
    ["writeFloat", TEST_FLOAT, TEST_FLOAT_BUFFER_BE],
  ] as const;

  it.each(writeIntBETests)("method %s(%s) BE", (method, value, expected) => {
    const bufferBuilder = new BufferBuilder(ByteOrder.BIG_ENDIAN);

    bufferBuilder[method](value);

    expect(bufferBuilder.build()).toStrictEqual(expected);
  });

  it("method writeString()", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeString("Hello");

    expect(bufferBuilder.build()).toStrictEqual(Buffer.from("Hello"));
  });

  const writeMultibytePrefixedTests = [
    ["empty", TEST_STRING_EMPTY, TEST_STRING_MULTIBYTE],
    ["127 bytes", TEST_STRING_127_BYTES, TEST_STRING_127_BYTES_MULTIBYTE],
    ["128 bytes", TEST_STRING_128_BYTES, TEST_STRING_128_BYTES_MULTIBYTE],
    ["256 bytes", TEST_STRING_256_BYTES, TEST_STRING_256_BYTES_MULTIBYTE],
    ["4000 bytes", TEST_STRING_4000_BYTES, TEST_STRING_4000_BYTES_MULTIBYTE],
    [
      "100_000 bytes",
      TEST_STRING_100000_BYTES,
      TEST_STRING_100000_BYTES_MULTIBYTE,
    ],
  ] as const;

  it.each(writeMultibytePrefixedTests)(
    "method writeMultibytePrefixedString(%s string)",
    (_, input, output) => {
      const bufferBuilder = new BufferBuilder();

      bufferBuilder.writeMultibytePrefixedString(input);

      expect(bufferBuilder.build()).toStrictEqual(output);
    },
  );

  const writeLengthPrefixedLETests = [
    ["empty", TEST_STRING_EMPTY, TEST_STRING_LENGTH],
    ["127 bytes", TEST_STRING_127_BYTES, TEST_STRING_127_BYTES_LENGTH],
    ["128 bytes", TEST_STRING_128_BYTES, TEST_STRING_128_BYTES_LENGTH],
    ["256 bytes", TEST_STRING_256_BYTES, TEST_STRING_256_BYTES_LENGTH],
    ["4000 bytes", TEST_STRING_4000_BYTES, TEST_STRING_4000_BYTES_LENGTH],
    [
      "100_000 bytes",
      TEST_STRING_100000_BYTES,
      TEST_STRING_100000_BYTES_LENGTH,
    ],
  ] as const;

  it.each(writeLengthPrefixedLETests)(
    "method writeLengthPrefixedString(%s string) LE",
    (_, input, output) => {
      const bufferBuilder = new BufferBuilder();

      bufferBuilder.writeLengthPrefixedString(input);

      expect(bufferBuilder.build()).toStrictEqual(output);
    },
  );

  const writeLengthPrefixedBETests = [
    ["empty", TEST_STRING_EMPTY, TEST_STRING_LENGTH],
    ["127 bytes", TEST_STRING_127_BYTES, TEST_STRING_127_BYTES_LENGTH_BE],
    ["128 bytes", TEST_STRING_128_BYTES, TEST_STRING_128_BYTES_LENGTH_BE],
    ["256 bytes", TEST_STRING_256_BYTES, TEST_STRING_256_BYTES_LENGTH_BE],
    ["4000 bytes", TEST_STRING_4000_BYTES, TEST_STRING_4000_BYTES_LENGTH_BE],
    [
      "100_000 bytes",
      TEST_STRING_100000_BYTES,
      TEST_STRING_100000_BYTES_LENGTH_BE,
    ],
  ] as const;

  it.each(writeLengthPrefixedBETests)(
    "method writeLengthPrefixedString(%s string) BE",
    (_, input, output) => {
      const bufferBuilder = new BufferBuilder(ByteOrder.BIG_ENDIAN);

      bufferBuilder.writeLengthPrefixedString(input);

      expect(bufferBuilder.build().subarray(0, 10)).toStrictEqual(
        output.subarray(0, 10),
      ); // @todo Remove
      expect(bufferBuilder.build()).toStrictEqual(output);
    },
  );

  it("method writeNullTerminatedString()", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeNullTerminatedString("Hello");

    expect(bufferBuilder.build()).toStrictEqual(Buffer.from("Hello\0"));
  });

  it("method push()", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.push(TEST_STRING_MULTIBYTE);

    expect(bufferBuilder.build()).toStrictEqual(TEST_STRING_MULTIBYTE);
  });
});
