import { ByteOrder } from "./types/ByteOrder.js";
export declare class BufferBuilder {
    private readonly pByteOrder;
    private readonly inBuffers;
    private inLength;
    constructor(pByteOrder?: ByteOrder);
    get length(): number;
    build(): Buffer<ArrayBuffer>;
    pad(length: number, kind?: string, forced?: boolean): this;
    write(count: number, word?: string): this;
    writeByte(value: number): this;
    writeInt(value: number, bytes?: 1 | 2 | 4): this;
    writeUnsignedInt(value: number, bytes?: 1 | 2 | 4): this;
    writeInt8(value: number): this;
    writeUnsignedInt8(value: number): this;
    writeInt16(value: number): this;
    writeUnsignedInt16(value: number): this;
    writeInt32(value: number): this;
    writeUnsignedInt32(value: number): this;
    writeInt64(value: bigint): this;
    writeUnsignedInt64(value: bigint): this;
    writeString(value: Buffer | string | null | undefined): this;
    writeLengthPrefixedString(value: Buffer | string | null | undefined, bytes?: 1 | 2 | 4): this;
    writeMultibytePrefixedString(value: Buffer | string | null | undefined): this;
    writeNullTerminatedString(value: Buffer | string | null | undefined): this;
    writeFloat(value: number): this;
    push(...buffers: Buffer[]): this;
    private writeBigInt;
}
