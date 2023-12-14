export class BufferBuilder {
  private readonly buffers: Buffer[] = [];

  public build() {
    return Buffer.concat(this.buffers);
  }

  public writeByte(value: number) {
    const buffer = Buffer.allocUnsafe(1);

    buffer.writeUInt8(value);

    this.buffers.push(buffer);
  }

  public writeInt16(value: number) {
    const buffer = Buffer.allocUnsafe(2);

    buffer.writeInt16LE(value);

    this.buffers.push(buffer);
  }

  public writeInt32(value: number) {
    const buffer = Buffer.allocUnsafe(4);

    buffer.writeInt32LE(value);

    this.buffers.push(buffer);
  }

  public writeUnsignedInt16(value: number) {
    const buffer = Buffer.allocUnsafe(2);

    buffer.writeUInt16LE(value);

    this.buffers.push(buffer);
  }

  public writeUnsignedInt32(value: number) {
    const buffer = Buffer.allocUnsafe(4);

    buffer.writeUInt32LE(value);

    this.buffers.push(buffer);
  }

  public writeString(value: string) {
    if (value.length > 0) {
      this.buffers.push(Buffer.from(value));
    }
  }

  public writeLengthPrefixedString(value: string, bytes: 1 | 2 | 4 = 4) {
    if (value.length === 0) {
      this.writeByte(0);

      return;
    }

    const buffer = Buffer.allocUnsafe(value.length + bytes);

    buffer.writeIntLE(value.length, 0, bytes);
    buffer.write(value, bytes);

    this.buffers.push(buffer);
  }

  public writeMultibytePrefixedString(value: string) {
    if (value.length === 0) {
      this.writeByte(0);

      return;
    }

    const buffer = Buffer.from(value);
    let { length } = buffer;

    while (length > 0) {
      let chunkLength = length & 0x7f;

      if (length > 0x7f) {
        chunkLength |= 0x80;
      }

      this.writeByte(chunkLength);

      length >>= 7;
    }

    this.push(buffer);
  }

  public writeFloat(value: number) {
    const buffer = Buffer.allocUnsafe(4);

    buffer.writeFloatLE(value);

    this.buffers.push(buffer);
  }

  public push(...buffers: Buffer[]) {
    this.buffers.push(...buffers);
  }
}
