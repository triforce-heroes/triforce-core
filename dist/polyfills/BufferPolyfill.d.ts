export declare class BufferPolyfill extends Buffer {
    static allocUnsafe(size: number): Buffer<ArrayBuffer>;
    writeBigInt64LE(value: bigint, offset?: number): number;
    writeBigInt64BE(value: bigint, offset?: number): number;
    writeBigUInt64LE(value: bigint, offset?: number): number;
    writeBigUInt64BE(value: bigint, offset?: number): number;
    private writePolyfill;
}
