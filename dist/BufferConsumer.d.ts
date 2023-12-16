/// <reference types="node" resolution-mode="require"/>
import { ByteOrder } from "./types/ByteOrder.js";
export declare class BufferConsumer {
    private readonly pBuffer;
    private pByteOffset;
    private readonly pByteOrder;
    constructor(pBuffer: Buffer, pByteOffset?: number, pByteOrder?: ByteOrder);
    get buffer(): Buffer;
    get byteOffset(): number;
    seek(byteOffset?: number): void;
    at(byteOffset?: number): number;
    atConsumable(value: number): boolean;
    read(bytes?: number): Buffer;
    readByte(): number;
    readInt8(): number;
    readUnsignedInt8(): number;
    readInt16(): number;
    readUnsignedInt16(): number;
    readInt32(): number;
    readUnsignedInt32(): number;
    readFloat(): number;
    readString(bytes: number): string;
    readLengthPrefixedString(bytes?: 1 | 2 | 4): string;
    readMultibytePrefixedString(): string;
    readNullTerminatedString(): string;
    back(bytes?: number): this;
    skip(bytes?: number): this;
    rest(): Buffer;
    consumer(bytes?: number): BufferConsumer;
    isConsumed(): boolean;
    private safeIncrease;
}
