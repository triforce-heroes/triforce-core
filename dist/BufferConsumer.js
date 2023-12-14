import { ByteOrder } from "./types/ByteOrder.js";
export class BufferConsumer {
    pBuffer;
    pByteOffset;
    pByteOrder;
    constructor(pBuffer, pByteOffset = 0, pByteOrder = ByteOrder.LITTLE_ENDIAN) {
        this.pBuffer = pBuffer;
        this.pByteOffset = pByteOffset;
        this.pByteOrder = pByteOrder;
    }
    get byteOffset() {
        return this.pByteOffset;
    }
    at(byteOffset = 0) {
        return this.pBuffer.readUInt8(this.pByteOffset + byteOffset);
    }
    atConsumable(value) {
        if (this.at() !== value) {
            return false;
        }
        this.skip();
        return true;
    }
    readByte() {
        const value = this.pBuffer.readUInt8(this.pByteOffset);
        this.pByteOffset++;
        return value;
    }
    readInt16() {
        const value = this.pByteOrder === ByteOrder.LITTLE_ENDIAN
            ? this.pBuffer.readInt16LE(this.pByteOffset)
            : this.pBuffer.readInt16BE(this.pByteOffset);
        this.pByteOffset += 2;
        return value;
    }
    readUnsignedInt16() {
        const value = this.pByteOrder === ByteOrder.LITTLE_ENDIAN
            ? this.pBuffer.readUIntLE(this.pByteOffset, 2)
            : this.pBuffer.readUIntBE(this.pByteOffset, 2);
        this.pByteOffset += 2;
        return value;
    }
    readInt32() {
        const value = this.pByteOrder === ByteOrder.LITTLE_ENDIAN
            ? this.pBuffer.readIntLE(this.pByteOffset, 4)
            : this.pBuffer.readIntBE(this.pByteOffset, 4);
        this.pByteOffset += 4;
        return value;
    }
    readUnsignedInt32() {
        const value = this.pByteOrder === ByteOrder.LITTLE_ENDIAN
            ? this.pBuffer.readUIntLE(this.pByteOffset, 4)
            : this.pBuffer.readUIntBE(this.pByteOffset, 4);
        this.pByteOffset += 4;
        return value;
    }
    readFloat() {
        const value = this.pByteOrder === ByteOrder.LITTLE_ENDIAN
            ? this.pBuffer.readFloatLE(this.pByteOffset)
            : this.pBuffer.readFloatBE(this.pByteOffset);
        this.pByteOffset += 4;
        return value;
    }
    readString(bytes) {
        const value = this.pBuffer.toString("utf8", this.pByteOffset, this.pByteOffset + bytes);
        this.pByteOffset += bytes;
        return value;
    }
    readLengthPrefixedString(bytes = 4) {
        const offset = this.pByteOffset;
        const length = this.pByteOrder === ByteOrder.LITTLE_ENDIAN
            ? this.pBuffer.readUIntLE(this.pByteOffset, bytes)
            : this.pBuffer.readUIntBE(this.pByteOffset, bytes);
        this.pByteOffset += length + bytes;
        return this.pBuffer.toString("utf8", offset + bytes, this.pByteOffset);
    }
    readMultibytePrefixedString() {
        let length = 0;
        let shift = 0;
        while (true) {
            const byte = this.pBuffer.readUInt8(this.pByteOffset++);
            length |= (byte & 0x7f) << shift;
            shift += 7;
            if ((byte & 0x80) === 0) {
                break;
            }
        }
        if (length === 0) {
            return "";
        }
        const bufferString = this.pBuffer.toString("utf8", this.pByteOffset, this.pByteOffset + length);
        this.pByteOffset += length;
        return bufferString;
    }
    readNullTerminatedString() {
        const offset = this.pByteOffset;
        const nullOffset = this.pBuffer.indexOf("\n", this.pByteOffset);
        if (nullOffset === -1) {
            this.pByteOffset = this.pBuffer.length;
            return this.pBuffer.subarray(offset).toString("utf8");
        }
        this.pByteOffset = nullOffset + 1;
        return this.pBuffer.subarray(offset, nullOffset).toString("utf8");
    }
    back(bytes = 1) {
        this.pByteOffset -= bytes;
        return this;
    }
    skip(bytes = 1) {
        this.pByteOffset += bytes;
        return this;
    }
    rest() {
        return this.pBuffer.subarray(this.pByteOffset);
    }
    isConsumed() {
        return this.pByteOffset === this.pBuffer.length;
    }
}
