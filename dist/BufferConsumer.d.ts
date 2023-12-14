/// <reference types="node" />
export declare class BufferConsumer {
    #private;
    constructor(buffer: Buffer, byteOffset?: number);
    get byteOffset(): number;
    at(byteOffset?: number): number;
    atConsumable(value: number): boolean;
    readByte(): number;
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
    isConsumed(): boolean;
}
