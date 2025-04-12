import{ByteOrder as t}from"./types/ByteOrder.js";export class BufferBuilder{constructor(e=t.LITTLE_ENDIAN){this.inBuffers=[],this.inLength=0,this.pByteOrder=e}get length(){return this.inLength}build(){return Buffer.concat(this.inBuffers)}pad(t,e="\0",i=!1){if(!i&&this.inLength%t==0)return;let n=Buffer.alloc(t-this.inLength%t,e,"binary");this.inBuffers.push(n),this.inLength+=n.length}write(t,e="\0"){if(0!==t){let i=Buffer.from(e.repeat(t));this.inBuffers.push(i),this.inLength+=i.length}}writeByte(t){this.writeUnsignedInt8(t)}writeInt(e,i=4){let n=Buffer.allocUnsafe(i);this.pByteOrder===t.LITTLE_ENDIAN?n.writeIntLE(e,0,i):n.writeIntBE(e,0,i),this.inBuffers.push(n),this.inLength+=i}writeUnsignedInt(e,i=4){let n=Buffer.allocUnsafe(i);this.pByteOrder===t.LITTLE_ENDIAN?n.writeUIntLE(e,0,i):n.writeUIntBE(e,0,i),this.inBuffers.push(n),this.inLength+=i}writeInt8(t){let e=Buffer.allocUnsafe(1);e.writeInt8(t),this.inBuffers.push(e),this.inLength++}writeUnsignedInt8(t){let e=Buffer.allocUnsafe(1);e.writeUInt8(t),this.inBuffers.push(e),this.inLength++}writeInt16(e){let i=Buffer.allocUnsafe(2);this.pByteOrder===t.LITTLE_ENDIAN?i.writeInt16LE(e):i.writeInt16BE(e),this.inBuffers.push(i),this.inLength+=2}writeUnsignedInt16(e){let i=Buffer.allocUnsafe(2);this.pByteOrder===t.LITTLE_ENDIAN?i.writeUInt16LE(e):i.writeUInt16BE(e),this.inBuffers.push(i),this.inLength+=2}writeInt32(e){let i=Buffer.allocUnsafe(4);this.pByteOrder===t.LITTLE_ENDIAN?i.writeInt32LE(e):i.writeInt32BE(e),this.inBuffers.push(i),this.inLength+=4}writeUnsignedInt32(e){let i=Buffer.allocUnsafe(4);this.pByteOrder===t.LITTLE_ENDIAN?i.writeUInt32LE(e):i.writeUInt32BE(e),this.inBuffers.push(i),this.inLength+=4}writeInt64(e){let i=Buffer.allocUnsafe(8);"writeBigInt64LE"in i?this.pByteOrder===t.LITTLE_ENDIAN?i.writeBigInt64LE(e):i.writeBigInt64BE(e):this.writeBigInt(i,"setBigInt64",e),this.inBuffers.push(i),this.inLength+=8}writeUnsignedInt64(e){let i=Buffer.allocUnsafe(8);"writeBigInt64LE"in i?this.pByteOrder===t.LITTLE_ENDIAN?i.writeBigUInt64LE(e):i.writeBigUInt64BE(e):this.writeBigInt(i,"setBigUint64",e),this.inBuffers.push(i),this.inLength+=8}writeString(t){if(null!=t&&t.length>0){let e=Buffer.from(t);this.inBuffers.push(e),this.inLength+=e.length}}writeLengthPrefixedString(t,e=4){if(null==t||0===t.length)return void this.writeUnsignedInt(0,e);let i=Buffer.from(t);this.writeUnsignedInt(i.length,e),this.inBuffers.push(i),this.inLength+=i.length}writeMultibytePrefixedString(t){if(null==t||0===t.length)return void this.writeByte(0);let e=Buffer.from(t),{length:i}=e;for(this.inLength+=i;i>0;){let t=127&i;i>127&&(t|=128),this.writeByte(t),i>>=7}this.inBuffers.push(e)}writeNullTerminatedString(t){if(null==t)return void this.writeByte(0);let e=Buffer.from(t);this.inBuffers.push(e),this.inLength+=e.length,this.writeByte(0)}writeFloat(e){let i=Buffer.allocUnsafe(4);this.pByteOrder===t.LITTLE_ENDIAN?i.writeFloatLE(e):i.writeFloatBE(e),this.inBuffers.push(i),this.inLength+=4}push(...t){this.inBuffers.push(...t),this.inLength+=t.reduce((t,e)=>t+e.length,0)}writeBigInt(e,i,n){new DataView(e.buffer,e.byteOffset)[i](0,n,this.pByteOrder===t.LITTLE_ENDIAN)}}