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
  const writeIntTests = [
    [0, 1, Buffer.from([0])],
    [0, 2, Buffer.from([0, 0])],
    [0, 4, Buffer.from([0, 0, 0, 0])],
    [127, 1, Buffer.from([127])],
    [-128, 1, Buffer.from([-128])],
    [255, 2, Buffer.from([255, 0])],
    [255, 4, Buffer.from([255, 0, 0, 0])],
  ] as const;

  it.each(writeIntTests)(
    "method writeInt(%j, %j)",
    (value, bytes, expected) => {
      const bufferBuilder = new BufferBuilder();

      bufferBuilder.writeInt(value, bytes);

      expect(bufferBuilder.build()).toStrictEqual(expected);
      expect(bufferBuilder).toHaveLength(expected.length);
    },
  );

  const writeUnsignedIntTests = [
    [0, 1, Buffer.from([0])],
    [0, 2, Buffer.from([0, 0])],
    [0, 4, Buffer.from([0, 0, 0, 0])],
    [255, 1, Buffer.from([255])],
    [255, 2, Buffer.from([255, 0])],
    [255, 4, Buffer.from([255, 0, 0, 0])],
  ] as const;

  it.each(writeUnsignedIntTests)(
    "method writeUnsignedInt(%j, %j)",
    (value, bytes, expected) => {
      const bufferBuilder = new BufferBuilder();

      bufferBuilder.writeUnsignedInt(value, bytes);

      expect(bufferBuilder.build()).toStrictEqual(expected);
      expect(bufferBuilder).toHaveLength(expected.length);
    },
  );

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
    expect(bufferBuilder).toHaveLength(expected.length);
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
    expect(bufferBuilder).toHaveLength(expected.length);
  });

  it("method writeString()", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeString(null);
    bufferBuilder.writeString(undefined);
    bufferBuilder.writeString("Hello");

    expect(bufferBuilder.build()).toStrictEqual(Buffer.from("Hello"));
    expect(bufferBuilder).toHaveLength(5);
  });

  const writeLengthPrefixedLETests = [
    ["null", null, TEST_STRING_LENGTH],
    ["undefined", undefined, TEST_STRING_LENGTH],
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
      expect(bufferBuilder).toHaveLength(output.length);
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

      expect(bufferBuilder.build()).toStrictEqual(output);
      expect(bufferBuilder).toHaveLength(output.length);
    },
  );

  const writeMultibytePrefixedTests = [
    ["null", null, TEST_STRING_MULTIBYTE],
    ["undefined", undefined, TEST_STRING_MULTIBYTE],
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
      expect(bufferBuilder).toHaveLength(output.length);
    },
  );

  it("method writeNullTerminatedString()", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeNullTerminatedString(null);
    bufferBuilder.writeNullTerminatedString(undefined);
    bufferBuilder.writeNullTerminatedString("Hello");

    expect(bufferBuilder.build()).toStrictEqual(Buffer.from("\0\0Hello\0"));
    expect(bufferBuilder).toHaveLength(8);
  });

  it("method push()", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeString("Hello");
    bufferBuilder.push(TEST_STRING_MULTIBYTE);

    const bufferHello = Buffer.from("Hello\0");

    expect(bufferBuilder.build()).toStrictEqual(bufferHello);
    expect(bufferBuilder).toHaveLength(bufferHello.length);
  });

  it("method write()", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeString("Hello");
    bufferBuilder.write(0);
    bufferBuilder.write(3, "\u00FF");
    bufferBuilder.write(2, "\u00FF\u00FF");

    const bufferHello = Buffer.from(
      "Hello\u00FF\u00FF\u00FF\u00FF\u00FF\u00FF\u00FF",
    );

    expect(bufferBuilder.build()).toStrictEqual(bufferHello);
    expect(bufferBuilder).toHaveLength(bufferHello.length);
  });
});
