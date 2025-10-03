import { ByteOrder } from "@/types/ByteOrder.js";

import { BufferPolyfill } from "@/polyfills/BufferPolyfill";

type Deferrable<T> = T | (() => T);

type DeferredSimpleMethod = "writeInt8" | "writeUInt8";

type DeferrableMethodLE =
  | "writeBigInt64LE"
  | "writeBigUInt64LE"
  | "writeFloatLE"
  | "writeInt16LE"
  | "writeInt32LE"
  | "writeIntLE"
  | "writeUInt16LE"
  | "writeUInt32LE"
  | "writeUIntLE";

type DeferrableMethodBE =
  | "writeBigInt64BE"
  | "writeBigUInt64BE"
  | "writeFloatBE"
  | "writeInt16BE"
  | "writeInt32BE"
  | "writeIntBE"
  | "writeUInt16BE"
  | "writeUInt32BE"
  | "writeUIntBE";

type DeferrableMethod =
  | DeferrableMethodBE
  | DeferrableMethodLE
  | DeferredSimpleMethod;

type DeferredCallback = (buffer: Buffer) => void;

interface BuildOptions {
  reverseDeferredCalls?: boolean;
}

export class BufferBuilder {
  private readonly inBuffers: Buffer[] = [];

  private readonly deferredCalls: DeferredCallback[] = [];

  private readonly littleEndian;

  private inLength = 0;

  public constructor(byteOrder = ByteOrder.LITTLE_ENDIAN) {
    this.littleEndian = byteOrder === ByteOrder.LITTLE_ENDIAN;
  }

  public get length() {
    return this.inLength;
  }

  public build(options?: BuildOptions) {
    const buffer = Buffer.concat(this.inBuffers);

    if (this.deferredCalls.length) {
      const buffersLength = this.inBuffers.length;

      const deferredCalls =
        options?.reverseDeferredCalls === true
          ? this.deferredCalls.reverse()
          : this.deferredCalls;

      for (const deferredCall of deferredCalls) {
        deferredCall(buffer);
      }

      if (buffersLength !== this.inBuffers.length) {
        return Buffer.concat([buffer, ...this.inBuffers.slice(buffersLength)]);
      }
    }

    return buffer;
  }

  public pad(length: number, kind = "\0", forced = false) {
    if (!forced && this.inLength % length === 0) {
      return this;
    }

    const buffer = Buffer.alloc(
      length - (this.inLength % length),
      kind,
      "binary",
    );

    this.inBuffers.push(buffer);
    this.inLength += buffer.length;

    return this;
  }

  public write(count: number, word = "\0") {
    if (count !== 0) {
      const buffer = Buffer.from(word.repeat(count));

      this.inBuffers.push(buffer);
      this.inLength += buffer.length;
    }

    return this;
  }

  public writeOffset(
    pBuffer: Buffer | BufferBuilder,
    pad?: number,
    offsetBytes?: 1 | 2 | 4,
    offsetWhenEmpty?: number,
    pBufferBuildOptions?: BuildOptions,
  ): this;

  public writeOffset(
    pBuffer: Buffer | BufferBuilder,
    pad: number | undefined,
    offsetBytes: 8,
    offsetWhenEmpty?: bigint,
    pBufferBuildOptions?: BuildOptions,
  ): this;

  public writeOffset(
    pBuffer: Buffer | BufferBuilder,
    pad = 1,
    offsetBytes: 1 | 2 | 4 | 8 = 4,
    offsetWhenEmpty?: bigint | number,
    pBufferBuildOptions?: BuildOptions,
  ) {
    return this.writeUnsignedInt(
      (() => {
        if (pBuffer.length === 0) {
          return offsetBytes === 8
            ? offsetWhenEmpty ?? 0n
            : offsetWhenEmpty ?? 0;
        }

        const offset = this.inLength;
        const buffer =
          pBuffer instanceof BufferBuilder
            ? pBuffer.build(pBufferBuildOptions)
            : pBuffer;

        this.push(buffer).pad(pad);

        return offsetBytes === 8 ? BigInt(offset) : offset;
      }) as Deferrable<number>,
      offsetBytes as 4,
    );
  }

  public writeByte(value: Deferrable<number>) {
    return this.writeUnsignedInt8(value);
  }

  public writeInt(value: Deferrable<number>, bytes: 1 | 2 | 4): this;
  public writeInt(value: Deferrable<bigint>, bytes: 8): this;

  public writeInt(
    value: Deferrable<bigint | number>,
    bytes: 1 | 2 | 4 | 8 = 4,
  ) {
    return bytes === 8
      ? this.writeInt64(value as Deferrable<bigint>)
      : this.writeDeferrableInt(
          Buffer,
          bytes,
          "writeIntLE",
          "writeIntBE",
          value,
        );
  }

  public writeUnsignedInt(value: Deferrable<number>, bytes: 1 | 2 | 4): this;
  public writeUnsignedInt(value: Deferrable<bigint>, bytes: 8): this;

  public writeUnsignedInt(
    value: Deferrable<bigint | number>,
    bytes: 1 | 2 | 4 | 8 = 4,
  ) {
    return bytes === 8
      ? this.writeUnsignedInt64(value as Deferrable<bigint>)
      : this.writeDeferrableInt(
          Buffer,
          bytes,
          "writeUIntLE",
          "writeUIntBE",
          value,
        );
  }

  public writeInt8(value: Deferrable<number>) {
    return this.writeDeferrableInt(Buffer, 1, "writeInt8", undefined, value);
  }

  public writeUnsignedInt8(value: Deferrable<number>) {
    return this.writeDeferrableInt(Buffer, 1, "writeUInt8", undefined, value);
  }

  public writeInt16(value: Deferrable<number>) {
    return this.writeDeferrableInt(
      Buffer,
      2,
      "writeInt16LE",
      "writeInt16BE",
      value,
    );
  }

  public writeUnsignedInt16(value: Deferrable<number>) {
    return this.writeDeferrableInt(
      Buffer,
      2,
      "writeUInt16LE",
      "writeUInt16BE",
      value,
    );
  }

  public writeInt32(value: Deferrable<number>) {
    return this.writeDeferrableInt(
      Buffer,
      4,
      "writeInt32LE",
      "writeInt32BE",
      value,
    );
  }

  public writeUnsignedInt32(value: Deferrable<number>) {
    return this.writeDeferrableInt(
      Buffer,
      4,
      "writeUInt32LE",
      "writeUInt32BE",
      value,
    );
  }

  public writeInt64(value: Deferrable<bigint>) {
    return this.writeDeferrableInt(
      BufferPolyfill,
      8,
      "writeBigInt64LE",
      "writeBigInt64BE",
      value,
      0n,
    );
  }

  public writeUnsignedInt64(value: Deferrable<bigint>) {
    return this.writeDeferrableInt(
      BufferPolyfill,
      8,
      "writeBigUInt64LE",
      "writeBigUInt64BE",
      value,
      0n,
    );
  }

  public writeFloat(value: Deferrable<number>) {
    return this.writeDeferrableInt(
      Buffer,
      4,
      "writeFloatLE",
      "writeFloatBE",
      value,
    );
  }

  public writeString(value: Buffer | string | null | undefined) {
    if (value !== null && value !== undefined && value.length > 0) {
      const buffer = Buffer.from(value as Buffer);

      this.inBuffers.push(buffer);
      this.inLength += buffer.length;
    }

    return this;
  }

  public writeLengthPrefixedString(
    value: Buffer | string | null | undefined,
    bytes: 1 | 2 | 4 = 4,
  ) {
    if (value === null || value === undefined || value.length === 0) {
      this.writeUnsignedInt(0, bytes);

      return this;
    }

    const buffer = Buffer.from(value as Buffer);

    this.writeUnsignedInt(buffer.length, bytes);

    this.inBuffers.push(buffer);
    this.inLength += buffer.length;

    return this;
  }

  public writeMultibytePrefixedString(
    value: Buffer | string | null | undefined,
  ) {
    if (value === null || value === undefined || value.length === 0) {
      this.writeByte(0);

      return this;
    }

    const buffer = Buffer.from(value as Buffer);
    let { length } = buffer;

    this.inLength += length;

    while (length > 0) {
      // eslint-disable-next-line no-bitwise
      let chunkLength = length & 0x7f;

      if (length > 0x7f) {
        // eslint-disable-next-line no-bitwise
        chunkLength |= 0x80;
      }

      this.writeByte(chunkLength);

      // eslint-disable-next-line no-bitwise
      length >>= 7;
    }

    this.inBuffers.push(buffer);

    return this;
  }

  public writeNullTerminatedString(value: Buffer | string | null | undefined) {
    if (value === null || value === undefined) {
      this.writeByte(0);

      return this;
    }

    const buffer = Buffer.from(value as Buffer);

    this.inBuffers.push(buffer);
    this.inLength += buffer.length;

    this.writeByte(0);

    return this;
  }

  public push(...buffers: Buffer[]) {
    this.inBuffers.push(...buffers);
    this.inLength += buffers.reduce(
      (bufferA, bufferB) => bufferA + bufferB.length,
      0,
    );

    return this;
  }

  private writeDeferrableInt<T extends bigint | number>(
    BufferConstructor: BufferConstructor,
    bytes: number,
    methodLE: DeferrableMethodLE | DeferredSimpleMethod,
    methodBE: DeferrableMethodBE | undefined,
    value: Deferrable<bigint | number>,
    valuePlaceholder: T = 0 as T,
  ) {
    type Method = (value: T, offset: number, bytes: number) => number;

    type ConstructorType = Buffer | BufferPolyfill;
    type Constructor = ConstructorType & Record<DeferrableMethod, Method>;

    const buffer = BufferConstructor.allocUnsafe(bytes) as Constructor;
    const method = this.littleEndian ? methodLE : methodBE ?? methodLE;

    if (typeof value === "function") {
      const currentOffset = this.inLength;

      this.deferredCalls.push((inBuffer) => {
        (inBuffer as Constructor)[method](value() as T, currentOffset, bytes);
      });

      buffer[method](valuePlaceholder, 0, bytes);
    } else {
      buffer[method](value as T, 0, bytes);
    }

    this.inBuffers.push(buffer);
    this.inLength += bytes;

    return this;
  }
}
