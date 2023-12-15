import{ByteOrder as t}from"./types/ByteOrder.js";export class BufferBuilder{constructor(e=t.LITTLE_ENDIAN){this.inBuffers=[],this.pByteOrder=e}build(){return Buffer.concat(this.inBuffers)}writeByte(t){let e=Buffer.allocUnsafe(1);e.writeUInt8(t),this.inBuffers.push(e)}writeInt16(e){let r=Buffer.allocUnsafe(2);this.pByteOrder===t.LITTLE_ENDIAN?r.writeInt16LE(e):r.writeInt16BE(e),this.inBuffers.push(r)}writeUnsignedInt16(e){let r=Buffer.allocUnsafe(2);this.pByteOrder===t.LITTLE_ENDIAN?r.writeUInt16LE(e):r.writeUInt16BE(e),this.inBuffers.push(r)}writeInt32(e){let r=Buffer.allocUnsafe(4);this.pByteOrder===t.LITTLE_ENDIAN?r.writeInt32LE(e):r.writeInt32BE(e),this.inBuffers.push(r)}writeUnsignedInt32(e){let r=Buffer.allocUnsafe(4);this.pByteOrder===t.LITTLE_ENDIAN?r.writeUInt32LE(e):r.writeUInt32BE(e),this.inBuffers.push(r)}writeString(t){t.length>0&&this.inBuffers.push(Buffer.from(t))}writeLengthPrefixedString(e,r=4){let i=Buffer.allocUnsafe(e.length+r);this.pByteOrder===t.LITTLE_ENDIAN?i.writeIntLE(e.length,0,r):i.writeIntBE(e.length,0,r),i.write(e,r),this.inBuffers.push(i)}writeMultibytePrefixedString(t){if(0===t.length){this.writeByte(0);return}let e=Buffer.from(t),{length:r}=e;for(;r>0;){let t=127&r;r>127&&(t|=128),this.writeByte(t),r>>=7}this.push(e)}writeNullTerminatedString(t){this.inBuffers.push(Buffer.from(`${t}\0`))}writeFloat(e){let r=Buffer.allocUnsafe(4);this.pByteOrder===t.LITTLE_ENDIAN?r.writeFloatLE(e):r.writeFloatBE(e),this.inBuffers.push(r)}push(...t){this.inBuffers.push(...t)}}