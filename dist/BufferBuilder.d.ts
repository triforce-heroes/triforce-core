/// <reference types="node" />
export declare class BufferBuilder {
    private readonly buffers;
    build(): Buffer;
    writeByte(value: number): void;
    writeInt16(value: number): void;
    writeInt32(value: number): void;
    writeUnsignedInt16(value: number): void;
    writeUnsignedInt32(value: number): void;
    writeLengthPrefixedString(value: string, bytes?: 1 | 2 | 4): void;
    writeMultibytePrefixedString(value: string): void;
    writeFloat(value: number): void;
    push(...buffers: Buffer[]): void;
}
