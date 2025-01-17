import { ByteOrder } from "./types/ByteOrder.js";
export declare class BufferBuilder {
    private readonly pByteOrder;
    private readonly inBuffers;
    private inLength;
    constructor(pByteOrder?: ByteOrder);
    get length(): number;
    build(): Buffer<ArrayBuffer>;
    pad(length: number, kind?: string, forced?: boolean): void;
    write(count: number, word?: string): void;
    writeByte(value: number): void;
    writeInt(value: number, bytes?: 1 | 2 | 4): void;
    writeUnsignedInt(value: number, bytes?: 1 | 2 | 4): void;
    writeInt8(value: number): void;
    writeUnsignedInt8(value: number): void;
    writeInt16(value: number): void;
    writeUnsignedInt16(value: number): void;
    writeInt32(value: number): void;
    writeUnsignedInt32(value: number): void;
    writeInt64(value: bigint): void;
    writeUnsignedInt64(value: bigint): void;
    writeString(value: Buffer | string | null | undefined): void;
    writeLengthPrefixedString(value: Buffer | string | null | undefined, bytes?: 1 | 2 | 4): void;
    writeMultibytePrefixedString(value: Buffer | string | null | undefined): void;
    writeNullTerminatedString(value: Buffer | string | null | undefined): void;
    writeFloat(value: number): void;
    push(...buffers: Buffer[]): void;
    private writeBigInt;
}
