export class BufferPolyfill extends Buffer {
  public static override allocUnsafe(size: number) {
    const buffer = Buffer.allocUnsafe(size);

    return "writeBigInt64LE" in Buffer.prototype
      ? buffer
      : (Object.setPrototypeOf(buffer, BufferPolyfill.prototype) as BufferPolyfill);
  }

  public override writeBigInt64LE(value: bigint, offset?: number) {
    return this.writePolyfill(value, "setBigInt64", true, offset);
  }

  public override writeBigInt64BE(value: bigint, offset?: number) {
    return this.writePolyfill(value, "setBigInt64", false, offset);
  }

  public override writeBigUInt64LE(value: bigint, offset?: number) {
    return this.writePolyfill(value, "setBigUint64", true, offset);
  }

  public override writeBigUInt64BE(value: bigint, offset?: number) {
    return this.writePolyfill(value, "setBigUint64", false, offset);
  }

  private writePolyfill(
    value: bigint,
    method: "setBigInt64" | "setBigUint64",
    littleEndian: boolean,
    offset = 0,
  ) {
    const view = new DataView(this.buffer, this.byteOffset + offset, 8);

    view[method](0, value, littleEndian);

    return this.byteOffset + offset + 8;
  }
}
