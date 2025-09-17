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

  it("method writeInt(255n, 8)", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeInt(-255n, 8);

    expect(bufferBuilder.build()).toStrictEqual(
      Buffer.from([1, 255, 255, 255, 255, 255, 255, 255]),
    );
    expect(bufferBuilder).toHaveLength(8);

    const bufferBuilderBE = new BufferBuilder(ByteOrder.BIG_ENDIAN);

    bufferBuilderBE.writeInt(-255n, 8);

    expect(bufferBuilderBE.build()).toStrictEqual(
      Buffer.from([255, 255, 255, 255, 255, 255, 255, 1]),
    );
    expect(bufferBuilderBE).toHaveLength(8);
  });

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

  it("method writeUnsignedInt(255n, 8)", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeUnsignedInt(255n, 8);

    expect(bufferBuilder.build()).toStrictEqual(
      Buffer.from([255, 0, 0, 0, 0, 0, 0, 0]),
    );
    expect(bufferBuilder).toHaveLength(8);

    const bufferBuilderBE = new BufferBuilder(ByteOrder.BIG_ENDIAN);

    bufferBuilderBE.writeUnsignedInt(255n, 8);

    expect(bufferBuilderBE.build()).toStrictEqual(
      Buffer.from([0, 0, 0, 0, 0, 0, 0, 255]),
    );
    expect(bufferBuilderBE).toHaveLength(8);
  });

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

  const deferredSamples = [
    ["writeByte", 123, Buffer.from([123])],
    ["writeInt8", -123, Buffer.from([133])],
    ["writeUnsignedInt8", 123, Buffer.from([123])],
    ["writeInt16", -123, Buffer.from([133, 255])],
    ["writeUnsignedInt16", 123, Buffer.from([123, 0])],
    ["writeInt32", -123, Buffer.from([133, 255, 255, 255])],
    ["writeUnsignedInt32", 123, Buffer.from([123, 0, 0, 0])],
    ["writeFloat", 123.456, Buffer.from([121, 233, 246, 66])],
  ] as const satisfies Array<
    [method: keyof BufferBuilder, value: bigint | number, buffer: Buffer]
  >;

  it.each(deferredSamples)("deferred method .%s()", (method, value, buffer) => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeUnsignedInt32(() => bufferBuilder.length);
    bufferBuilder[method](() => value);

    expect(bufferBuilder.build()).toStrictEqual(
      Buffer.concat([Buffer.from([4 + buffer.length, 0, 0, 0]), buffer]),
    );
  });

  it("deferred method .writeUnsignedInt64()", () => {
    const extraBuilder = new BufferBuilder();

    extraBuilder.writeUnsignedInt32(() => extraBuilder.length);

    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeInt32(() => bufferBuilder.length);
    bufferBuilder.writeUnsignedInt32(() => {
      const offset = bufferBuilder.length;

      bufferBuilder.push(extraBuilder.build());

      return offset;
    });
    bufferBuilder.writeUnsignedInt64(() => 123n);

    expect(bufferBuilder.build()).toStrictEqual(
      Buffer.concat([
        Buffer.from([4 + 4 + 8 + 4, 0, 0, 0]),
        Buffer.from([16, 0, 0, 0]),
        Buffer.from([123, 0, 0, 0, 0, 0, 0, 0]),
        Buffer.from([4, 0, 0, 0]),
      ]),
    );
  });

  const deferredCustomSamples = [
    ["writeInt", 1, 123, Buffer.from([5, 0, 0, 0, 123])],
    ["writeInt", 2, -123, Buffer.from([6, 0, 0, 0, 133, 255])],
    ["writeInt", 4, 123, Buffer.from([8, 0, 0, 0, 123, 0, 0, 0])],
    ["writeUnsignedInt", 1, 123, Buffer.from([5, 0, 0, 0, 123])],
    ["writeUnsignedInt", 2, 123, Buffer.from([6, 0, 0, 0, 123, 0])],
    ["writeUnsignedInt", 4, 123, Buffer.from([8, 0, 0, 0, 123, 0, 0, 0])],
  ] as const satisfies Array<
    [
      method: keyof BufferBuilder,
      bytes: 1 | 2 | 4,
      value: number,
      buffer: Buffer,
    ]
  >;

  it.each(deferredCustomSamples)(
    "deferred method .%s()",
    (method, bytes, value, buffer) => {
      const bufferBuilder = new BufferBuilder();

      bufferBuilder.writeUnsignedInt32(() => bufferBuilder.length);
      bufferBuilder[method](() => value, bytes);

      expect(bufferBuilder.build()).toStrictEqual(buffer);
    },
  );

  type OffsetTest = [
    buffer: Buffer | BufferBuilder,
    pad: number | undefined,
    offsetBytes: 1 | 2 | 4 | undefined,
    offsetWhenEmpty: number | undefined,
    expected: Buffer,
  ];

  const offsetTests: OffsetTest[] = [
    [
      Buffer.from([1, 2, 3, 4]),
      undefined,
      undefined,
      undefined,
      Buffer.from([12, 0, 0, 0, 8, 0, 0, 0, 1, 2, 3, 4]),
    ],
    [
      Buffer.from([1, 2, 3, 4]),
      8,
      undefined,
      undefined,
      Buffer.from([16, 0, 0, 0, 8, 0, 0, 0, 1, 2, 3, 4, 0, 0, 0, 0]),
    ],
    [
      Buffer.from([1, 2, 3, 4]),
      undefined,
      2,
      0xffff,
      Buffer.from([10, 0, 0, 0, 6, 0, 1, 2, 3, 4]),
    ],
    [
      Buffer.from([]),
      undefined,
      2,
      0xffff,
      Buffer.from([6, 0, 0, 0, 0xff, 0xff]),
    ],
    [Buffer.from([]), 4, 2, 0xffff, Buffer.from([6, 0, 0, 0, 0xff, 0xff])],
    [
      new BufferBuilder().writeUnsignedInt32(123),
      undefined,
      undefined,
      undefined,
      Buffer.from([12, 0, 0, 0, 8, 0, 0, 0, 123, 0, 0, 0]),
    ],
    [
      new BufferBuilder().writeUnsignedInt32(123),
      8,
      undefined,
      undefined,
      Buffer.from([16, 0, 0, 0, 8, 0, 0, 0, 123, 0, 0, 0, 0, 0, 0, 0]),
    ],
    [
      new BufferBuilder().writeUnsignedInt32(123),
      undefined,
      2,
      0xffff,
      Buffer.from([10, 0, 0, 0, 6, 0, 123, 0, 0, 0]),
    ],
    [
      new BufferBuilder(),
      undefined,
      2,
      0xffff,
      Buffer.from([6, 0, 0, 0, 0xff, 0xff]),
    ],
    [new BufferBuilder(), 4, 2, 0xffff, Buffer.from([6, 0, 0, 0, 0xff, 0xff])],
    [
      (() => {
        const bufferBuilder = new BufferBuilder();

        bufferBuilder.writeUnsignedInt32(() => bufferBuilder.length); // (B1)
        bufferBuilder.writeOffset(
          new BufferBuilder().writeUnsignedInt32(123), // (C1)
          16, // (C2)
        ); // (B2)
        bufferBuilder.pad(16, "\xff"); // (B3)

        return bufferBuilder;
      })(),
      48,
      undefined,
      undefined,
      Buffer.from([
        // (A1) Buffer total length (48 pad-sized)
        ...[48, 0, 0, 0],
        // (A2) Offset to secondary buffer.
        ...[8, 0, 0, 0],
        // (B1) Secondary buffer length (32 pad-sized)
        ...[32, 0, 0, 0],
        // (B2) Offset to tertiary buffer (after padding).
        ...[16, 0, 0, 0],
        // (B3) Secondary buffer padding to 16 bytes.
        ...[255, 255, 255, 255, 255, 255, 255, 255],
        // (C1) Secondary buffer tertiary buffer.
        ...[123, 0, 0, 0],
        // (C2) Tertiary padding.
        ...[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        // (A1) Primary buffer padding.
        ...[0, 0, 0, 0, 0, 0, 0, 0],
      ]),
    ],
  ];

  it.each(offsetTests)(
    "method .writeOffset(%j, %j, %j, %j)",
    (buffer, pad, offsetBytes, offsetWhenEmpty, expected) => {
      const bufferBuilder = new BufferBuilder();

      bufferBuilder.writeUnsignedInt32(() => bufferBuilder.length); // (A1)
      bufferBuilder.writeOffset(buffer, pad, offsetBytes, offsetWhenEmpty); // (A2)

      expect(bufferBuilder.build()).toStrictEqual(expected);
    },
  );

  it("method .writeOffset(Buffer [1, 2, 3, 4])", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeUnsignedInt32(() => bufferBuilder.length);
    bufferBuilder.writeOffset(Buffer.from([1, 2, 3, 4]), undefined, 8);

    expect(bufferBuilder.build()).toStrictEqual(
      Buffer.from([16, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4]),
    );
  });

  it("method .writeOffset(empty, undefined, 8, 0xffffffffffffffffn)", () => {
    const bufferBuilder = new BufferBuilder();

    bufferBuilder.writeUnsignedInt32(() => bufferBuilder.length);
    bufferBuilder.writeOffset(
      Buffer.alloc(0),
      undefined,
      8,
      0xffffffffffffffffn,
    );

    expect(bufferBuilder.build()).toStrictEqual(
      Buffer.from([12, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 255]),
    );
  });
});
