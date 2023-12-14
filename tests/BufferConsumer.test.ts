import { describe, expect, it } from "vitest";

import { BufferConsumer } from "@/BufferConsumer";
import {
  TEST_BUFFER_SAMPLE_A,
  TEST_FLOAT,
  TEST_STRING_100000_BYTES,
  TEST_STRING_100000_BYTES_MULTIBYTE,
  TEST_STRING_127_BYTES,
  TEST_STRING_127_BYTES_MULTIBYTE,
  TEST_STRING_128_BYTES,
  TEST_STRING_128_BYTES_MULTIBYTE,
  TEST_STRING_256_BYTES,
  TEST_STRING_256_BYTES_MULTIBYTE,
  TEST_STRING_4000_BYTES,
  TEST_STRING_4000_BYTES_MULTIBYTE,
  TEST_STRING_EMPTY,
  TEST_STRING_MULTIBYTE,
} from "@tests/fixtures/data";

describe("class BufferConsumer", () => {
  const readTests = [
    ["readByte", 0, 1, 1],
    ["readInt16", 0, 513, 2],
    ["readInt16", 4, -255, 6],
    ["readUnsignedInt16", 0, 513, 2],
    ["readInt32", 0, 67_305_985, 4],
    ["readInt32", 4, -255, 8],
    ["readUnsignedInt32", 0, 67_305_985, 4],
    ["readFloat", 8, TEST_FLOAT, 12],
    ["readLengthPrefixedString", 12, "Test", 20],
    ["readNullTerminatedString", 16, "Test", 21],
    ["readNullTerminatedString", 21, "TestEnd", 28],
  ] as const;

  it.each(readTests)(
    "method %s() at %s",
    (method, skip, output, thenOffset) => {
      const bufferConsumer = new BufferConsumer(TEST_BUFFER_SAMPLE_A);

      bufferConsumer.skip(skip);

      expect(bufferConsumer[method]()).toStrictEqual(output);
      expect(bufferConsumer.byteOffset).toStrictEqual(thenOffset);
    },
  );

  it("method readString()", () => {
    const bufferConsumer = new BufferConsumer(TEST_BUFFER_SAMPLE_A);

    bufferConsumer.skip(16);

    expect(bufferConsumer.readString(4)).toStrictEqual("Test");
  });

  it("sequential reading", () => {
    const bufferConsumer = new BufferConsumer(TEST_BUFFER_SAMPLE_A);

    bufferConsumer.skip(16);

    expect(bufferConsumer.readNullTerminatedString()).toStrictEqual("Test");
    expect(bufferConsumer.isConsumed()).toBeFalsy();
    expect(bufferConsumer.rest()).toStrictEqual(Buffer.from("TestEnd"));
    expect(bufferConsumer.readNullTerminatedString()).toStrictEqual("TestEnd");
    expect(bufferConsumer.isConsumed()).toBeTruthy();
  });

  const readMultibyteTests = [
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

  it.each(readMultibyteTests)(
    "method readMultibytePrefixedString(%s string)",
    (_, output, input) => {
      const bufferConsumer = new BufferConsumer(input);

      expect(bufferConsumer.readMultibytePrefixedString()).toStrictEqual(
        output,
      );
    },
  );

  it("method atConsumable()", () => {
    const bufferConsumer = new BufferConsumer(TEST_BUFFER_SAMPLE_A);

    expect(bufferConsumer.atConsumable(0)).toBeFalsy();
    expect(bufferConsumer.byteOffset).toStrictEqual(0);

    expect(bufferConsumer.atConsumable(1)).toBeTruthy();
    expect(bufferConsumer.byteOffset).toStrictEqual(1);

    expect(bufferConsumer.at(0)).toStrictEqual(2);
    expect(bufferConsumer.at(1)).toStrictEqual(3);
    expect(bufferConsumer.at(2)).toStrictEqual(4);

    bufferConsumer.back();

    expect(bufferConsumer.at(2)).toStrictEqual(3);
  });
});
