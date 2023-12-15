/// <reference types="node" resolution-mode="require"/>
import { ByteOrder } from "./types/ByteOrder.js";
export declare class BufferBuilder {
    private readonly pByteOrder;
    private readonly inBuffers;
    constructor(pByteOrder?: ByteOrder);
    build(): Buffer;
    writeByte(value: number): void;
    writeInt16(value: number): void;
    writeUnsignedInt16(value: number): void;
    writeInt32(value: number): void;
    writeUnsignedInt32(value: number): void;
    writeString(value: string): void;
    writeLengthPrefixedString(value: string, bytes?: 1 | 2 | 4): void;
    writeMultibytePrefixedString(value: string): void;
    writeNullTerminatedString(value: string): void;
    writeFloat(value: number): void;
    push(...buffers: Buffer[]): void;
}
