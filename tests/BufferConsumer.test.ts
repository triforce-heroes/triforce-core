import { describe, expect, it } from "vitest";

import { BufferConsumer } from "../src/BufferConsumer.js";
import { ByteOrder } from "../src/types/ByteOrder.js";

import {
  TEST_BUFFER_SAMPLE_BE,
  TEST_BUFFER_SAMPLE_LE,
  TEST_FLOAT,
  TEST_INT64,
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

    expect(bufferConsumer.readString(2)).toBe("He");
    expect(bufferConsumer.read(2)).toStrictEqual(Buffer.from("ll"));
    expect(bufferConsumer.read(2)).toStrictEqual(Buffer.from("o"));
    expect(bufferConsumer.read(2)).toStrictEqual(Buffer.from([]));
    expect(bufferConsumer.isConsumed()).toBeTruthy();
    expect(bufferConsumer.read()).toStrictEqual(Buffer.from([]));
    expect(bufferConsumer.isConsumed()).toBeTruthy();
  });

  it("method readInt8()", () => {
    const bufferConsumer = new BufferConsumer(Buffer.from([100, 200]));

    expect(bufferConsumer.readUnsignedInt8()).toBe(100);
    expect(bufferConsumer.readInt8()).toBe(-56);
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

  it("method readInt64() (LE)", () => {
    const bufferConsumer = new BufferConsumer(TEST_INT64);

    expect(bufferConsumer.readInt64()).toBe(506_097_522_914_230_528n);
  });

  it("method readUnsignedInt64() (LE)", () => {
    const bufferConsumer = new BufferConsumer(TEST_INT64);

    expect(bufferConsumer.readUnsignedInt64()).toBe(506_097_522_914_230_528n);
  });

  it("method readInt64() (BE)", () => {
    const bufferConsumer = new BufferConsumer(
      TEST_INT64,
      undefined,
      ByteOrder.BIG_ENDIAN,
    );

    expect(bufferConsumer.readInt64()).toBe(283_686_952_306_183n);
  });

  it("method readUnsignedInt64() (BE)", () => {
    const bufferConsumer = new BufferConsumer(
      TEST_INT64,
      undefined,
      ByteOrder.BIG_ENDIAN,
    );

    expect(bufferConsumer.readUnsignedInt64()).toBe(283_686_952_306_183n);
  });

  it("method readString()", () => {
    const bufferConsumer = new BufferConsumer(TEST_BUFFER_SAMPLE_LE);

    bufferConsumer.skip(16);

    expect(bufferConsumer.readString(4)).toBe("Test");

    bufferConsumer.seek(16);

    expect(bufferConsumer.readString(4)).toBe("Test");
    expect(bufferConsumer.buffer).toStrictEqual(TEST_BUFFER_SAMPLE_LE);
  });

  it("sequential reading", () => {
    const bufferConsumer = new BufferConsumer(TEST_BUFFER_SAMPLE_LE);

    bufferConsumer.skip(16);

    expect(bufferConsumer.readNullTerminatedString()).toBe("Test");
    expect(bufferConsumer.isConsumed()).toBeFalsy();
    expect(bufferConsumer.rest()).toStrictEqual(Buffer.from("TestEnd"));
    expect(bufferConsumer.readNullTerminatedString()).toBe("TestEnd");
    expect(bufferConsumer.isConsumed()).toBeTruthy();
  });

  it("method skipPadding()", () => {
    const bufferConsumer = new BufferConsumer(
      Buffer.from("Hello\0\0\0\0\0\0\0\0\0\0\0World"),
    );

    expect(bufferConsumer.readString(5)).toBe("Hello");
    expect(bufferConsumer.byteOffset).toBe(5);

    bufferConsumer.skipPadding(8);

    expect(bufferConsumer.byteOffset).toBe(8);

    bufferConsumer.skipPadding(8);

    expect(bufferConsumer.byteOffset).toBe(8);

    bufferConsumer.skipPadding(8, true);

    expect(bufferConsumer.byteOffset).toBe(16);
    expect(bufferConsumer.readString(5)).toBe("World");
    expect(bufferConsumer.byteOffset).toBe(21);

    bufferConsumer.skipPadding(8);

    expect(bufferConsumer.byteOffset).toBe(21);
  });

  const readNullTerminatedStringTests = [
    ["", []],
    ["\0", [""]],
    [".\0..\0example", [".", "..", "example"]],
    [".\0..\0example", [".", "..", "example"], "latin1"],
    ["", [], "utf16le"],
    ["\0", [""], "utf16le"],
    ["\0\0", [""], "utf16le"],
    ["\0\0H\0e\0l\0l\0o\0", ["", "Hello"], "utf16le"],
    ["\0\0H\0e\0l\0l\0o\0\0", ["", "Hello"], "utf16le"],
    ["\0\0H\0e\0l\0l\0o\0\0\0", ["", "Hello"], "utf16le"],
    ["H\0e\0l\0l\0o\0", ["Hello"], "utf16le"],
    ["H\0e\0l\0l\0o\0\0\0", ["Hello"], "utf16le"],
    ["H\0e\0l\0l\0o\0\0\0W\0o\0r\0l\0d\0\0\0", ["Hello", "World"], "utf16le"],
  ] as const;

  it.each(readNullTerminatedStringTests)(
    "method readNullTerminatedString(%j)",
    (
      input: string,
      outputs: readonly string[],
      encoding?: "latin1" | "utf8" | "utf16le",
    ) => {
      // eslint-disable-next-line @vitest/prefer-expect-assertions
      expect.assertions(outputs.length);

      const bufferConsumer = new BufferConsumer(Buffer.from(input));
      let outputIndex = 0;

      while (!bufferConsumer.isConsumed()) {
        expect(bufferConsumer.readNullTerminatedString(encoding)).toStrictEqual(
          outputs[outputIndex++],
        );
      }
    },
  );

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
    expect(bufferConsumer.byteOffset).toBe(0);

    expect(bufferConsumer.atConsumable(1)).toBeTruthy();
    expect(bufferConsumer.byteOffset).toBe(1);

    expect(bufferConsumer.at(0)).toBe(2);
    expect(bufferConsumer.at(1)).toBe(3);
    expect(bufferConsumer.at(2)).toBe(4);

    bufferConsumer.back();

    expect(bufferConsumer.at(2)).toBe(3);
  });

  it("method consumer()", () => {
    const bufferConsumer = new BufferConsumer(
      Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]),
      undefined,
      ByteOrder.BIG_ENDIAN,
    );

    expect(bufferConsumer.byteOffset).toBe(0);
    expect(bufferConsumer.readUnsignedInt16()).toBe(0x01_02);
    expect(bufferConsumer.isConsumed()).toBeFalsy();

    const subConsumerA = bufferConsumer.consumer(2);

    expect(subConsumerA.byteOffset).toBe(0);
    expect(subConsumerA.readUnsignedInt16()).toBe(0x03_04);
    expect(subConsumerA.isConsumed()).toBeTruthy();

    expect(bufferConsumer.byteOffset).toBe(4);
    expect(bufferConsumer.readUnsignedInt16()).toBe(0x05_06);
    expect(bufferConsumer.isConsumed()).toBeFalsy();

    const subConsumerB = bufferConsumer.consumer();

    expect(subConsumerB.byteOffset).toBe(0);
    expect(subConsumerB.readUnsignedInt16()).toBe(0x07_08);
    expect(subConsumerB.isConsumed()).toBeTruthy();

    expect(bufferConsumer.byteOffset).toBe(8);
    expect(bufferConsumer.isConsumed()).toBeTruthy();
  });
});
