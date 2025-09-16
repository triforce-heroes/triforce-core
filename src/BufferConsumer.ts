import { ByteOrder } from "@/types/ByteOrder.js";

export class BufferConsumer {
  public constructor(
    private readonly pBuffer: Buffer,
    private pByteOffset = 0,
    private readonly pByteOrder = ByteOrder.LITTLE_ENDIAN,
  ) {}

  public get buffer() {
    return this.pBuffer;
  }

  public get byteOffset() {
    return this.pByteOffset;
  }

  public seek(byteOffset = 0) {
    this.pByteOffset = byteOffset;

    return this;
  }

  public at(byteOffset = 0): number {
    return this.pBuffer.readUInt8(this.pByteOffset + byteOffset);
  }

  public atConsumable(value: number): boolean {
    if (this.at() !== value) {
      return false;
    }

    this.skip();

    return true;
  }

  public read(bytes?: number): Buffer {
    const value =
      bytes === undefined
        ? this.pBuffer.subarray(this.pByteOffset)
        : this.pBuffer.subarray(this.pByteOffset, this.pByteOffset + bytes);

    this.safeIncrease(bytes);

    return value;
  }

  public readByte(): number {
    return this.readUnsignedInt8();
  }

  public readInt8(): number {
    const value = this.pBuffer.readInt8(this.pByteOffset);

    this.pByteOffset++;

    return value;
  }

  public readUnsignedInt8(): number {
    const value = this.pBuffer.readUInt8(this.pByteOffset);

    this.pByteOffset++;

    return value;
  }

  public readInt16(): number {
    const value =
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? this.pBuffer.readInt16LE(this.pByteOffset)
        : this.pBuffer.readInt16BE(this.pByteOffset);

    this.pByteOffset += 2;

    return value;
  }

  public readUnsignedInt16(): number {
    const value =
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? this.pBuffer.readUInt16LE(this.pByteOffset)
        : this.pBuffer.readUInt16BE(this.pByteOffset);

    this.pByteOffset += 2;

    return value;
  }

  public readInt32(): number {
    const value =
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? this.pBuffer.readInt32LE(this.pByteOffset)
        : this.pBuffer.readInt32BE(this.pByteOffset);

    this.pByteOffset += 4;

    return value;
  }

  public readUnsignedInt32(): number {
    const value =
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? this.pBuffer.readUInt32LE(this.pByteOffset)
        : this.pBuffer.readUInt32BE(this.pByteOffset);

    this.pByteOffset += 4;

    return value;
  }

  public readInt64(): bigint {
    if (!("readBigUInt64LE" in this.pBuffer)) {
      return this.readBigInt("getBigInt64");
    }

    const value =
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? this.pBuffer.readBigInt64LE(this.pByteOffset)
        : this.pBuffer.readBigInt64BE(this.pByteOffset);

    this.pByteOffset += 8;

    return value;
  }

  public readUnsignedInt64(): bigint {
    if (!("readBigUInt64LE" in this.pBuffer)) {
      return this.readBigInt("getBigInt64");
    }

    const value =
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? this.pBuffer.readBigUInt64LE(this.pByteOffset)
        : this.pBuffer.readBigUInt64BE(this.pByteOffset);

    this.pByteOffset += 8;

    return value;
  }

  public readFloat(): number {
    const value =
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? this.pBuffer.readFloatLE(this.pByteOffset)
        : this.pBuffer.readFloatBE(this.pByteOffset);

    this.pByteOffset += 4;

    return value;
  }

  public readString(bytes: number) {
    const value = this.pBuffer.toString(
      "utf8",
      this.pByteOffset,
      this.pByteOffset + bytes,
    );

    this.pByteOffset += bytes;

    return value;
  }

  public readLengthPrefixedString(bytes: 1 | 2 | 4 = 4): string {
    const offset = this.pByteOffset;
    const length =
      this.pByteOrder === ByteOrder.LITTLE_ENDIAN
        ? this.pBuffer.readUIntLE(this.pByteOffset, bytes)
        : this.pBuffer.readUIntBE(this.pByteOffset, bytes);

    this.pByteOffset += length + bytes;

    return this.pBuffer.toString("utf8", offset + bytes, this.pByteOffset);
  }

  public readMultibytePrefixedString(): string {
    let length = 0;
    let shift = 0;

    while (true) {
      const byte = this.pBuffer.readUInt8(this.pByteOffset++);

      // eslint-disable-next-line no-bitwise
      length |= (byte & 0x7f) << shift;
      shift += 7;

      // eslint-disable-next-line no-bitwise
      if ((byte & 0x80) === 0) {
        break;
      }
    }

    if (length === 0) {
      return "";
    }

    const bufferString = this.pBuffer.toString(
      "utf8",
      this.pByteOffset,
      this.pByteOffset + length,
    );

    this.pByteOffset += length;

    return bufferString;
  }

  public readNullTerminatedString(
    bufferEncoding: "latin1" | "utf8" | "utf16le" = "utf8",
  ): string {
    const offset = this.pByteOffset;
    const nullOffset = this.pBuffer.indexOf(
      "\0",
      this.pByteOffset,
      bufferEncoding,
    );

    if (nullOffset === -1) {
      this.pByteOffset = this.pBuffer.length;

      return this.pBuffer.subarray(offset).toString(bufferEncoding);
    }

    this.pByteOffset = nullOffset + (bufferEncoding === "utf16le" ? 2 : 1);

    return this.pBuffer.subarray(offset, nullOffset).toString(bufferEncoding);
  }

  public back(bytes = 1) {
    this.pByteOffset -= bytes;

    return this;
  }

  public skip(bytes = 1) {
    this.pByteOffset += bytes;

    return this;
  }

  public skipPadding(padding: number, forced = false) {
    const paddingDifference = this.pByteOffset % padding;

    if (paddingDifference !== 0) {
      this.pByteOffset = Math.min(
        this.buffer.length,
        this.pByteOffset + (padding - paddingDifference),
      );
    } else if (forced) {
      this.pByteOffset = Math.min(
        this.buffer.length,
        this.pByteOffset + padding,
      );
    }

    return this;
  }

  public rest(): Buffer {
    return this.pBuffer.subarray(this.pByteOffset);
  }

  public consumer(bytes?: number): BufferConsumer {
    const instance = new BufferConsumer(
      bytes === undefined
        ? this.pBuffer.subarray(this.pByteOffset)
        : this.pBuffer.subarray(this.pByteOffset, this.pByteOffset + bytes),
      undefined,
      this.pByteOrder,
    );

    this.safeIncrease(bytes);

    return instance;
  }

  public isConsumed() {
    return this.pByteOffset === this.pBuffer.length;
  }

  private safeIncrease(bytes?: number) {
    this.pByteOffset =
      bytes === undefined
        ? this.pBuffer.length
        : Math.min(this.pByteOffset + bytes, this.pBuffer.length);

    return this;
  }

  private readBigInt(method: "getBigInt64" | "getBigUint64") {
    const view = new DataView(
      this.pBuffer.buffer,
      this.pBuffer.byteOffset + this.pByteOffset,
      8,
    );

    this.pByteOffset += 8;

    return view[method](0, this.pByteOrder === ByteOrder.LITTLE_ENDIAN);
  }
}
