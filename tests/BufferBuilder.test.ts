import { describe, it, expect } from "vitest";

import { BufferBuilder } from "@/BufferBuilder.js";
import { ByteOrder } from "@/types/ByteOrder.js";
import {
  TEST_BINARY_BUFFER,
  TEST_BINARY_BUFFER_LENGTH_BE,
  TEST_BINARY_BUFFER_LENGTH_LE,
  TEST_BINARY_BUFFER_MULTIBYTE,
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
  TEST_INT64,
  TEST_INT8,
  TEST_INT8_BUFFER,
  TEST_INT8_NEGATIVE,
  TEST_INT8_NEGATIVE_BUFFER,
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
  TEST_UTF8_BUFFER,
  TEST_UTF8_BUFFER_LENGTH_LE,
} from "@Tests/fixtures/data.js";

describe("class BufferBuilder", () => {
  const writeIntTests = [
    [0, 1, Buffer.from([0]), Buffer.from([0])],
    [0, 2, Buffer.from([0, 0]), Buffer.from([0, 0])],
    [0, 4, Buffer.from([0, 0, 0, 0]), Buffer.from([0, 0, 0, 0])],
    [127, 1, Buffer.from([127]), Buffer.from([127])],
    [-128, 1, Buffer.from([-128]), Buffer.from([-128])],
    [255, 2, Buffer.from([255, 0]), Buffer.from([0, 255])],
    [255, 4, Buffer.from([255, 0, 0, 0]), Buffer.from([0, 0, 0, 255])],
  ] as const;

  it.each(writeIntTests)(
    "method writeInt(%j, %j)",
    (value, bytes, expected, expectedBE) => {
      const bufferBuilder = new BufferBuilder();

      bufferBuilder.writeInt(value, bytes);

      expect(bufferBuilder.build()).toStrictEqual(expected);
      expect(bufferBuilder).toHaveLength(expected.length);

      const bufferBuilderBE = new BufferBuilder(ByteOrder.BIG_ENDIAN);

      bufferBuilderBE.writeInt(value, bytes);

      expect(bufferBuilderBE.build()).toStrictEqual(expectedBE);
      expect(bufferBuilderBE).toHaveLength(expectedBE.length);
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
    ["writeByte", TEST_INT8, TEST_INT8_BUFFER],
    ["writeInt8", TEST_INT8, TEST_INT8_BUFFER],
    ["writeInt8", TEST_INT8_NEGATIVE, TEST_INT8_NEGATIVE_BUFFER],
    ["writeUnsignedInt8", TEST_INT8, TEST_INT8_BUFFER],
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

  it("method writeInt64() LE", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeInt64(506_097_522_914_230_528n);

    expect(bufferBuilder.build()).toStrictEqual(TEST_INT64);
    expect(bufferBuilder).toHaveLength(8);
  });

  it("method writeUnsignedInt64() LE", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeUnsignedInt64(506_097_522_914_230_528n);

    expect(bufferBuilder.build()).toStrictEqual(TEST_INT64);
    expect(bufferBuilder).toHaveLength(8);
  });

  it("method writeInt64() BE", () => {
    const bufferBuilder = new BufferBuilder(ByteOrder.BIG_ENDIAN);

    bufferBuilder.writeInt64(283_686_952_306_183n);

    expect(bufferBuilder.build()).toStrictEqual(TEST_INT64);
    expect(bufferBuilder).toHaveLength(8);
  });

  it("method writeUnsignedInt64() BE", () => {
    const bufferBuilder = new BufferBuilder(ByteOrder.BIG_ENDIAN);

    bufferBuilder.writeUnsignedInt64(283_686_952_306_183n);

    expect(bufferBuilder.build()).toStrictEqual(TEST_INT64);
    expect(bufferBuilder).toHaveLength(8);
  });

  it("method writeString()", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeString(null);
    bufferBuilder.writeString(undefined);
    bufferBuilder.writeString(Buffer.from("ÿ", "binary"));
    bufferBuilder.writeString("Hello");

    expect(bufferBuilder.build()).toStrictEqual(
      Buffer.from("ÿHello", "binary"),
    );
    expect(bufferBuilder).toHaveLength(6);
  });

  const writeLengthPrefixedLETests = [
    ["null", null, TEST_STRING_LENGTH],
    ["undefined", undefined, TEST_STRING_LENGTH],
    ["empty", TEST_STRING_EMPTY, TEST_STRING_LENGTH],
    ["binary buffer", TEST_BINARY_BUFFER, TEST_BINARY_BUFFER_LENGTH_LE],
    ["UTF-8 buffer", TEST_UTF8_BUFFER, TEST_UTF8_BUFFER_LENGTH_LE],
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
    ["null", null, TEST_STRING_LENGTH],
    ["undefined", undefined, TEST_STRING_LENGTH],
    ["empty", TEST_STRING_EMPTY, TEST_STRING_LENGTH],
    ["binary buffer", TEST_BINARY_BUFFER, TEST_BINARY_BUFFER_LENGTH_BE],
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
    ["binary buffer", TEST_BINARY_BUFFER, TEST_BINARY_BUFFER_MULTIBYTE],
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
    bufferBuilder.writeNullTerminatedString(Buffer.from("ÿ", "binary"));
    bufferBuilder.writeNullTerminatedString("Hello");

    expect(bufferBuilder.build()).toStrictEqual(
      Buffer.from("\0\0ÿ\0Hello\0", "binary"),
    );
    expect(bufferBuilder).toHaveLength(10);
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

  it("method writeString() with utf-8 data", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeString("Olá!");

    expect(bufferBuilder.build()).toHaveLength(5);
    expect(bufferBuilder).toHaveLength(5);
  });

  it("method writeLengthPrefixedString() with utf-8 data", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeLengthPrefixedString("Olá!", 1);

    expect(bufferBuilder.build()).toHaveLength(6);
    expect(bufferBuilder).toHaveLength(6);
  });

  it("method writeMultibytePrefixedString() with utf-8 data", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeMultibytePrefixedString("Olá!");

    expect(bufferBuilder.build()).toHaveLength(6);
    expect(bufferBuilder).toHaveLength(6);
  });

  it("method writeNullTerminatedString() with utf-8 data", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeNullTerminatedString("Olá!");

    expect(bufferBuilder.build()).toHaveLength(6);
    expect(bufferBuilder).toHaveLength(6);
  });

  const padSamples = [
    ["Hello", "Hello\0\0\0", 8],
    ["Hello", "Hello\u0001\u0001\u0001", 8, "\u0001"],
    ["Hello", "Hello\u00AB\u00AB\u00AB", 8, "\u00AB"],
    ["Hello", "HelloPAD", 8, "PADDING"],
    ["Hello", "Hello", 5, "WORLD"],
    ["Hello", "HelloWORLD", 5, "WORLD", true],
    ["HelloWorld", "HelloWorld\0\0\0\0\0\0", 8],
  ] as const;

  it.each(padSamples)(
    "method pad()",
    (
      input: string,
      output: string,
      length: number,
      kind?: string,
      forced?: boolean,
    ) => {
      const bufferBuilder = new BufferBuilder();

      bufferBuilder.writeString(input);
      bufferBuilder.pad(length, kind, forced);

      expect(bufferBuilder.build()).toStrictEqual(
        Buffer.from(output, "binary"),
      );
    },
  );
});
