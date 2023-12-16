export const TEST_INT8 = 123;
export const TEST_INT8_BUFFER = Buffer.from([123]);

export const TEST_INT8_NEGATIVE = -123;
export const TEST_INT8_NEGATIVE_BUFFER = Buffer.from([133]);

export const TEST_INT16 = 123;
export const TEST_INT16_BUFFER_LE = Buffer.from([123, 0]);
export const TEST_INT16_BUFFER_BE = Buffer.from([0, 123]);

export const TEST_INT16_NEGATIVE = -123;
export const TEST_INT16_NEGATIVE_BUFFER_LE = Buffer.from([133, 255]);
export const TEST_INT16_NEGATIVE_BUFFER_BE = Buffer.from([255, 133]);

export const TEST_INT32 = 123;
export const TEST_INT32_BUFFER_LE = Buffer.from([123, 0, 0, 0]);
export const TEST_INT32_BUFFER_BE = Buffer.from([0, 0, 0, 123]);

export const TEST_INT32_NEGATIVE = -123;
export const TEST_INT32_NEGATIVE_BUFFER_LE = Buffer.from([133, 255, 255, 255]);
export const TEST_INT32_NEGATIVE_BUFFER_BE = Buffer.from([255, 255, 255, 133]);

export const TEST_FLOAT = 123.456_001_281_738_28;
export const TEST_FLOAT_BUFFER_LE = Buffer.from([121, 233, 246, 66]);
export const TEST_FLOAT_BUFFER_BE = Buffer.from([66, 246, 233, 121]);

export const TEST_BINARY_BUFFER = Buffer.from("ÿ", "binary");
export const TEST_BINARY_BUFFER_LENGTH_LE = Buffer.from(
  "\u0001\0\0\0ÿ",
  "binary",
);
export const TEST_BINARY_BUFFER_LENGTH_BE = Buffer.from(
  "\0\0\0\u0001ÿ",
  "binary",
);
export const TEST_BINARY_BUFFER_MULTIBYTE = Buffer.from("\u0001ÿ", "binary");

export const TEST_STRING_EMPTY = "";
export const TEST_STRING_LENGTH = Buffer.from([0, 0, 0, 0]);
export const TEST_STRING_MULTIBYTE = Buffer.from([0]);

export const TEST_STRING_127_BYTES = Buffer.alloc(127).toString("binary");
export const TEST_STRING_127_BYTES_LENGTH = Buffer.concat([
  Buffer.from([127, 0, 0, 0]),
  Buffer.from(TEST_STRING_127_BYTES),
]);
export const TEST_STRING_127_BYTES_LENGTH_BE = Buffer.concat([
  Buffer.from([0, 0, 0, 127]),
  Buffer.from(TEST_STRING_127_BYTES),
]);
export const TEST_STRING_127_BYTES_MULTIBYTE = Buffer.concat([
  Buffer.from([127]),
  Buffer.from(TEST_STRING_127_BYTES),
]);

export const TEST_STRING_128_BYTES = Buffer.alloc(128).toString("binary");
export const TEST_STRING_128_BYTES_LENGTH = Buffer.concat([
  Buffer.from([128, 0, 0, 0]),
  Buffer.from(TEST_STRING_128_BYTES),
]);
export const TEST_STRING_128_BYTES_LENGTH_BE = Buffer.concat([
  Buffer.from([0, 0, 0, 128]),
  Buffer.from(TEST_STRING_128_BYTES),
]);
export const TEST_STRING_128_BYTES_MULTIBYTE = Buffer.concat([
  Buffer.from([128, 1]),
  Buffer.from(TEST_STRING_128_BYTES),
]);

export const TEST_STRING_256_BYTES = Buffer.alloc(256).toString("binary");
export const TEST_STRING_256_BYTES_LENGTH = Buffer.concat([
  Buffer.from([0, 1, 0, 0]),
  Buffer.from(TEST_STRING_256_BYTES),
]);
export const TEST_STRING_256_BYTES_LENGTH_BE = Buffer.concat([
  Buffer.from([0, 0, 1, 0]),
  Buffer.from(TEST_STRING_256_BYTES),
]);
export const TEST_STRING_256_BYTES_MULTIBYTE = Buffer.concat([
  Buffer.from([128, 2]),
  Buffer.from(TEST_STRING_256_BYTES),
]);

export const TEST_STRING_4000_BYTES = Buffer.alloc(4000).toString("binary");
export const TEST_STRING_4000_BYTES_LENGTH = Buffer.concat([
  Buffer.from([160, 15, 0, 0]),
  Buffer.from(TEST_STRING_4000_BYTES),
]);
export const TEST_STRING_4000_BYTES_LENGTH_BE = Buffer.concat([
  Buffer.from([0, 0, 15, 160]),
  Buffer.from(TEST_STRING_4000_BYTES),
]);
export const TEST_STRING_4000_BYTES_MULTIBYTE = Buffer.concat([
  Buffer.from([160, 31]),
  Buffer.from(TEST_STRING_4000_BYTES),
]);

export const TEST_STRING_100000_BYTES =
  Buffer.alloc(100_000).toString("binary");
export const TEST_STRING_100000_BYTES_LENGTH = Buffer.concat([
  Buffer.from([160, 134, 1, 0]),
  Buffer.from(TEST_STRING_100000_BYTES),
]);
export const TEST_STRING_100000_BYTES_LENGTH_BE = Buffer.concat([
  Buffer.from([0, 1, 134, 160]),
  Buffer.from(TEST_STRING_100000_BYTES),
]);
export const TEST_STRING_100000_BYTES_MULTIBYTE = Buffer.concat([
  Buffer.from([160, 141, 6]),
  Buffer.from(TEST_STRING_100000_BYTES),
]);

export const TEST_BUFFER_SAMPLE_LE = Buffer.concat([
  Buffer.from([1, 2, 3, 4]),
  Buffer.from([1, 255, 255, 255]),
  TEST_FLOAT_BUFFER_LE,
  Buffer.from([4, 0, 0, 0]),
  Buffer.from("Test"),
  Buffer.from([0]),
  Buffer.from("TestEnd"),
]);

export const TEST_BUFFER_SAMPLE_BE = Buffer.concat([
  Buffer.from([4, 3, 2, 1]),
  Buffer.from([255, 255, 255, 1]),
  TEST_FLOAT_BUFFER_BE,
  Buffer.from([0, 0, 0, 4]),
  Buffer.from("Test"),
]);
