import { ByteOrder } from "@/types/ByteOrder.js";

export class BufferBuilder {
  private readonly inBuffers: Buffer[] = [];

  private inLength = 0;

  public constructor(private readonly pByteOrder = ByteOrder.LITTLE_ENDIAN) {}

  public get length() {
    return this.inLength;
  }

  public build() {
    return Buffer.concat(this.inBuffers);
  }

  public pad(length: number, kind = "\0", forced = false) {
    if (!forced && this.inLength % length === 0) {
      return;
    }

    const buffer = Buffer.alloc(
      length - (this.inLength % length),
      kind,
      "binary",
    );

    this.inBuffers.push(buffer);
    this.inLength += buffer.length;
  }

  public write(count: number, word = "\0") {
    if (count !== 0) {
      const buffer = Buffer.from(word.repeat(count));

      this.inBuffers.push(buffer);
      this.inLength += buffer.length;
    }
  }

  public writeByte(value: number) {
    this.writeUnsignedInt8(value);
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
  }

  public writeInt8(value: number) {
    const buffer = Buffer.allocUnsafe(1);

    buffer.writeInt8(value);

    this.inBuffers.push(buffer);
    this.inLength++;
  }

  public writeUnsignedInt8(value: number) {
    const buffer = Buffer.allocUnsafe(1);

    buffer.writeUInt8(value);

    this.inBuffers.push(buffer);
    this.inLength++;
  }

  public writeInt16(value: number) {
    const buffer = Buffer.allocUnsafe(2);

    if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
      buffer.writeInt16LE(value);
    } else {
      buffer.writeInt16BE(value);
    }

    this.inBuffers.push(buffer);
    this.inLength += 2;
  }

  public writeUnsignedInt16(value: number) {
    const buffer = Buffer.allocUnsafe(2);

    if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
      buffer.writeUInt16LE(value);
    } else {
      buffer.writeUInt16BE(value);
    }

    this.inBuffers.push(buffer);
    this.inLength += 2;
  }

  public writeInt32(value: number) {
    const buffer = Buffer.allocUnsafe(4);

    if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
      buffer.writeInt32LE(value);
    } else {
      buffer.writeInt32BE(value);
    }

    this.inBuffers.push(buffer);
    this.inLength += 4;
  }

  public writeUnsignedInt32(value: number) {
    const buffer = Buffer.allocUnsafe(4);

    if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
      buffer.writeUInt32LE(value);
    } else {
      buffer.writeUInt32BE(value);
    }

    this.inBuffers.push(buffer);
    this.inLength += 4;
  }

  public writeInt64(value: bigint) {
    const buffer = Buffer.allocUnsafe(8);

    if (!("writeBigInt64LE" in buffer)) {
      this.writeBigInt(buffer, "setBigInt64", value);
    } else if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
      buffer.writeBigInt64LE(value);
    } else {
      buffer.writeBigInt64BE(value);
    }

    this.inBuffers.push(buffer);
    this.inLength += 8;
  }

  public writeUnsignedInt64(value: bigint) {
    const buffer = Buffer.allocUnsafe(8);

    if (!("writeBigInt64LE" in buffer)) {
      this.writeBigInt(buffer, "setBigUint64", value);
    } else if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
      buffer.writeBigUInt64LE(value);
    } else {
      buffer.writeBigUInt64BE(value);
    }

    this.inBuffers.push(buffer);
    this.inLength += 8;
  }

  public writeString(value: Buffer | string | null | undefined) {
    if (value !== null && value !== undefined && value.length > 0) {
      const buffer = Buffer.from(value as Buffer);

      this.inBuffers.push(buffer);
      this.inLength += buffer.length;
    }
  }

  public writeLengthPrefixedString(
    value: Buffer | string | null | undefined,
    bytes: 1 | 2 | 4 = 4,
  ) {
    if (value === null || value === undefined || value.length === 0) {
      this.writeUnsignedInt(0, bytes);

      return;
    }

    const buffer = Buffer.from(value as Buffer);

    this.writeUnsignedInt(buffer.length, bytes);

    this.inBuffers.push(buffer);
    this.inLength += buffer.length;
  }

  public writeMultibytePrefixedString(
    value: Buffer | string | null | undefined,
  ) {
    if (value === null || value === undefined || value.length === 0) {
      this.writeByte(0);

      return;
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
  }

  public writeNullTerminatedString(value: Buffer | string | null | undefined) {
    if (value === null || value === undefined) {
      this.writeByte(0);

      return;
    }

    const buffer = Buffer.from(value as Buffer);

    this.inBuffers.push(buffer);
    this.inLength += buffer.length;

    this.writeByte(0);
  }

  public writeFloat(value: number) {
    const buffer = Buffer.allocUnsafe(4);

    if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
      buffer.writeFloatLE(value);
    } else {
      buffer.writeFloatBE(value);
    }

    this.inBuffers.push(buffer);
    this.inLength += 4;
  }

  public push(...buffers: Buffer[]) {
    this.inBuffers.push(...buffers);
    this.inLength += buffers.reduce(
      (bufferA, bufferB) => bufferA + bufferB.length,
      0,
    );
  }

  private writeBigInt(
    buffer: Buffer,
    method: "setBigInt64" | "setBigUint64",
    value: bigint,
  ) {
    new DataView(buffer.buffer, buffer.byteOffset)[method](
      0,
      value,
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN,
    );
  }
}
