import { ByteOrder } from "@/types/ByteOrder.js";

import { BufferPolyfill } from "@/polyfills/BufferPolyfill";

export type Deferrable<T> = T | (() => T);

type DeferredBigIntMethod =
  | "writeBigInt64BE"
  | "writeBigInt64LE"
  | "writeBigUInt64BE"
  | "writeBigUInt64LE";

type DeferrableMethod =
  | "writeFloatBE"
  | "writeFloatLE"
  | "writeInt8"
  | "writeInt16BE"
  | "writeInt16LE"
  | "writeInt32BE"
  | "writeInt32LE"
  | "writeUInt8"
  | "writeUInt16BE"
  | "writeUInt16LE"
  | "writeUInt32BE"
  | "writeUInt32LE";

type DeferredCallback = (buffer: Buffer) => void;

export class BufferBuilder {
  private readonly inBuffers: Buffer[] = [];

  private readonly deferredCalls: DeferredCallback[] = [];

  private inLength = 0;

  public constructor(private readonly pByteOrder = ByteOrder.LITTLE_ENDIAN) {}

  public get length() {
    return this.inLength;
  }

  public build() {
    const buffer = Buffer.concat(this.inBuffers);

    for (const deferredCall of this.deferredCalls) {
      deferredCall(buffer);
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

  public writeByte(value: Deferrable<number>) {
    this.writeUnsignedInt8(value);

    return this;
  }

  public writeInt(value: number, bytes: 1 | 2 | 4 = 4) {
    const buffer = Buffer.allocUnsafe(bytes);

    if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
      buffer.writeIntLE(value, 0, bytes);
    } else {
      buffer.writeIntBE(value, 0, bytes);
    }

    this.inBuffers.push(buffer);
    this.inLength += bytes;

    return this;
  }

  public writeUnsignedInt(value: number, bytes: 1 | 2 | 4 = 4) {
    const buffer = Buffer.allocUnsafe(bytes);

    if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
      buffer.writeUIntLE(value, 0, bytes);
    } else {
      buffer.writeUIntBE(value, 0, bytes);
    }

    this.inBuffers.push(buffer);
    this.inLength += bytes;

    return this;
  }

  public writeInt8(value: Deferrable<number>) {
    const buffer = Buffer.allocUnsafe(1);

    this.deferrableCall(buffer, "writeInt8", value);

    this.inBuffers.push(buffer);
    this.inLength++;

    return this;
  }

  public writeUnsignedInt8(value: Deferrable<number>) {
    const buffer = Buffer.allocUnsafe(1);

    this.deferrableCall(buffer, "writeUInt8", value);

    this.inBuffers.push(buffer);
    this.inLength++;

    return this;
  }

  public writeInt16(value: Deferrable<number>) {
    const buffer = Buffer.allocUnsafe(2);

    this.deferrableCall(
      buffer,
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? "writeInt16LE"
        : "writeInt16BE",
      value,
    );

    this.inBuffers.push(buffer);
    this.inLength += 2;

    return this;
  }

  public writeUnsignedInt16(value: Deferrable<number>) {
    const buffer = Buffer.allocUnsafe(2);

    this.deferrableCall(
      buffer,
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? "writeUInt16LE"
        : "writeUInt16BE",
      value,
    );

    this.inBuffers.push(buffer);
    this.inLength += 2;

    return this;
  }

  public writeInt32(value: Deferrable<number>) {
    const buffer = Buffer.allocUnsafe(4);

    this.deferrableCall(
      buffer,
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? "writeInt32LE"
        : "writeInt32BE",
      value,
    );

    this.inBuffers.push(buffer);
    this.inLength += 4;

    return this;
  }

  public writeUnsignedInt32(value: Deferrable<number>) {
    const buffer = Buffer.allocUnsafe(4);

    this.deferrableCall(
      buffer,
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? "writeUInt32LE"
        : "writeUInt32BE",
      value,
    );

    this.inBuffers.push(buffer);
    this.inLength += 4;

    return this;
  }

  public writeInt64(value: Deferrable<bigint>) {
    const buffer = BufferPolyfill.allocUnsafe(8);

    this.deferrableCall(
      buffer,
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? "writeBigInt64LE"
        : "writeBigInt64BE",
      value,
      0n,
    );

    this.inBuffers.push(buffer);
    this.inLength += 8;

    return this;
  }

  public writeUnsignedInt64(value: Deferrable<bigint>) {
    const buffer = BufferPolyfill.allocUnsafe(8);

    this.deferrableCall(
      buffer,
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? "writeBigUInt64LE"
        : "writeBigUInt64BE",
      value,
      0n,
    );

    this.inBuffers.push(buffer);
    this.inLength += 8;

    return this;
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

  public writeFloat(value: Deferrable<number>) {
    const buffer = Buffer.allocUnsafe(4);

    this.deferrableCall(
      buffer,
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? "writeFloatLE"
        : "writeFloatBE",
      value,
    );

    this.inBuffers.push(buffer);
    this.inLength += 4;

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

  private deferrableCall<T extends bigint | number>(
    buffer: Buffer,
    method: DeferrableMethod | DeferredBigIntMethod,
    value: Deferrable<T>,
    placeholderValue: T = 0 as T,
  ) {
    type BufferMethod = (value: T, offset?: number) => number;

    if (typeof value === "function") {
      const currentOffset = this.inLength;

      this.deferredCalls.push((inBuffer) => {
        (inBuffer[method] as BufferMethod)(value(), currentOffset);
      });

      (buffer[method] as BufferMethod)(placeholderValue);
    } else {
      (buffer[method] as BufferMethod)(value);
    }
  }
}
