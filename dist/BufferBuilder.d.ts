/// <reference types="node" resolution-mode="require"/>
import { ByteOrder } from "./types/ByteOrder.js";
export declare class BufferBuilder {
    private readonly pByteOrder;
    private readonly inBuffers;
    private inLength;
    constructor(pByteOrder?: ByteOrder);
    get length(): number;
    build(): Buffer;
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
    writeString(value: Buffer | string | null | undefined): void;
    writeLengthPrefixedString(value: Buffer | string | null | undefined, bytes?: 1 | 2 | 4): void;
    writeMultibytePrefixedString(value: Buffer | string | null | undefined): void;
    writeNullTerminatedString(value: Buffer | string | null | undefined): void;
    writeFloat(value: number): void;
    push(...buffers: Buffer[]): void;
}
