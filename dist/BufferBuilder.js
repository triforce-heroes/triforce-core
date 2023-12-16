import{ByteOrder as t}from"./types/ByteOrder.js";export class BufferBuilder{constructor(e=t.LITTLE_ENDIAN){this.inBuffers=[],this.inLength=0,this.pByteOrder=e}get length(){return this.inLength}build(){return Buffer.concat(this.inBuffers)}write(t,e="\x00"){if(0!==t){let i=Buffer.from(e.repeat(t));this.inBuffers.push(i),this.inLength+=i.length}}writeByte(t){let e=Buffer.allocUnsafe(1);e.writeUInt8(t),this.inBuffers.push(e),this.inLength++}writeInt16(e){let i=Buffer.allocUnsafe(2);this.pByteOrder===t.LITTLE_ENDIAN?i.writeInt16LE(e):i.writeInt16BE(e),this.inBuffers.push(i),this.inLength+=2}writeUnsignedInt16(e){let i=Buffer.allocUnsafe(2);this.pByteOrder===t.LITTLE_ENDIAN?i.writeUInt16LE(e):i.writeUInt16BE(e),this.inBuffers.push(i),this.inLength+=2}writeInt32(e){let i=Buffer.allocUnsafe(4);this.pByteOrder===t.LITTLE_ENDIAN?i.writeInt32LE(e):i.writeInt32BE(e),this.inBuffers.push(i),this.inLength+=4}writeUnsignedInt32(e){let i=Buffer.allocUnsafe(4);this.pByteOrder===t.LITTLE_ENDIAN?i.writeUInt32LE(e):i.writeUInt32BE(e),this.inBuffers.push(i),this.inLength+=4}writeString(t){null!=t&&t.length>0&&(this.inBuffers.push(Buffer.from(t)),this.inLength+=t.length)}writeLengthPrefixedString(e,i=4){if(null==e||0===e.length){this.write(i);return}let r=Buffer.allocUnsafe(e.length+i);this.pByteOrder===t.LITTLE_ENDIAN?r.writeIntLE(e.length,0,i):r.writeIntBE(e.length,0,i),r.write(e,i),this.inBuffers.push(r),this.inLength+=r.length}writeMultibytePrefixedString(t){if(null==t||0===t.length){this.writeByte(0);return}let e=Buffer.from(t),{length:i}=e;for(this.inLength+=i;i>0;){let t=127&i;i>127&&(t|=128),this.writeByte(t),i>>=7}this.inBuffers.push(e)}writeNullTerminatedString(t){if(null==t){this.writeByte(0);return}this.inBuffers.push(Buffer.from(`${t}\0`)),this.inLength+=t.length+1}writeFloat(e){let i=Buffer.allocUnsafe(4);this.pByteOrder===t.LITTLE_ENDIAN?i.writeFloatLE(e):i.writeFloatBE(e),this.inBuffers.push(i),this.inLength+=4}push(...t){this.inBuffers.push(...t),this.inLength+=t.reduce((t,e)=>t+e.length,0)}}