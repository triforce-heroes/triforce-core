import{ByteOrder as t}from"./types/ByteOrder.js";export class BufferConsumer{constructor(e,f=0,s=t.LITTLE_ENDIAN){this.pBuffer=e,this.pByteOffset=f,this.pByteOrder=s}get buffer(){return this.pBuffer}get byteOffset(){return this.pByteOffset}seek(t=0){this.pByteOffset=t}at(t=0){return this.pBuffer.readUInt8(this.pByteOffset+t)}atConsumable(t){return this.at()===t&&(this.skip(),!0)}read(t){let e=void 0===t?this.pBuffer.subarray(this.pByteOffset):this.pBuffer.subarray(this.pByteOffset,this.pByteOffset+t);return this.safeIncrease(t),e}readByte(){let t=this.pBuffer.readUInt8(this.pByteOffset);return this.pByteOffset++,t}readInt16(){let e=this.pByteOrder===t.LITTLE_ENDIAN?this.pBuffer.readInt16LE(this.pByteOffset):this.pBuffer.readInt16BE(this.pByteOffset);return this.pByteOffset+=2,e}readUnsignedInt16(){let e=this.pByteOrder===t.LITTLE_ENDIAN?this.pBuffer.readUIntLE(this.pByteOffset,2):this.pBuffer.readUIntBE(this.pByteOffset,2);return this.pByteOffset+=2,e}readInt32(){let e=this.pByteOrder===t.LITTLE_ENDIAN?this.pBuffer.readIntLE(this.pByteOffset,4):this.pBuffer.readIntBE(this.pByteOffset,4);return this.pByteOffset+=4,e}readUnsignedInt32(){let e=this.pByteOrder===t.LITTLE_ENDIAN?this.pBuffer.readUIntLE(this.pByteOffset,4):this.pBuffer.readUIntBE(this.pByteOffset,4);return this.pByteOffset+=4,e}readFloat(){let e=this.pByteOrder===t.LITTLE_ENDIAN?this.pBuffer.readFloatLE(this.pByteOffset):this.pBuffer.readFloatBE(this.pByteOffset);return this.pByteOffset+=4,e}readString(t){let e=this.pBuffer.toString("utf8",this.pByteOffset,this.pByteOffset+t);return this.pByteOffset+=t,e}readLengthPrefixedString(e=4){let f=this.pByteOffset,s=this.pByteOrder===t.LITTLE_ENDIAN?this.pBuffer.readUIntLE(this.pByteOffset,e):this.pBuffer.readUIntBE(this.pByteOffset,e);return this.pByteOffset+=s+e,this.pBuffer.toString("utf8",f+e,this.pByteOffset)}readMultibytePrefixedString(){let t=0,e=0;for(;;){let f=this.pBuffer.readUInt8(this.pByteOffset++);if(t|=(127&f)<<e,e+=7,(128&f)==0)break}if(0===t)return"";let f=this.pBuffer.toString("utf8",this.pByteOffset,this.pByteOffset+t);return this.pByteOffset+=t,f}readNullTerminatedString(){let t=this.pByteOffset,e=this.pBuffer.indexOf("\x00",this.pByteOffset);return -1===e?(this.pByteOffset=this.pBuffer.length,this.pBuffer.subarray(t).toString("utf8")):(this.pByteOffset=e+1,this.pBuffer.subarray(t,e).toString("utf8"))}back(t=1){return this.pByteOffset-=t,this}skip(t=1){return this.pByteOffset+=t,this}rest(){return this.pBuffer.subarray(this.pByteOffset)}consumer(t){let e=new BufferConsumer(void 0===t?this.pBuffer.subarray(this.pByteOffset):this.pBuffer.subarray(this.pByteOffset,this.pByteOffset+t),void 0,this.pByteOrder);return this.safeIncrease(t),e}isConsumed(){return this.pByteOffset===this.pBuffer.length}safeIncrease(t){this.pByteOffset=void 0===t?this.pBuffer.length:Math.min(this.pByteOffset+t,this.pBuffer.length)}}