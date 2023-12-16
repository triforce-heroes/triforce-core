import { describe, expect, it } from "vitest";

import { BufferConsumer } from "../src/BufferConsumer.js";
import { ByteOrder } from "../src/types/ByteOrder.js";

import {
  TEST_BUFFER_SAMPLE_BE,
  TEST_BUFFER_SAMPLE_LE,
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
} from "./fixtures/data.js";

describe("class BufferConsumer", () => {
  it("method read()", () => {
    const bufferConsumer = new BufferConsumer(Buffer.from("Hello"));

    expect(bufferConsumer.readString(2)).toStrictEqual("He");
    expect(bufferConsumer.read(2)).toStrictEqual(Buffer.from("ll"));
    expect(bufferConsumer.read(2)).toStrictEqual(Buffer.from("o"));
    expect(bufferConsumer.read(2)).toStrictEqual(Buffer.from([]));
    expect(bufferConsumer.isConsumed()).toBeTruthy();
    expect(bufferConsumer.read()).toStrictEqual(Buffer.from([]));
    expect(bufferConsumer.isConsumed()).toBeTruthy();
  });

  it("method readInt8()", () => {
    const bufferConsumer = new BufferConsumer(Buffer.from([100, 200]));

    expect(bufferConsumer.readUnsignedInt8()).toStrictEqual(100);
    expect(bufferConsumer.readInt8()).toStrictEqual(-56);
  });

  const readLETests = [
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

  it.each(readLETests)(
    "method %s() (LE) at %s",
    (method, skip, output, thenOffset) => {
      const bufferConsumer = new BufferConsumer(TEST_BUFFER_SAMPLE_LE);

      bufferConsumer.skip(skip);

      expect(bufferConsumer[method]()).toStrictEqual(output);
      expect(bufferConsumer.byteOffset).toStrictEqual(thenOffset);
    },
  );

  const readBETests = [
    ["readInt16", 0, 1027, 2],
    ["readInt16", 4, -1, 6],
    ["readUnsignedInt16", 0, 1027, 2],
    ["readInt32", 0, 67_305_985, 4],
    ["readInt32", 4, -255, 8],
    ["readUnsignedInt32", 0, 67_305_985, 4],
    ["readFloat", 8, TEST_FLOAT, 12],
    ["readLengthPrefixedString", 12, "Test", 20],
  ] as const;

  it.each(readBETests)(
    "method %s() (BE) at %s",
    (method, skip, output, thenOffset) => {
      const bufferConsumer = new BufferConsumer(
        TEST_BUFFER_SAMPLE_BE,
        undefined,
        ByteOrder.BIG_ENDIAN,
      );

      bufferConsumer.skip(skip);

      expect(bufferConsumer[method]()).toStrictEqual(output);
      expect(bufferConsumer.byteOffset).toStrictEqual(thenOffset);
    },
  );

  it("method readString()", () => {
    const bufferConsumer = new BufferConsumer(TEST_BUFFER_SAMPLE_LE);

    bufferConsumer.skip(16);

    expect(bufferConsumer.readString(4)).toStrictEqual("Test");

    bufferConsumer.seek(16);

    expect(bufferConsumer.readString(4)).toStrictEqual("Test");
    expect(bufferConsumer.buffer).toStrictEqual(TEST_BUFFER_SAMPLE_LE);
  });

  it("sequential reading", () => {
    const bufferConsumer = new BufferConsumer(TEST_BUFFER_SAMPLE_LE);

    bufferConsumer.skip(16);

    expect(bufferConsumer.readNullTerminatedString()).toStrictEqual("Test");
    expect(bufferConsumer.isConsumed()).toBeFalsy();
    expect(bufferConsumer.rest()).toStrictEqual(Buffer.from("TestEnd"));
    expect(bufferConsumer.readNullTerminatedString()).toStrictEqual("TestEnd");
    expect(bufferConsumer.isConsumed()).toBeTruthy();
  });

  it("method readNullTerminatedString()", () => {
    const bufferConsumer = new BufferConsumer(Buffer.from(".\0..\0example"));

    expect(bufferConsumer.readNullTerminatedString()).toStrictEqual(".");
    expect(bufferConsumer.readNullTerminatedString()).toStrictEqual("..");
    expect(bufferConsumer.readNullTerminatedString()).toStrictEqual("example");
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
    const bufferConsumer = new BufferConsumer(TEST_BUFFER_SAMPLE_LE);

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

  it("method consumer()", () => {
    const bufferConsumer = new BufferConsumer(
      Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]),
      undefined,
      ByteOrder.BIG_ENDIAN,
    );

    expect(bufferConsumer.byteOffset).toStrictEqual(0);
    expect(bufferConsumer.readUnsignedInt16()).toStrictEqual(0x01_02);
    expect(bufferConsumer.isConsumed()).toBeFalsy();

    const subConsumerA = bufferConsumer.consumer(2);

    expect(subConsumerA.byteOffset).toStrictEqual(0);
    expect(subConsumerA.readUnsignedInt16()).toStrictEqual(0x03_04);
    expect(subConsumerA.isConsumed()).toBeTruthy();

    expect(bufferConsumer.byteOffset).toStrictEqual(4);
    expect(bufferConsumer.readUnsignedInt16()).toStrictEqual(0x05_06);
    expect(bufferConsumer.isConsumed()).toBeFalsy();

    const subConsumerB = bufferConsumer.consumer();

    expect(subConsumerB.byteOffset).toStrictEqual(0);
    expect(subConsumerB.readUnsignedInt16()).toStrictEqual(0x07_08);
    expect(subConsumerB.isConsumed()).toBeTruthy();

    expect(bufferConsumer.byteOffset).toStrictEqual(8);
    expect(bufferConsumer.isConsumed()).toBeTruthy();
  });
});
