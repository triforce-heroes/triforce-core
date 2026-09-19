//#region src/Encoding.d.ts
type NativeEncoding = "latin1" | "utf-8" | "utf16-le";
type ExtraEncoding = "shift-jis" | "big5" | "gbk" | "euc-kr" | "cp1252";
type TextEncoding = NativeEncoding | ExtraEncoding;
declare function decodeBuffer(buffer: Buffer | Uint8Array, encoding?: TextEncoding): string;
declare function encodeString(value: string, encoding?: TextEncoding): Buffer<ArrayBufferLike>;
declare function getNullTerminator(encoding?: TextEncoding): Buffer<ArrayBufferLike>;
declare function getNullTerminatorByteLength(encoding?: TextEncoding): number;
declare function encodeToString(buffer: Buffer): string;
declare function encodeFromString(string: string): Buffer<ArrayBuffer>;
//#endregion
export { encodeFromString as a, getNullTerminator as c, decodeBuffer as i, getNullTerminatorByteLength as l, NativeEncoding as n, encodeString as o, TextEncoding as r, encodeToString as s, ExtraEncoding as t };