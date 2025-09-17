export class BufferPolyfill extends Buffer {
  public static override allocUnsafe(size: number) {
    const buffer = Buffer.allocUnsafe(size);

    return "writeBigInt64LE" in Buffer.prototype
      ? buffer
      : (Object.setPrototypeOf(
          buffer,
          BufferPolyfill.prototype,
        ) as BufferPolyfill);
  }

  public override writeBigInt64LE(value: bigint) {
    return this.writePolyfill(value, "setBigInt64", true);
  }

  public override writeBigInt64BE(value: bigint) {
    return this.writePolyfill(value, "setBigInt64");
  }

  public override writeBigUInt64LE(value: bigint) {
    return this.writePolyfill(value, "setBigUint64", true);
  }

  public override writeBigUInt64BE(value: bigint) {
    return this.writePolyfill(value, "setBigUint64");
  }

  private writePolyfill(
    value: bigint,
    method: "setBigInt64" | "setBigUint64",
    littleEndian?: boolean,
  ) {
    const view = new DataView(this.buffer, this.byteOffset, 8);

    view[method](0, value, littleEndian);

    return this.byteOffset + 8;
  }
}
