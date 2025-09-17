export declare class BufferPolyfill extends Buffer {
    static allocUnsafe(size: number): Buffer<ArrayBuffer>;
    writeBigInt64LE(value: bigint): number;
    writeBigInt64BE(value: bigint): number;
    writeBigUInt64LE(value: bigint): number;
    writeBigUInt64BE(value: bigint): number;
    private writePolyfill;
}
