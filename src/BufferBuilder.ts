import { ByteOrder } from "./types/ByteOrder.js";

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

  public writeByte(value: number) {
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

  public writeString(value: string) {
    if (value.length > 0) {
      this.inBuffers.push(Buffer.from(value));
      this.inLength += value.length;
    }
  }

  public writeLengthPrefixedString(value: string, bytes: 1 | 2 | 4 = 4) {
    const buffer = Buffer.allocUnsafe(value.length + bytes);

    if (this.pByteOrder === ByteOrder.LITTLE_ENDIAN) {
      buffer.writeIntLE(value.length, 0, bytes);
    } else {
      buffer.writeIntBE(value.length, 0, bytes);
    }

    buffer.write(value, bytes);

    this.inBuffers.push(buffer);
    this.inLength += buffer.length;
  }

  public writeMultibytePrefixedString(value: string) {
    if (value.length === 0) {
      this.writeByte(0);

      return;
    }

    const buffer = Buffer.from(value);
    let { length } = buffer;

    this.inLength += length;

    while (length > 0) {
      let chunkLength = length & 0x7f;

      if (length > 0x7f) {
        chunkLength |= 0x80;
      }

      this.writeByte(chunkLength);

      length >>= 7;
    }

    this.inBuffers.push(buffer);
  }

  public writeNullTerminatedString(value: string) {
    this.inBuffers.push(Buffer.from(`${value}\0`));
    this.inLength += value.length + 1;
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
    this.inLength += buffers.reduce((a, b) => a + b.length, 0);
  }
}
