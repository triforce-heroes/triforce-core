# @triforce-heroes/triforce-core

Triforce Core libraries.

## Installation

Private package, consumed directly from GitHub (not published to npm):

```sh
bun add github:triforce-heroes/triforce-core
```

## Quick start

```ts
import { BufferBuilder } from "@triforce-heroes/triforce-core/BufferBuilder";
import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

const buffer = new BufferBuilder().writeString("Hi").writeInt16(123).build();
const consumer = new BufferConsumer(buffer);

consumer.readString(2); // "Hi"
consumer.readInt16(); // 123
```

# Base functions

Every module below is importable through its subpath (`@triforce-heroes/triforce-core/<Module>`).
All modules except `Buffer`, `Encoding` and `Hash` are also re-exported from the package root.

## Array functions

Creating and splitting arrays.

### chunk

```ts
chunk<T extends unknown[]>(array: T, size: number): T[]
```

Splits `array` into consecutive slices of `size` elements. Use for batch processing tuple-like
arrays; the last slice may be shorter, and an empty array returns no slices.

```ts
import { chunk } from "@triforce-heroes/triforce-core/Array";

chunk(["a", "b", "c"] as [string, string, string], 2); // [["a", "b"], ["c"]]
```

### unique

```ts
unique<T>(...items: T[]): T[]
```

Removes duplicates via `Set`, keeping first-occurrence order. Use to dedupe variadic values; call
with no arguments to get an empty array.

```ts
import { unique } from "@triforce-heroes/triforce-core/Array";

unique("a", "b", "b", "c"); // ["a", "b", "c"]
```

## Buffer functions

Inspecting raw buffers. Subpath-only (not re-exported from the root).

### isAscii

```ts
isAscii(input: Buffer)
```

Returns `true` when every byte of `input` is below `0x80`. Use to detect pure ASCII buffers; empty
buffers return `true`, any byte above `0x7f` returns `false`.

```ts
import { isAscii } from "@triforce-heroes/triforce-core/Buffer";

isAscii(Buffer.from("Hello")); // true
isAscii(Buffer.from("é")); // false
```

## BufferBuilder functions

Appending binary data with deferred writes and selectable endianness.

### BufferBuilder

```ts
new BufferBuilder((byteOrder = ByteOrder.LITTLE_ENDIAN));
```

Creates an ordered byte accumulator in little- or big-endian mode. Use as the single writer for
every binary format in this library; all `write*` methods return `this` for chaining and accept
either a direct value or a callback evaluated lazily at `build()` time.

```ts
import { BufferBuilder } from "@triforce-heroes/triforce-core/BufferBuilder";

new BufferBuilder().writeString("Hi").build(); // <Buffer 48 69>
```

### build

```ts
build(options?: BuildOptions)
```

Concatenates every buffered chunk into one `Buffer`, resolving deferred callbacks first. Use
`{ reverseDeferredCalls: true }` when later offsets depend on earlier ones; on runtimes without
bigint writes the result is transparently upgraded with the internal polyfill.

```ts
new BufferBuilder().writeInt16(123).build(); // <Buffer 7b 00>
```

### length

```ts
get length()
```

Returns the total number of buffered bytes, including deferred placeholders. Use to compute offsets
before calling `build()`.

```ts
const builder = new BufferBuilder().writeString("Hello");

builder.length; // 5
```

### pad

```ts
pad(length: number, kind = "\0", shouldForce = false)
```

Appends `kind` bytes until the length is a multiple of `length`, unless already aligned and
`shouldForce` is falsy. Use to align structures; pass a custom `kind` for non-zero padding.

```ts
new BufferBuilder().writeString("Hi").pad(4).build(); // <Buffer 48 69 00 00>
```

### push

```ts
push(...buffers: Buffer[])
```

Appends raw buffers, tracking the total length. Use to merge pre-built chunks; empty buffers are
accepted and change nothing.

```ts
new BufferBuilder().push(Buffer.from("Hi")).build(); // <Buffer 48 69>
```

### write

```ts
write(count: number, word = "\0")
```

Appends `word` repeated `count` times. Use for fixed runs of bytes; a `count` of `0` writes nothing.

```ts
new BufferBuilder().write(3, "A").build(); // <Buffer 41 41 41>
```

### writeByte

```ts
writeByte(value: Deferrable<number>)
```

Alias for `writeUnsignedInt8`. Use for single raw bytes.

```ts
new BufferBuilder().writeByte(65).build(); // <Buffer 41>
```

### writeFloat

```ts
writeFloat(value: Deferrable<number>)
```

Writes a 4-byte float in the configured endianness. Use for 32-bit floating point fields; for 16-bit
halves use `writeFloat16`.

```ts
new BufferBuilder().writeFloat(1.5).build(); // <Buffer 00 00 c0 3f>
```

### writeFloat16

```ts
writeFloat16(value: Deferrable<number>)
```

Writes a 2-byte half-precision float in the configured endianness. Use for compact float fields;
values are rounded to float16 precision.

```ts
new BufferBuilder().writeFloat16(1.5).build(); // <Buffer 00 3e>
```

### writeFloat64

```ts
writeFloat64(value: Deferrable<number>)
```

Writes an 8-byte double in the configured endianness. Use for full-precision floating point fields.

```ts
new BufferBuilder().writeFloat64(1.5).build(); // <Buffer 00 00 00 00 00 00 f8 3f>
```

### writeInt

```ts
writeInt(value: Deferrable<number>, bytes: 1 | 2 | 4): this;
writeInt(value: Deferrable<bigint>, bytes: 8): this;
```

Writes a signed integer of `bytes` length in the configured endianness. Use for signed integer
fields; 8-byte writes require a `bigint` and route through the bigint polyfill when needed.

```ts
new BufferBuilder().writeInt(-1, 2).build(); // <Buffer ff ff>
```

### writeInt8

```ts
writeInt8(value: Deferrable<number>)
```

Writes a signed byte. Use for `int8` fields; for unsigned bytes use `writeUnsignedInt8`.

```ts
new BufferBuilder().writeInt8(-1).build(); // <Buffer ff>
```

### writeInt16

```ts
writeInt16(value: Deferrable<number>)
```

Writes a signed 16-bit integer in the configured endianness. Use for `int16` fields.

```ts
new BufferBuilder().writeInt16(123).build(); // <Buffer 7b 00>
```

### writeInt32

```ts
writeInt32(value: Deferrable<number>)
```

Writes a signed 32-bit integer in the configured endianness. Use for `int32` fields.

```ts
new BufferBuilder().writeInt32(123).build(); // <Buffer 7b 00 00 00>
```

### writeInt64

```ts
writeInt64(value: Deferrable<bigint>)
```

Writes a signed 64-bit integer in the configured endianness. Use for `int64` fields; the value must
be a `bigint`.

```ts
new BufferBuilder().writeInt64(123n).build(); // <Buffer 7b 00 00 00 00 00 00 00>
```

### writeLengthPrefixedString

```ts
writeLengthPrefixedString(
  value: Buffer | string | null | undefined,
  bytes?: 1 | 2 | 4,
  encoding?: TextEncoding,
)
```

Writes the byte length as an unsigned integer of `bytes` length (default 4), followed by the content
encoded as `encoding` (default `"utf-8"`). Use for length-prefixed fields; `null`, `undefined` and
empty values write a zero length with no content. The length counts encoded bytes, not characters.

```ts
new BufferBuilder().writeLengthPrefixedString("Hi").build(); // <Buffer 02 00 00 00 48 69>
```

### writeLengthSerializedString

```ts
writeLengthSerializedString(value: string | null | undefined)
```

Writes a string with a signed 32-bit character count plus a null terminator: positive counts encode
ASCII bodies, negative counts encode UTF-16LE bodies. Use for length-serialized text; `null`,
`undefined` and empty values write a zero count.

```ts
new BufferBuilder().writeLengthSerializedString("A").build(); // <Buffer 02 00 00 00 41 00>
```

### writeMultibytePrefixedString

```ts
writeMultibytePrefixedString(value: Buffer | string | null | undefined, encoding?: TextEncoding)
```

Writes the byte length as a 7-bit variable-length integer, followed by the content encoded as
`encoding` (default `"utf-8"`). Use for compact length prefixes; `null`, `undefined` and empty
values write a single zero byte.

```ts
new BufferBuilder().writeMultibytePrefixedString("Hi").build(); // <Buffer 02 48 69>
```

### writeNullTerminatedString

```ts
writeNullTerminatedString(value: Buffer | string | null | undefined, encoding?: TextEncoding)
```

Appends the content encoded as `encoding` (default `"utf-8"`) followed by its null terminator (1
byte, 2 bytes for `"utf16-le"`). Use for C-style strings; `null` and `undefined` write only the
terminator.

```ts
new BufferBuilder().writeNullTerminatedString("Hi").build(); // <Buffer 48 69 00>
```

### writeOffset

```ts
writeOffset(
  pBuffer: Buffer | BufferBuilder,
  pad?: number,
  offsetBytes?: 1 | 2 | 4,
  offsetWhenEmpty?: number,
  pBufferBuildOptions?: BuildOptions,
): this;
writeOffset(
  pBuffer: Buffer | BufferBuilder,
  pad: number | undefined,
  offsetBytes: 8,
  offsetWhenEmpty?: bigint,
  pBufferBuildOptions?: BuildOptions,
): this;
```

Reserves an offset field pointing at `pBuffer`, then appends and optionally pads `pBuffer` after the
current content. Use for pointer tables; empty buffers write `offsetWhenEmpty` instead, and 8-byte
offsets require a `bigint` fallback.

```ts
const builder = new BufferBuilder();

builder.writeUnsignedInt32(() => builder.length);
builder.writeOffset(Buffer.from([1, 2]));
builder.build({ reverseDeferredCalls: true }); // <Buffer 0a 00 00 00 08 00 00 00 01 02>
```

### writeString

```ts
writeString(value: Buffer | string | null | undefined, encoding?: TextEncoding)
```

Appends the raw bytes with no prefix or terminator, encoding strings as `encoding` (default
`"utf-8"`). Use for inline content; `null`, `undefined` and empty values write nothing. `Buffer`
inputs pass through untouched.

```ts
new BufferBuilder().writeString("Hi").build(); // <Buffer 48 69>
```

### writeUnsignedInt

```ts
writeUnsignedInt(value: Deferrable<number>, bytes: 1 | 2 | 4): this;
writeUnsignedInt(value: Deferrable<bigint>, bytes: 8): this;
```

Writes an unsigned integer of `bytes` length in the configured endianness. Use for unsigned integer
fields; 8-byte writes require a `bigint`.

```ts
new BufferBuilder().writeUnsignedInt(255, 2).build(); // <Buffer ff 00>
```

### writeUnsignedInt8

```ts
writeUnsignedInt8(value: Deferrable<number>)
```

Writes an unsigned byte. Use for `uint8` fields.

```ts
new BufferBuilder().writeUnsignedInt8(255).build(); // <Buffer ff>
```

### writeUnsignedInt16

```ts
writeUnsignedInt16(value: Deferrable<number>)
```

Writes an unsigned 16-bit integer in the configured endianness. Use for `uint16` fields.

```ts
new BufferBuilder().writeUnsignedInt16(255).build(); // <Buffer ff 00>
```

### writeUnsignedInt32

```ts
writeUnsignedInt32(value: Deferrable<number>)
```

Writes an unsigned 32-bit integer in the configured endianness. Use for `uint32` fields.

```ts
new BufferBuilder().writeUnsignedInt32(255).build(); // <Buffer ff 00 00 00>
```

### writeUnsignedInt64

```ts
writeUnsignedInt64(value: Deferrable<bigint>)
```

Writes an unsigned 64-bit integer in the configured endianness. Use for `uint64` fields; the value
must be a `bigint`.

```ts
new BufferBuilder().writeUnsignedInt64(255n).build(); // <Buffer ff 00 00 00 00 00 00 00>
```

## BufferConsumer functions

Reading binary data sequentially with a cursor and selectable endianness.

### BufferConsumer

```ts
new BufferConsumer(pBuffer: Buffer, pByteOffset = 0, pByteOrder = ByteOrder.LITTLE_ENDIAN)
```

Wraps `pBuffer` with a readable cursor starting at `pByteOffset`. Use as the single reader for every
binary format in this library; reads advance the cursor and never copy more than needed.

```ts
import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

new BufferConsumer(Buffer.from("Hi")).readString(2); // "Hi"
```

### assert

```ts
assert<T>(value: T, toBe: T, throwMessage: string)
```

Throws an `Error` with `throwMessage` unless `value` strictly equals `toBe`. Use to validate magic
numbers while parsing; matching values pass silently.

```ts
BufferConsumer.assert("Test", "Test", "Expected Test"); // undefined
```

### at

```ts
at(byteOffset = 0): number
```

Peeks the byte at the cursor plus `byteOffset` without moving. Use for lookahead; the cursor is
unchanged.

```ts
new BufferConsumer(Buffer.from([1, 2])).at(1); // 2
```

### atConsumable

```ts
atConsumable(value: number): boolean
```

Consumes one byte when it equals `value`, returning `true`; otherwise returns `false` without
moving. Use to match optional markers in a stream.

```ts
new BufferConsumer(Buffer.from([1])).atConsumable(1); // true
```

### back

```ts
back((bytes = 1));
```

Moves the cursor backwards by `bytes`. Use to re-read data; the cursor is returned for chaining.

```ts
const consumer = new BufferConsumer(Buffer.from("Hi"));

consumer.skip(2).back(1).readString(1); // "i"
```

### buffer

```ts
get buffer()
```

Returns the wrapped buffer. Use to access the original bytes without copying.

```ts
const buffer = Buffer.from("Hi");

new BufferConsumer(buffer).buffer === buffer; // true
```

### byteOffset

```ts
get byteOffset()
```

Returns the current cursor position. Use to compute relative offsets while parsing.

```ts
new BufferConsumer(Buffer.from("Hi")).skip(1).byteOffset; // 1
```

### consumer

```ts
consumer(bytes?: number): BufferConsumer
```

Returns a sub-consumer over the next `bytes` (or the rest) preserving the byte order, and advances
past them. Use to parse nested structures; the parent cursor moves forward.

```ts
new BufferConsumer(Buffer.from([1, 2])).consumer(1).readByte(); // 1
```

### isConsumed

```ts
isConsumed();
```

Returns `true` when the cursor reached the end of the buffer. Use to terminate parse loops; reads
past the end clamp instead of throwing.

```ts
new BufferConsumer(Buffer.from([1])).skip(1).isConsumed(); // true
```

### read

```ts
read(bytes?: number): Buffer
```

Returns the next `bytes` (or the rest) as a view and advances past them. Use for raw slices;
requesting more than available clamps to the end.

```ts
new BufferConsumer(Buffer.from("Hello")).read(2); // <Buffer 48 65>
```

### readByte

```ts
readByte(): number
```

Alias for `readUnsignedInt8`. Use for single raw bytes.

```ts
new BufferConsumer(Buffer.from([65])).readByte(); // 65
```

### readFloat

```ts
readFloat(): number
```

Reads a 4-byte float in the configured endianness. Use for 32-bit floating point fields.

```ts
new BufferConsumer(Buffer.from([0x00, 0x00, 0xc0, 0x3f])).readFloat(); // 1.5
```

### readFloat16

```ts
readFloat16(): number
```

Reads a 2-byte half-precision float in the configured endianness. Use for compact float fields.

```ts
new BufferConsumer(Buffer.from([0x00, 0x3e])).readFloat16(); // 1.5
```

### readFloat64

```ts
readFloat64(): number
```

Reads an 8-byte double in the configured endianness. Use for full-precision floating point fields.

```ts
new BufferConsumer(Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf8, 0x3f])).readFloat64(); // 1.5
```

### readInt8

```ts
readInt8(): number
```

Reads a signed byte. Use for `int8` fields.

```ts
new BufferConsumer(Buffer.from([0xff])).readInt8(); // -1
```

### readInt16

```ts
readInt16(): number
```

Reads a signed 16-bit integer in the configured endianness. Use for `int16` fields.

```ts
new BufferConsumer(Buffer.from([0x7b, 0x00])).readInt16(); // 123
```

### readInt32

```ts
readInt32(): number
```

Reads a signed 32-bit integer in the configured endianness. Use for `int32` fields.

```ts
new BufferConsumer(Buffer.from([0x7b, 0x00, 0x00, 0x00])).readInt32(); // 123
```

### readInt64

```ts
readInt64(): bigint
```

Reads a signed 64-bit integer in the configured endianness. Use for `int64` fields; the result is
always a `bigint`.

```ts
new BufferConsumer(Buffer.from([0x7b, 0, 0, 0, 0, 0, 0, 0])).readInt64(); // 123n
```

### readLengthPrefixedString

```ts
readLengthPrefixedString(bytes?: 1 | 2 | 4, encoding?: TextEncoding): string
```

Reads an unsigned length of `bytes` length (default 4) in the configured endianness, then that many
bytes decoded as `encoding` (default `"utf-8"`). Use for length-prefixed fields; zero lengths return
an empty string.

```ts
new BufferConsumer(Buffer.from([0x02, 0, 0, 0, 0x48, 0x69])).readLengthPrefixedString(); // "Hi"
```

### readLengthSerializedString

```ts
readLengthSerializedString(): string
```

Reads a signed 32-bit character count plus terminator: positive counts decode ASCII bodies, negative
counts decode UTF-16LE bodies. Use for length-serialized text; zero counts return an empty string.

```ts
new BufferConsumer(Buffer.from([2, 0, 0, 0, 65, 0])).readLengthSerializedString(); // "A"
```

### readMultibytePrefixedString

```ts
readMultibytePrefixedString(encoding?: TextEncoding): string
```

Reads a 7-bit variable-length byte count, then that many bytes decoded as `encoding` (default
`"utf-8"`). Use for compact length prefixes.

```ts
new BufferConsumer(Buffer.from([2, 0x48, 0x69])).readMultibytePrefixedString(); // "Hi"
```

### readNullTerminatedString

```ts
readNullTerminatedString(encoding?: TextEncoding): string
```

Reads up to the next null terminator for `encoding` (default `"utf-8"`, 1 byte except 2 bytes for
`"utf16-le"`) and advances past it. Use for C-style strings; buffers without a terminator return the
rest.

```ts
new BufferConsumer(Buffer.from("Hi\0")).readNullTerminatedString(); // "Hi"
```

### readString

```ts
readString(bytes: number, encoding?: TextEncoding): string
```

Reads `bytes` decoded as `encoding` (default `"utf-8"`). Use for fixed-length fields; the byte count
(not the character count) advances the cursor.

```ts
new BufferConsumer(Buffer.from("Hi")).readString(2); // "Hi"
```

### readUnsignedInt8

```ts
readUnsignedInt8(): number
```

Reads an unsigned byte. Use for `uint8` fields.

```ts
new BufferConsumer(Buffer.from([0xff])).readUnsignedInt8(); // 255
```

### readUnsignedInt16

```ts
readUnsignedInt16(): number
```

Reads an unsigned 16-bit integer in the configured endianness. Use for `uint16` fields.

```ts
new BufferConsumer(Buffer.from([0xff, 0x00])).readUnsignedInt16(); // 255
```

### readUnsignedInt32

```ts
readUnsignedInt32(): number
```

Reads an unsigned 32-bit integer in the configured endianness. Use for `uint32` fields.

```ts
new BufferConsumer(Buffer.from([0xff, 0, 0, 0])).readUnsignedInt32(); // 255
```

### readUnsignedInt64

```ts
readUnsignedInt64(): bigint
```

Reads an unsigned 64-bit integer in the configured endianness. Use for `uint64` fields; the result
is always a `bigint`.

```ts
new BufferConsumer(Buffer.from([0xff, 0, 0, 0, 0, 0, 0, 0])).readUnsignedInt64(); // 255n
```

### rest

```ts
rest(): Buffer
```

Returns the unread remainder as a view without moving the cursor. Use for peeking at what is left.

```ts
new BufferConsumer(Buffer.from("Hi")).rest(); // <Buffer 48 69>
```

### seek

```ts
seek((byteOffset = 0));
```

Jumps the cursor to `byteOffset`. Use for random access; the consumer is returned for chaining.

```ts
new BufferConsumer(Buffer.from("Hi")).seek(1).readString(1); // "i"
```

### skip

```ts
skip((bytes = 1));
```

Advances the cursor by `bytes`. Use to ignore padding or known headers; the consumer is returned for
chaining.

```ts
new BufferConsumer(Buffer.from("Hi")).skip(1).readString(1); // "i"
```

### skipPadding

```ts
skipPadding(padding: number, shouldForce = false)
```

Advances to the next multiple of `padding`, unless already aligned. Use to skip alignment filler;
`shouldForce` advances a full block even when already aligned.

```ts
new BufferConsumer(Buffer.from("Hello\0\0\0")).skip(5).skipPadding(8).byteOffset; // 8
```

## Cache functions

Bounded in-memory key/value storage with insertion-order eviction.

### Cache

```ts
new Cache<T>(capacity: number)
```

Creates a cache holding at most `capacity` entries, evicting the oldest first. Use for memoizing
expensive lookups; a capacity of `0` stores nothing.

```ts
import { Cache } from "@triforce-heroes/triforce-core/Cache";

const cache = new Cache<number>(2);

cache.set("a", 1); // 1
```

### capacity

```ts
get capacity()
```

Returns the maximum number of entries. Use to inspect the configured bound.

```ts
new Cache(2).capacity; // 2
```

### entries

```ts
entries();
```

Returns a copy of the stored entries as a `Map`. Use to snapshot the cache; mutating the result does
not affect the cache.

```ts
const cache = new Cache<number>(2);

cache.set("a", 1);
cache.entries(); // Map(1) { "a" => 1 }
```

### flush

```ts
flush();
```

Removes every entry. Use to reset the cache without changing its capacity.

```ts
const cache = new Cache<number>(2);

cache.set("a", 1);
cache.flush();
cache.stored; // 0
```

### forget

```ts
forget(key: string)
```

Removes `key` when present. Use to invalidate single entries; unknown keys are ignored.

```ts
const cache = new Cache<number>(2);

cache.set("a", 1);
cache.forget("a");
cache.has("a"); // false
```

### get

```ts
get(key: string)
```

Returns the stored value or `undefined` for unknown keys. Use after `has` checks or when `undefined`
is an acceptable miss signal.

```ts
const cache = new Cache<number>(2);

cache.set("a", 1);
cache.get("a"); // 1
```

### has

```ts
has(key: string)
```

Returns `true` when `key` is stored. Use to probe the cache without inserting.

```ts
const cache = new Cache<number>(2);

cache.set("a", 1);
cache.has("a"); // true
```

### keys

```ts
keys();
```

Returns a copy of the stored keys as a `Set`. Use to inspect occupancy; mutating the result does not
affect the cache.

```ts
const cache = new Cache<number>(2);

cache.set("a", 1);
cache.keys(); // Set(1) { "a" }
```

### remember

```ts
remember(key: string, callback: () => T)
```

Returns the stored value, or computes it with `callback`, stores it and returns it. Use for
memoization; the callback runs at most once per key.

```ts
new Cache<number>(2).remember("a", () => 1); // 1
```

### set

```ts
set(key: string, value: T): T
```

Stores `value` under `key`, evicting the oldest entry past capacity, and returns `value`. Use for
explicit inserts; re-setting an existing key updates it without evicting.

```ts
const cache = new Cache<number>(1);

cache.set("a", 1);
cache.set("b", 2);
cache.get("a"); // undefined
```

### setCapacity

```ts
setCapacity(capacity: number)
```

Changes the bound, evicting the oldest entries when over capacity. Use to resize at runtime;
shrinking below the stored count drops the oldest entries first.

```ts
const cache = new Cache<number>(4);

cache.set("a", 1);
cache.setCapacity(1);
cache.keys(); // Set(1) { "a" }
```

### stored

```ts
get stored()
```

Returns the number of stored entries. Use to monitor occupancy against `capacity`.

```ts
const cache = new Cache<number>(2);

cache.set("a", 1);
cache.stored; // 1
```

### values

```ts
values();
```

Returns the stored values in insertion order. Use to iterate results; the array is a copy.

```ts
const cache = new Cache<number>(2);

cache.set("a", 1);
cache.values(); // [1]
```

## Console functions

Fatal error reporting to stderr.

### fatal

```ts
fatal(
  ...arguments_:
    | [message: string, details?: unknown]
    | [message: string, expected: unknown, received: unknown, details?: Record<string, unknown>]
): never
```

Prints a highlighted error with optional details, expected/received values and their diff, then
exits the process with `-1`. Use for unrecoverable CLI failures; the diff section only appears when
both `expected` and `received` are provided.

```ts
import { fatal } from "@triforce-heroes/triforce-core/Console";

fatal("boom", { code: 1 }); // writes to stderr and exits with -1
```

## ConsoleHexadecimal functions

Hex-dump printing to stdout.

### printHexadecimal

```ts
printHexadecimal(buffer: Buffer, preset = PrintHexadecimalPreset.SIMPLIFIED)
```

Prints `buffer` as offset-annotated hexadecimal rows with printable characters. Use for debugging
binary payloads; presets add decoded numeric columns, and empty buffers print nothing.

```ts
import { printHexadecimal } from "@triforce-heroes/triforce-core/ConsoleHexadecimal";

printHexadecimal(Buffer.from([0])); // writes "00000000  00  ..." to stdout
```

## Debugger functions

Development helpers for CLI programs and benchmarks.

### debugBenchmark

```ts
debugBenchmark<T>(
  callback: () => T,
  printerIn?: ({ average, minimum, result }: DebugBenchmarkData<T>) => void,
  samplesIn = 1000,
  loopsIn = Infinity,
  maxVariance = 0.01,
)
```

Runs `callback` in a timing loop, printing rolling average/minimum timings with each result. Use to
profile hot functions; pass a custom `printerIn` to capture measurements instead of logging them.

```ts
import { debugBenchmark } from "@triforce-heroes/triforce-core/Debugger";

debugBenchmark(() => 1 + 1, undefined, 10, 2); // logs timings twice, returns undefined
```

### debugCommander

```ts
debugCommander(program: Command, argv: string[])
```

Parses `argv` with a `commander` program in-process, swallowing help output and exit calls. Use to
exercise CLI commands in tests; pass only the arguments after the program name.

```ts
import { Command } from "commander";
import { debugCommander } from "@triforce-heroes/triforce-core/Debugger";

const program = new Command()
  .command("test")
  .argument("<input>")
  .action((input) => {
    console.log(input);
  });

debugCommander(program, ["test", "123"]); // logs "123"
```

## Encoding functions

Lossless conversion between binary buffers and strings. Subpath-only (not re-exported from the
root).

### decodeBuffer

```ts
decodeBuffer(buffer: Buffer | Uint8Array, encoding?: TextEncoding)
```

Decodes `buffer` as `encoding` (default `"utf-8"`). Use to read text in any supported encoding;
native encodings use `Buffer` directly while extra encodings use `iconv-lite`.

```ts
import { decodeBuffer } from "@triforce-heroes/triforce-core/Encoding";

decodeBuffer(Buffer.from([0x82, 0xb1]), "shift-jis"); // "こ"
```

### encodeFromString

```ts
encodeFromString(string: string)
```

Encodes a string produced by `encodeToString` back into its buffer. Use to round-trip binary data
through strings; plain ASCII round-trips byte-for-byte.

```ts
import { encodeFromString } from "@triforce-heroes/triforce-core/Encoding";

encodeFromString("hello"); // <Buffer 68 65 6c 6c 6f>
```

### encodeString

```ts
encodeString(value: string, encoding?: TextEncoding)
```

Encodes `value` as `encoding` (default `"utf-8"`). Use to write text in any supported encoding;
native encodings use `Buffer` directly while extra encodings use `iconv-lite`.

```ts
import { encodeString } from "@triforce-heroes/triforce-core/Encoding";

encodeString("こ", "shift-jis"); // <Buffer 82 b1>
```

### encodeToString

```ts
encodeToString(buffer: Buffer)
```

Decodes any buffer into a string, mapping non-UTF-8 bytes into a private range so the conversion is
fully reversible with `encodeFromString`. Use to embed arbitrary bytes in strings; valid UTF-8
decodes normally.

```ts
import { encodeToString } from "@triforce-heroes/triforce-core/Encoding";

encodeToString(Buffer.from("hello")); // "hello"
```

### ExtraEncoding

```ts
type ExtraEncoding = "shift-jis" | "big5" | "gbk" | "euc-kr" | "cp1252";
```

Extra encodings decoded via `iconv-lite`. Use for Shift-JIS, Big5, GBK, EUC-KR and Windows-1252
text; combine with `NativeEncoding` as `TextEncoding`.

```ts
import type { ExtraEncoding } from "@triforce-heroes/triforce-core/Encoding";

const encoding: ExtraEncoding = "shift-jis"; // "shift-jis"
```

### getNullTerminator

```ts
getNullTerminator(encoding?: TextEncoding)
```

Returns the encoded null terminator for `encoding` (default `"utf-8"`). Use to write or compare
terminators; it is 1 byte except 2 bytes for `"utf16-le"`.

```ts
import { getNullTerminator } from "@triforce-heroes/triforce-core/Encoding";

getNullTerminator("utf16-le"); // <Buffer 00 00>
```

### getNullTerminatorByteLength

```ts
getNullTerminatorByteLength(encoding?: TextEncoding)
```

Returns the byte length of the encoded null terminator for `encoding` (default `"utf-8"`). Use to
advance past terminators; it is 1 except 2 for `"utf16-le"`.

```ts
import { getNullTerminatorByteLength } from "@triforce-heroes/triforce-core/Encoding";

getNullTerminatorByteLength("shift-jis"); // 1
```

### NativeEncoding

```ts
type NativeEncoding = "latin1" | "utf-8" | "utf16-le";
```

Encodings handled directly by `Buffer`. Use for Western text and UTF-16LE; `"utf16-le"` is
normalized to `"utf16le"` for `Buffer` calls.

```ts
import type { NativeEncoding } from "@triforce-heroes/triforce-core/Encoding";

const encoding: NativeEncoding = "utf-8"; // "utf-8"
```

### TextEncoding

```ts
type TextEncoding = NativeEncoding | ExtraEncoding;
```

Any supported text encoding. Use for the `encoding` parameter of buffer string methods; native
members use `Buffer` directly while extra members use `iconv-lite`.

```ts
import type { TextEncoding } from "@triforce-heroes/triforce-core/Encoding";

const encoding: TextEncoding = "big5"; // "big5"
```

## Hash functions

Hashing buffers. Subpath-only (not re-exported from the root).

### secureHash

```ts
secureHash(input: Buffer<ArrayBuffer>)
```

Hashes `input` with SHA-256 and folds the digest into a 48-bit number. Use for compact content
addressing; identical buffers always produce the same number.

```ts
import { secureHash } from "@triforce-heroes/triforce-core/Hash";

await secureHash(Buffer.from("test")); // 142732611767432
```

## Number functions

Integer arithmetic helpers.

### nextMultiple

```ts
nextMultiple(value: number, width: number, shouldAdvance = false): number
```

Returns the smallest multiple of `width` greater than or equal to `value`. Use for alignment math;
pass `shouldAdvance` to step forward even when already aligned.

```ts
import { nextMultiple } from "@triforce-heroes/triforce-core/Number";

nextMultiple(5, 4); // 8
nextMultiple(4, 4); // 4
nextMultiple(4, 4, true); // 8
```

## Path functions

File path normalization.

### normalize

```ts
normalize(path: string): string
```

Normalizes separators and segments, always returning forward slashes. Use for cross-platform path
comparisons; backslashes become `/` even on Windows.

```ts
import { normalize } from "@triforce-heroes/triforce-core/Path";

normalize("./../src/./Array.ts"); // "../src/Array.ts"
```

## Types functions

Shared enumerations for buffer I/O.

### ByteOrder

```ts
enum ByteOrder {
  LITTLE_ENDIAN = 0,
  BIG_ENDIAN = 1,
}
```

Selects the endianness of `BufferBuilder` and `BufferConsumer`. Use `LITTLE_ENDIAN` (the default)
unless a format specifies big-endian order.

```ts
import { ByteOrder } from "@triforce-heroes/triforce-core/types/ByteOrder";

ByteOrder.BIG_ENDIAN; // 1
```

### PrintHexadecimalPreset

```ts
enum PrintHexadecimalPreset {
  SIMPLIFIED = 0,
  UINT8 = 1,
  UINT16_LE = 2,
  UINT16_BE = 3,
  UINT32_LE = 4,
  UINT32_BE = 5,
  INT8 = 6,
  INT16_LE = 7,
  INT16_BE = 8,
  INT32_LE = 9,
  INT32_BE = 10,
  FLOAT_LE = 11,
  FLOAT_BE = 12,
}
```

Selects the decoded numeric columns of `printHexadecimal`. Use `SIMPLIFIED` (the default) for plain
hex dumps, or a typed preset to also inspect decoded values.

```ts
import { printHexadecimal } from "@triforce-heroes/triforce-core/ConsoleHexadecimal";
import { PrintHexadecimalPreset } from "@triforce-heroes/triforce-core/types/PrintHexadecimalPreset";

printHexadecimal(Buffer.from([0]), PrintHexadecimalPreset.UINT8); // writes hex + UINT8 column
```
