export class BufferConsumer {
  readonly #buffer: Buffer;

  #byteOffset = 0;

  public constructor(buffer: Buffer, byteOffset = 0) {
    this.#buffer = buffer;
    this.#byteOffset = byteOffset;
  }

  public get byteOffset() {
    return this.#byteOffset;
  }

  public at(byteOffset = 0): number {
    return this.#buffer.readUInt8(this.#byteOffset + byteOffset);
  }

  public atConsumable(value: number): boolean {
    if (this.at() !== value) {
      return false;
    }

    this.skip();

    return true;
  }

  public readByte(): number {
    const value = this.#buffer.readUInt8(this.#byteOffset);

    this.#byteOffset++;

    return value;
  }

  public readInt16(): number {
    const value = this.#buffer.readIntLE(this.#byteOffset, 2);

    this.#byteOffset += 2;

    return value;
  }

  public readUnsignedInt16(): number {
    const value = this.#buffer.readUIntLE(this.#byteOffset, 2);

    this.#byteOffset += 2;

    return value;
  }

  public readInt32(): number {
    const value = this.#buffer.readIntLE(this.#byteOffset, 4);

    this.#byteOffset += 4;

    return value;
  }

  public readUnsignedInt32(): number {
    const value = this.#buffer.readUIntLE(this.#byteOffset, 4);

    this.#byteOffset += 4;

    return value;
  }

  public readFloat(): number {
    const value = this.#buffer.readFloatLE(this.#byteOffset);

    this.#byteOffset += 4;

    return value;
  }

  public readString(bytes: number) {
    const value = this.#buffer.toString(
      "utf8",
      this.#byteOffset,
      this.#byteOffset + bytes,
    );

    this.#byteOffset += bytes;

    return value;
  }

  public readLengthPrefixedString(bytes: 1 | 2 | 4 = 4): string {
    const offset = this.#byteOffset;
    const length = this.#buffer.readUIntLE(this.#byteOffset, bytes);

    this.#byteOffset += length + bytes;

    return this.#buffer.toString("utf8", offset + bytes, this.#byteOffset);
  }

  public readMultibytePrefixedString(): string {
    let length = 0;
    let shift = 0;

    while (true) {
      const byte = this.#buffer.readUInt8(this.#byteOffset++);

      length |= (byte & 0x7f) << shift;
      shift += 7;

      if ((byte & 0x80) === 0) {
        break;
      }
    }

    if (length === 0) {
      return "";
    }

    const bufferString = this.#buffer.toString(
      "utf8",
      this.#byteOffset,
      this.#byteOffset + length,
    );

    this.#byteOffset += length;

    return bufferString;
  }

  public readNullTerminatedString(): string {
    const offset = this.#byteOffset;
    const nullOffset = this.#buffer.indexOf("\n", this.#byteOffset);

    if (nullOffset === -1) {
      this.#byteOffset = this.#buffer.length;

      return this.#buffer.subarray(offset).toString("utf8");
    }

    this.#byteOffset = nullOffset + 1;

    return this.#buffer.subarray(offset, nullOffset).toString("utf8");
  }

  public back(bytes = 1) {
    this.#byteOffset -= bytes;

    return this;
  }

  public skip(bytes = 1) {
    this.#byteOffset += bytes;

    return this;
  }

  public rest(): Buffer {
    return this.#buffer.subarray(this.#byteOffset);
  }

  public isConsumed() {
    return this.#byteOffset === this.#buffer.length;
  }
}
